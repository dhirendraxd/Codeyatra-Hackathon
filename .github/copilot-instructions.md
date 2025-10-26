# Testera AI Coding Agent Instructions

## Project Overview
Testera is an AI-powered job assessment platform built with React + TypeScript, Vite, Supabase (PostgreSQL), and shadcn/ui. Employers create AI-generated job assessments; candidates take tests and get scored automatically.

## Architecture & Key Patterns

### Frontend Stack
- **Framework**: React 18 + TypeScript with Vite 6
- **Styling**: Tailwind CSS with shadcn/ui components (default theme, slate base)
- **State**: React hooks + TanStack Query for server state
- **Routing**: React Router v6 with protected routes via auth checks
- **Forms**: React Hook Form + Zod validation
- **Theme**: Dark mode via `next-themes` (storageKey: `testera-theme`)

### Backend & Database
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Tables**: `assessments`, `assessment_results`, `profiles`, `company_sustainability`
- **Auth Pattern**: Session-based with `supabase.auth.getSession()` checks before protected operations
- **Edge Functions**: `generate-assessment` (Deno) calls OpenAI GPT-4o-mini for question generation

### Critical Conventions

#### 1. Authentication Flow
**Always** check auth before protected operations:
```tsx
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  toast({ title: "Authentication required", variant: "destructive" });
  navigate("/auth");
  return;
}
```
- Rate limiting on signup: 45-second cooldown between attempts (see `Auth.tsx`)
- User profiles auto-created in `profiles` table (RLS enabled)

#### 2. Toast Notifications
Use shadcn toast for all user feedback (not console logs):
```tsx
import { useToast } from "@/hooks/use-toast";
const { toast } = useToast();
toast({ title: "Success", description: "Assessment created" });
```

#### 3. Supabase Data Patterns
- **Type-safe queries**: Import `Database` types from `@/integrations/supabase/types`
- **Relations**: Use `.select('*, assessment_results(score, completed_at)')` for joins
- **Real-time**: Use `supabase.auth.onAuthStateChange()` for auth listeners

#### 4. Form Validation
All forms use Zod schemas + React Hook Form:
```tsx
const formSchema = z.object({
  topic: z.string().min(1, "Please enter a topic"),
  jobTitle: z.string().min(1, "Please enter the job title"),
});
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
});
```

#### 5. Component Organization
```
src/
├── components/
│   ├── ui/              # shadcn components (don't manually edit)
│   ├── assessment/      # Assessment-specific components
│   ├── dashboard/       # Dashboard widgets
│   ├── employee/        # Job seeker views
│   └── landing/         # Marketing/homepage
├── pages/               # Route components
├── integrations/supabase/ # Auto-generated types & client
└── lib/utils.ts         # cn() utility for className merging
```

## Development Workflows

### Running the App
```bash
npm install --legacy-peer-deps  # Required: Vite 6 has peer dep conflicts with @vitejs/plugin-react-swc
npm run dev -- --host           # Runs on http://localhost:8080
```

### Key Routes
- `/` - Landing page (employer/employee split)
- `/employee` - Job seeker portal
- `/auth` - Email/password auth (no OAuth)
- `/dashboard` - User dashboard (protected)
- `/create-assessment` - AI assessment generator for practice
- `/create-employer-assessment` - AI assessment for job postings
- `/take-assessment` - Candidate assessment interface

### Supabase Edge Functions
Located in `supabase/functions/generate-assessment/`:
- Requires `OPENAI_API_KEY` env var in Supabase dashboard
- Returns JSON: `{ questions: [{ question, options, correctAnswer, explanation }] }`
- Invoked via `supabase.functions.invoke('generate-assessment', { body: { topic } })`

### Database Schema Highlights
```typescript
// assessments table
{
  id: string;
  topic: string;
  questions: Json;  // Array of question objects
  user_id: string;
  job_title?: string;
  assessment_type?: string;
  company_name?: string;
  created_at: string;
}

// assessment_results table
{
  id: string;
  assessment_id: string;
  user_id: string;
  answers: Json;
  score: number;
  completed_at: string;
  company_selection_status?: string;
}
```

## Common Pitfalls & Solutions

1. **Peer Dependency Errors**: Always use `npm install --legacy-peer-deps` (Vite 6 + older plugin versions)
2. **Missing Auth Checks**: Never call `.from()` or `.functions.invoke()` without checking session first
3. **Toast Import Paths**: Use `@/hooks/use-toast` (not `@/components/ui/use-toast`) - both exist but hook is correct
4. **Theme Toggle**: Uses `next-themes` not custom context - import `ThemeToggle` component from `@/components/theme/ThemeToggle`
5. **Navigation After Auth**: Always use `navigate()` with `useNavigate()` hook, not `<Link>` for programmatic navigation

## AI-Specific Patterns

### Assessment Generation Flow
1. User submits job details → `CreateEmployerAssessment.tsx`
2. Call Supabase Edge Function → `supabase.functions.invoke('generate-assessment')`
3. Edge function calls OpenAI GPT-4o-mini with strict JSON schema
4. Store result in `assessments` table with `questions` JSONB column
5. Navigate to `/view-generated-assessment` with state

### Scoring Logic
- MCQ questions: Auto-scored by comparing `correctAnswer` index
- Stored in `assessment_results.answers` as JSON array
- Score calculation: `(correct / total) * 100`

## Environment Setup
- Supabase URL/Key hardcoded in `src/integrations/supabase/client.ts` (should move to env vars)
- OpenAI API key required in Supabase project secrets (not in repo)
- Theme stored in localStorage as `testera-theme`

## When Adding Features
1. Create Zod schema for forms
2. Check auth session before data operations
3. Use toast for user feedback
4. Follow shadcn/ui component patterns (import from `@/components/ui/`)
5. Update database types after Supabase schema changes via Supabase CLI
6. Keep routing in `App.tsx` - no nested route configs

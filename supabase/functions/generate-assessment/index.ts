import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, jobTitle, assessmentType, requiredSkills, companyDescription } = await req.json()

    // Here you would typically call OpenAI or your AI service
    // For now, return mock data
    const questions = [
      {
        question: `${topic}: What is the primary benefit of using TypeScript over JavaScript?`,
        options: [
          "Static type checking",
          "Faster runtime performance",
          "Smaller bundle size",
          "Built-in database integration"
        ],
        correctAnswer: 0,
        explanation: "TypeScript's main advantage is static type checking during development, which helps catch errors before runtime."
      },
      // ... more questions
    ]

    return new Response(
      JSON.stringify({ questions }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
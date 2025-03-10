import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import Employee from "./pages/Employee";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateAssessment from "./pages/CreateAssessment";
import CreateEmployerAssessment from "@/pages/CreateEmployerAssessment";
import ViewGeneratedAssessment from "@/pages/ViewGeneratedAssessment";
import TakeAssessment from "@/pages/TakeAssessment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="testera-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-assessment" element={<CreateAssessment />} />
            <Route path="/create-employer-assessment" element={<CreateEmployerAssessment />} />
            <Route path="/view-generated-assessment" element={<ViewGeneratedAssessment />} />
            <Route path="/take-assessment" element={<TakeAssessment />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CalendarView from './pages/CalendarPage';
import ResumeParser from "./pages/ResumeParser";
import InterviewSchedulerPage from "./pages/InterviewSchedulerPage";
import MeetingHistory from "./pages/MeetingHistory";
import ResumeArchive from "./pages/ResumeArchive";
import NotFound from "./pages/NotFound";
import SettingsPage from "@/pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster /> 
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/parser" element={<ResumeParser />} />
          <Route path="/scheduler" element={<InterviewSchedulerPage />} />
          <Route path="/meetings" element={<MeetingHistory />} />
          <Route path="/archive" element={<ResumeArchive />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>  
);

export default App;

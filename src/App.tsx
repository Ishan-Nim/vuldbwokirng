
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import BlogList from "./pages/BlogList";
import Blog from "./pages/Blog";
import Purpose from "./pages/Purpose";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

// Sitemap route handler component
const SitemapXML = () => {
  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        // Invoke the generate-sitemap function
        await supabase.functions.invoke('generate-sitemap');
        
        // Redirect to the correct URL
        window.location.href = `https://ehow-vulnerability.com/sitemap.xml`;
      } catch (error) {
        console.error("Error fetching sitemap:", error);
        document.body.innerHTML = '<h1>Error loading sitemap</h1>';
      }
    };
    
    fetchSitemap();
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
          <Route path="/blog" element={<MainLayout><BlogList /></MainLayout>} />
          <Route path="/blog/:id" element={<MainLayout><Blog /></MainLayout>} />
          <Route path="/purpose" element={<MainLayout><Purpose /></MainLayout>} />
          <Route path="/sitemap.xml" element={<SitemapXML />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

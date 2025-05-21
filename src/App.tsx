
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import BlogList from "./pages/BlogList";
import Blog from "./pages/Blog";
import Purpose from "./pages/Purpose";
import CVSS from "./pages/CVSS";
import NotFound from "./pages/NotFound";
import { supabase } from "./integrations/supabase/client";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Sitemap route handler component
const SitemapXML: React.FC = () => {
  React.useEffect(() => {
    const fetchSitemap = async () => {
      try {
        // Invoke the generate-sitemap function
        const { data: response, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          throw error;
        }

        // Set the content type to XML
        document.querySelector('html')?.setAttribute('content-type', 'application/xml');
        document.body.innerHTML = response || '<h1>Error: No sitemap content returned</h1>';
      } catch (error) {
        console.error("Error fetching sitemap:", error);
        document.body.innerHTML = `<h1>Error loading sitemap</h1><pre>${JSON.stringify(error, null, 2)}</pre>`;
      }
    };
    
    fetchSitemap();
  }, []);
  
  return null;
};

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="ehow-vulnerability-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainLayout><Index /></MainLayout>} />
                <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
                <Route path="/admin/*" element={<MainLayout><Admin /></MainLayout>} />
                <Route path="/blog" element={<MainLayout><BlogList /></MainLayout>} />
                <Route path="/blog/:id" element={<MainLayout><Blog /></MainLayout>} />
                <Route path="/purpose" element={<MainLayout><Purpose /></MainLayout>} />
                <Route path="/cvss" element={<MainLayout><CVSS /></MainLayout>} />
                <Route path="/sitemap.xml" element={<SitemapXML />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

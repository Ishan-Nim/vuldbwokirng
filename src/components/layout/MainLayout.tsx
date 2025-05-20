
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Shield, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navLinks = [
    { name: 'Vulnerability Database', path: '/', icon: <Database className="h-5 w-5" /> },
    { name: 'Security Blog', path: '/blog', icon: <BookOpen className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      <header className="bg-card dark:bg-card shadow-sm border-b z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">VulnVault</span>
              </Link>
            </div>
            <nav className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center space-x-1 px-2 py-1 rounded-md transition-colors",
                    currentPath.startsWith(link.path)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-card dark:bg-card border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>VulnVault - AI-powered CVE Knowledge Base © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

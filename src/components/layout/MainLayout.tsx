
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Database, BookOpen, Target, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAdminPage = currentPath.startsWith('/admin');
  
  // Use English for admin pages, Japanese for user-facing pages
  const navLinks = [
    { 
      name: isAdminPage ? 'Vulnerability Database' : '脆弱性データベース', 
      path: '/', 
      icon: <Database className="h-5 w-5" /> 
    },
    { 
      name: isAdminPage ? 'Security Blog' : 'セキュリティブログ', 
      path: '/blog', 
      icon: <BookOpen className="h-5 w-5" /> 
    },
    { 
      name: isAdminPage ? 'CyberSim Quotation' : 'サイバーシム見積', 
      path: '/purpose', 
      icon: <Target className="h-5 w-5" /> 
    },
    { 
      name: isAdminPage ? 'CVSS Calculator' : 'CVSS計算機', 
      path: '/cvss', 
      icon: <Calculator className="h-5 w-5" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      <header className="sticky top-0 bg-card dark:bg-card shadow-sm border-b z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-6">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "flex items-center space-x-1 px-2 py-1 rounded-md transition-colors",
                      currentPath === link.path || currentPath.startsWith(`${link.path}/`)
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.icon}
                    <span className="hidden md:inline">{link.name}</span>
                  </a>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-card dark:bg-card border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>eHow Vulnerability - {isAdminPage ? 'AI-powered CVE Knowledge Base' : 'AI搭載CVE知識ベース'} © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

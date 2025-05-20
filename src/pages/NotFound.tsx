
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">
          {isAdminPath ? "Oops! Page not found" : "ページが見つかりませんでした"}
        </p>
        <Button variant="default" asChild>
          <a href="/">
            {isAdminPath ? "Return to Home" : "ホームに戻る"}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

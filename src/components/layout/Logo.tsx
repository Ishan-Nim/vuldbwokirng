
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="relative">
        <Shield className={`${sizeClasses[size]} text-primary`} />
        <span className="absolute font-bold text-white text-xs top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          V
        </span>
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold`}>
          eHow Vulnerability
        </span>
      )}
    </Link>
  );
};

export default Logo;


import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookX, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="text-center max-w-md animate-slide-up">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-library-accent rounded-full flex items-center justify-center">
            <BookX className="h-12 w-12 text-library-primary" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-8">This page has been borrowed and not returned yet.</p>
        
        <Link to="/">
          <Button className="px-6 gap-2 bg-library-primary hover:bg-library-primary/90">
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

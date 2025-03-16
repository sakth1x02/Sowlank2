import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Frown } from "lucide-react";
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center place-content-center place-items-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <Frown className="w-24 h-24 m-4 text-red-500" />
        <p className="text-xl text-gray-600 mb-12">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

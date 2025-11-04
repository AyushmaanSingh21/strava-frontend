import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/stravaAuth";

const ProtectedRoute = ({ children }) => {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const check = async () => {
      const ok = await isAuthenticated();
      setAllowed(ok);
    };
    check();
  }, []);

  if (allowed === null) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-transparent" />
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;



import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/stravaAuth";

// `?mock` enables mock mode and remembers it for the rest of the session, so
// in-app navigation (which drops the query string) stays unlocked.
// `?mock=off` clears it.
const isMockMode = () => {
  const param = new URLSearchParams(window.location.search).get("mock");
  if (param !== null) {
    if (param === "off") {
      sessionStorage.removeItem("mock_mode");
      return false;
    }
    sessionStorage.setItem("mock_mode", "1");
    return true;
  }
  return sessionStorage.getItem("mock_mode") === "1";
};

const ProtectedRoute = ({ children }) => {
  const [allowed, setAllowed] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (isMockMode()) {
      setAllowed(true);
      return;
    }
    const check = async () => {
      const ok = await isAuthenticated();
      setAllowed(ok);
    };
    check();
  }, [location.search]);

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



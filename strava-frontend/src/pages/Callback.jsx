import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleStravaCallback } from "../services/stravaAuth";

const Callback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const code = params.get("code");
      const err = params.get("error");
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      if (!code) {
        setError("Missing authorization code.");
        setLoading(false);
        return;
      }
      const ok = await handleStravaCallback(code);
      setLoading(false);
      if (ok) {
        navigate("/dashboard", { replace: true });
      } else {
        setError("Failed to authenticate with Strava.");
      }
    };
    run();
  }, [params, navigate]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <h1 className="mb-2 text-2xl font-semibold">Strava Sign-in</h1>
      {error ? (
        <>
          <p className="mb-4 text-red-600">{error}</p>
          <button
            className="rounded bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700"
            onClick={() => (window.location.href = "/")}
          >
            Try Again
          </button>
        </>
      ) : (
        <p>Redirecting…</p>
      )}
    </div>
  );
};

export default Callback;



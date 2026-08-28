import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Cards from "./pages/Cards";
import Roast from "./pages/Roast";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Callback from "./pages/Callback";
import DataTest from "./pages/DataTest";
import Wrap from "./pages/Wrap";
import Hub from "./pages/Hub";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Hub is just navigation — no Strava data, so it needs no auth guard */}
          <Route path="/dashboard" element={<Hub />} />
          {/* Previous dashboard, kept reachable while the hub takes over /dashboard */}
          <Route
            path="/dashboard-old"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cards"
            element={
              <ProtectedRoute>
                <Cards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roast"
            element={
              <ProtectedRoute>
                <Roast />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/wrap"
            element={
              <ProtectedRoute>
                <Wrap />
              </ProtectedRoute>
            }
          />
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/data-test"
            element={
              <ProtectedRoute>
                <DataTest />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

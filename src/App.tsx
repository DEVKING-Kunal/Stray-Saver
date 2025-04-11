
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import ReportForm from "@/pages/ReportForm";
import ReportDetails from "@/pages/ReportDetails";
import MapView from "@/pages/MapView";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import SponsorForm from "@/pages/SponsorForm";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/report" element={
                <ProtectedRoute>
                  <ReportForm />
                </ProtectedRoute>
              } />
              <Route path="/report/:reportId" element={
                <ProtectedRoute>
                  <ReportDetails />
                </ProtectedRoute>
              } />
              <Route path="/map" element={
                <ProtectedRoute>
                  <MapView />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/sponsor" element={
                <ProtectedRoute>
                  <SponsorForm />
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <SubscriptionPlans />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

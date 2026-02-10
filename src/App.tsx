import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoModeToggle } from './components/DemoModeToggle';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { CreateCampaign } from './pages/Campaign/CreateCampaign';
import { TonePreview } from './pages/Campaign/TonePreview';
import { GeneratingCampaign } from './pages/Campaign/GeneratingCampaign';
import { Dashboard } from './pages/Campaign/Dashboard';
import { CampaignList } from './pages/CampaignList';
import { DemoPrep } from './pages/DemoPrep';

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-950 text-white">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DemoModeToggle />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign/:id/tone-preview" element={<TonePreview />} />
            <Route path="/campaign/:id/generating" element={<GeneratingCampaign />} />
            <Route path="/campaign/:id/dashboard" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/campaigns" replace />} />
            <Route path="/demo-prep" element={<DemoPrep />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

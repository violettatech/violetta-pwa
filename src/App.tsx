import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useSession } from './store/useSession';

// Auth / Onboarding
import Welcome from './routes/auth/Welcome';
import Register from './routes/auth/Register';
import LoginEmail from './routes/auth/LoginEmail';
import LoginPhone from './routes/auth/LoginPhone';
import LoginCode from './routes/auth/LoginCode';
import Onboarding1 from './routes/auth/Onboarding1';
import Onboarding2 from './routes/auth/Onboarding2';
import Onboarding3 from './routes/auth/Onboarding3';

// Dashboard layout + pages
import DashboardLayout from './routes/dashboard/DashboardLayout';
import Home from './routes/dashboard/Home';
import Chat from './routes/dashboard/Chat';
import Journal from './routes/dashboard/Journal';
import MyJourney from './routes/dashboard/MyJourney';
import MyNetwork from './routes/dashboard/MyNetwork';
import Profile from './routes/dashboard/Profile';
import Exercises from './routes/dashboard/Exercises';
import Settings from './routes/dashboard/Settings';
import HelpSupport from './routes/dashboard/HelpSupport';
import About from './routes/dashboard/About';

// --- IMPORT ADMIN COMPONENT ---
import AdminDashboard from './routes/admin/AdminDashboard';

// --- MODIFIED HELPER COMPONENTS for B2B ROLES ---

/**
 * PrivateRoute now checks for an admin role if required.
 * NOTE: You'll need to make sure your `session` object includes a `userType` property.
 */
function PrivateRoute({ children, requireAdmin = false }: { children: ReactElement, requireAdmin?: boolean }) {
  const { session } = useSession();

  if (!session) return <Navigate to="/auth/welcome" replace />;
  if (!session.hasCompletedOnboarding) return <Navigate to="/auth/onboarding/1" replace />;
  
  // Admin Check: Redirects if admin access is required but user is not an admin.
  // This assumes `session.userType` will be 'b2b-admin' for admin users.
  if (requireAdmin && session.userType !== 'b2b-admin') {
     console.warn("Access denied: Admin privileges required. Redirecting.");
     return <Navigate to="/dashboard/home" replace />; 
  }

  return children;
}

/**
 * RedirectHome now sends users to the correct dashboard based on their role.
 */
function RedirectHome() {
  const { session } = useSession();
  if (session && session.hasCompletedOnboarding) {
    // If user is an admin, go to admin dashboard. Otherwise, go to regular user dashboard.
    return <Navigate to={session.userType === 'b2b-admin' ? "/admin/dashboard" : "/dashboard/home"} replace />;
  }
  return <Navigate to="/auth/welcome" replace />;
}

// --- END HELPERS ---

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectHome />} />

        {/* Auth routes (unchanged) */}
        <Route path="/auth/welcome" element={<Welcome />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<LoginEmail />} />
        <Route path="/auth/login-phone" element={<LoginPhone />} />
        <Route path="/auth/login-code" element={<LoginCode />} />
        <Route path="/auth/onboarding/1" element={<Onboarding1 />} />
        <Route path="/auth/onboarding/2" element={<Onboarding2 />} />
        <Route path="/auth/onboarding/3" element={<Onboarding3 />} />

        {/* Protected App for regular/employee users (B2C) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<Home />} /> 
          <Route path="chat" element={<Chat />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journey" element={<MyJourney />} />
          <Route path="network" element={<MyNetwork />} />
          <Route path="profile" element={<Profile />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<HelpSupport />} />
          <Route path="about" element={<About />} />
          <Route index element={<Navigate to="home" replace />} /> 
        </Route>

        {/* --- NEW ADMIN ROUTE GROUP (B2B) --- */}
        <Route 
          path="/admin"
          element={
            <PrivateRoute requireAdmin={true}> 
               {/* Outlet allows for future admin-specific layouts */}
               <Outlet /> 
            </PrivateRoute>
          }
        >
           <Route path="dashboard" element={<AdminDashboard />} /> 
           {/* You can add more admin routes like path="users" here later */}
           <Route index element={<Navigate to="dashboard" replace />} /> 
        </Route>
        {/* --- END ADMIN ROUTES --- */}

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


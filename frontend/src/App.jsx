import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import HomePage from "./Pages/HomePage.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";
import LandingPage from "./Pages/LandingPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import { MarketplacePage } from "./Pages/MarketplacePage.jsx";
import { CommunityPage } from "./Pages/CommunityPage.jsx";
import CartPage from "./Pages/CartPage.jsx";
import { DashboardPage } from "./Pages/DashboardPage.jsx";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/landingpage"
          element={<LandingPage />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/community"
          element={authUser ? <CommunityPage /> : <Navigate to="/login" />}
        />
        {/* removed duplicate marketplace route */}

        <Route path="/update" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
export default App;

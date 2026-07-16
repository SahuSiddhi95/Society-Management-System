import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/auth/AdminLogin";
import UserLogin from "./pages/auth/UserLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import UserDashboard from "./pages/User/UserDashboard";
import SocietyLanding from "./pages/SocietyLanding";
import AdminRoute from "./components/Admin/AdminRoute";
import { NotificationProvider } from "../context/Notificationcontext";
// import NotificationPage from "./pages/admin/Notificationpage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<SocietyLanding />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
       <Route
  path="/admin-dashboard"
  element={
    <NotificationProvider>
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    </NotificationProvider>
  }
/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes> 
    </BrowserRouter>
  );
} 

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/auth/AdminLogin";
import UserLogin from "./pages/auth/UserLogin";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import SocietyLanding from "./pages/SocietyLanding";
import AdminRoute from "./components/Admin/AdminRoute";
import UserRoute from "./components/User/UserRoute";
import { NotificationProvider } from "../context/Notificationcontext";

// Admin Dashboard & Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import Residents from "./pages/admin/AllResident";
import EventManagement from "./pages/admin/EventManagement";
import ComplaintManagement from "./pages/admin/Complaintmanagement";
import AdminMaintenance from "./pages/admin/Adminmaintenance";
import NoticeManagementPage from "./pages/admin/Noticemanagement";
import NotificationPage from "./pages/admin/Notificationpage";
import PaymentHistoryAdmin from "./pages/admin/PaymentHistory";
import SettingsLayout from "./pages/admin/SettingsLayout";
import SocietySettings from "./pages/admin/SocietySettings";

// User Dashboard & Pages
import UserDashboard from "./pages/User/UserDashboard";
import UserDashboardHome from "./pages/User/UserDashboardHome";
import UserNotices from "./pages/User/Notices";
import UserNotifications from "./pages/User/Notifications";
import UserComplaints from "./pages/User/Complaints";
import UserDues from "./pages/User/Mydues";
import UserPaymentHistory from "./pages/User/Paymenthistory";
import UserEvent from "./pages/User/Event";
import UserSettingsLayout from "./pages/User/UserSettingsLayout";
import UserProfile from "./pages/User/UserProfile";
import UserSocietyInfo from "./pages/User/UserSocietyInfo";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<SocietyLanding />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        
        {/* ADMIN ROUTES */}
        <Route
          path="/admin-dashboard"
          element={
            <NotificationProvider>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </NotificationProvider>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="residents" element={<Residents />} />
          <Route path="complaints" element={<ComplaintManagement />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="notices" element={<NoticeManagementPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="payment-history" element={<PaymentHistoryAdmin />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<SocietySettings />} />
            <Route path="society" element={<SocietySettings />} />
            <Route path="profile" element={<div className="p-8 text-gray-500">Profile Settings (Coming Soon)</div>} />
            <Route path="security" element={<div className="p-8 text-gray-500">Security Settings (Coming Soon)</div>} />
          </Route>
        </Route>

        {/* USER ROUTES */}
        <Route 
          path="/user-dashboard" 
          element={
            <NotificationProvider>
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            </NotificationProvider>
          }
        >
          <Route index element={<UserDashboardHome />} />
          <Route path="notices" element={<UserNotices />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="complaints" element={<UserComplaints />} />
          <Route path="dues" element={<UserDues />} />
          <Route path="history" element={<UserPaymentHistory />} />
          <Route path="events" element={<UserEvent />} />
          <Route path="settings" element={<UserSettingsLayout />}>
            <Route index element={<UserProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="emergency" element={<UserSocietyInfo type="emergency" />} />
            <Route path="maintenance" element={<UserSocietyInfo type="maintenance" />} />
          </Route>
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
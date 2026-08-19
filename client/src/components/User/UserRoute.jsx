import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/user-login" replace />;
  }

  if (role !== "user") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

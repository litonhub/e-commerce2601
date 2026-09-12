import { Navigate } from "react-router";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token || !user) {
    return <Navigate to="/admin" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
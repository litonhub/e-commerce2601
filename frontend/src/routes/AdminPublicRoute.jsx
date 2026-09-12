import { Navigate } from "react-router";

const AdminPublicRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (token && user?.role === "admin") {
    return (
      <Navigate
        to="/admin-dashboard"
        replace
      />
    );
  }

  return children;
};

export default AdminPublicRoute;
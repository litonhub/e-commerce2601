import { createContext, useContext, useEffect, useState } from "react";
import { getMe as fetchMe } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const getMe = async () => {
  try {
    const res = await fetchMe();
    setUser(res.data.data);
  } catch (err) {
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token && user?.role === "user") {
    getMe();
  } else {
    setLoading(false);
  }
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
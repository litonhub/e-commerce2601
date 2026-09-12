import React, { useState } from 'react'
import { FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi"; // Added FiUser and FiLock
import { Link } from 'react-router';
import { toast } from "react-toastify";
import { login, logout } from "../../services/authService";
import { useNavigate } from "react-router";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [checked, setChecked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    setErrorMsg("");
  };

  const handleLogin = async () => {

    if (!loginData.email.trim()) {
      setErrorMsg("Email is required.");
      toast.error("Email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(loginData.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!loginData.password) {
      setErrorMsg("Password is required.");
      toast.error("Password is required.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      const response = await login(loginData);

      const { accessToken, user } =
        response.data.data;

      if (user.role !== "admin") {

        try {
          await logout();
        } catch (e) { }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        toast.error("Only admin can login here.");

        return;
      }

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      setSuccessMsg(response.data.message);
      setErrorMsg("");

      setLoginData({
        email: "",
        password: "",
      });

      toast.success(response.data.message);

      navigate("/admin-dashboard", {
        replace: true,
      });

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Something went wrong";

      setErrorMsg(message);
      setSuccessMsg("");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen relative flex flex-col items-center justify-center bg-[#F8FAF8] overflow-hidden py-20'>
      
      {/* Premium Curved Background Design */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex justify-center">
        <div className="absolute top-[-20%] w-[150%] h-[80%] bg-white rounded-b-[100%] shadow-[0_10px_40px_rgba(0,0,0,0.02)]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase">
            Administration
          </span>

          <h1 className="mt-4 text-5xl font-bold font-pop text-logoc">
            EcoBazar
            <span className="text-primary"> Admin</span>
          </h1>

          <p className="mt-2 text-gry defaultfs">
            Manage Products, Orders & Store Settings
          </p>
        </div>

        {/* Login Card */}
        <div className="flex justify-center w-full">
          <div className="w-130 max-w-[95%] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 px-6 pt-8 pb-10 backdrop-blur-sm">

            <h2 className='flex justify-center font-pop font-semibold text-hsize text-logoc leading-[120%] mb-2'>
              Admin Login
            </h2>

            <div className="pt-5 pb-4 space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-lg" />
                <input
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  className="w-full border border-brdr font-pop font-normal text-[16px] text-black placeholder:text-grynine leading-[130%] pl-11 pr-4 py-3.5 rounded-md outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className='relative group'>
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-lg" />
                <input
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-brdr font-pop font-normal text-[16px] text-black placeholder:text-grynine leading-[130%] pl-11 pr-12 py-3.5 rounded-md outline-none focus:border-primary transition-colors"
                />

                {showPassword ? (
                  <FiEyeOff
                    onClick={() => setShowPassword(false)}
                    className='size-5 text-gray-400 hover:text-primary absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer transition-colors'
                  />
                ) : (
                  <FiEye
                    onClick={() => setShowPassword(true)}
                    className='size-5 text-gray-400 hover:text-primary absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer transition-colors'
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pb-6">
              <label
                onClick={() => setChecked(!checked)}
                className='flex gap-x-2 items-center cursor-pointer group'
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${checked ? 'bg-primary border-primary' : 'border-[#cccccc]'}`}>
                  {checked && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <h4 className='defaultfs text-gry group-hover:text-gray-800 transition-colors'>
                  Remember me
                </h4>
              </label>
              <Link to="/forget" className='defaultfs text-primary hover:text-opacity-80 transition-all cursor-pointer underline'>
                Forget Password?
              </Link>
            </div>

            {errorMsg && (
              <p className="text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-sm mb-4 text-center">
                {errorMsg}
              </p>
            )}

            {successMsg && (
              <p className="text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2 text-sm mb-4 text-center">
                {successMsg}
              </p>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full cursor-pointer bg-primary py-3.5 font-pop font-semibold text-[16px] text-white leading-[120%] rounded-xl shadow-[0_8px_20px_rgba(0,178,7,0.25)] hover:shadow-[0_10px_25px_rgba(0,178,7,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Admin Access Only Footer Note */}
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-500 font-pop">
              <span className="w-12 h-px bg-gray-200"></span>
              <div className="flex items-center gap-1.5 font-medium">
                <FiLock className="text-gray-400" />
                <span className="defaultfs text-gry">Admin access only</span>
              </div>
              <span className="w-12 h-px bg-gray-200"></span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin;
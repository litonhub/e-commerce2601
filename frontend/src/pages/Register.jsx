import React, { useState } from 'react'
import Navimg from '../assets/images/navigation-img.png'
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from 'react-router';
import { toast, Bounce } from 'react-toastify';
import Container from '../components/layouts/Container';
import { register } from "../services/authService";
import PageBanner from '../components/common/PageBanner';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [checked, setChecked] = useState(false)

  const navigate = useNavigate()
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false);

  let handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value

    if (name !== 'terms') {
      setRegData({ ...regData, [name]: value })
    } else {
      setRegData({ ...regData, terms: !regData.terms })
    }
  }

  let handleClick = async () => {

    // Password Match Check
    if (regData.password !== regData.confirmPassword) {

      setErrorMsg("Passwords do not match");
      setSuccessMsg("");

      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });

      return;
    }

    // Terms Check
    if (!regData.terms) {

      setErrorMsg("Please accept Terms & Conditions");
      setSuccessMsg("");

      toast.error("Please accept Terms & Conditions", {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });

      return;
    }

    setLoading(true);

    try {

      const response = await register({
        name: regData.name.trim(),
        email: regData.email.trim().toLowerCase(),
        password: regData.password,
        confirmPassword: regData.confirmPassword,
      });

      const { success, message } = response.data;

      if (success) {
        setSuccessMsg(message);
        setRegData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });

        setChecked(false);
        setErrorMsg("");

        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });

        sessionStorage.setItem(
          "verifyEmail",
          regData.email.trim().toLowerCase()
        );

        setTimeout(() => {
          navigate("/verify-email");
        }, 1500);
      }

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Something went wrong";

      setErrorMsg(message);
      setSuccessMsg("");

      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <PageBanner
        items={[
          "Account",
          "Create Account",
        ]}
      />

      {/* Form */}
      <div className="flex justify-center py-10 lg:py-20 px-4 lg:px-0">
        <form
          className="w-full sm:w-[400px] lg:w-130 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,38,3,0.08)] border border-[#f2f2f2] px-6 pt-6 pb-8"
        >
          <h2 className='flex justify-center text-center font-pop font-semibold text-[24px] lg:text-hsize text-logoc'>
            Create Account
          </h2>

          <div className="pt-5 pb-4 space-y-3">
            <input
              value={regData.name || ""}
              autoComplete="name"
              onChange={handleChange}
              name='name'
              type="text"
              placeholder="Full Name"
              className="w-full border border-brdr font-pop text-[16px] text-black placeholder:text-grynine ps-4 py-3.5 rounded-md outline-none"
            />

            <input
              value={regData.email}
              autoComplete="email"
              onChange={handleChange}
              name='email'
              type="email"
              placeholder="Email"
              className="w-full border border-brdr font-pop text-[16px] text-black placeholder:text-grynine ps-4 py-3.5 rounded-md outline-none"
            />

            {/* Password */}
            <div className='relative'>
              <input
                value={regData.password}
                autoComplete="new-password"
                onChange={handleChange}
                name='password'
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-brdr font-pop text-[16px] text-black placeholder:text-grynine ps-4 py-3.5 rounded-md outline-none"
              />

              {showPassword ? (
                <FiEyeOff
                  onClick={() => setShowPassword(false)}
                  className='size-5 absolute top-3.5 right-4 cursor-pointer'
                />
              ) : (
                <FiEye
                  onClick={() => setShowPassword(true)}
                  className='size-5 absolute top-3.5 right-4 cursor-pointer'
                />
              )}
            </div>

            {/* Confirm Password */}
            <div className='relative'>
              <input
                value={regData.confirmPassword}
                autoComplete="new-password"
                onChange={handleChange}
                name='confirmPassword'
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full border border-brdr font-pop text-[16px] text-black placeholder:text-grynine ps-4 py-3.5 rounded-md outline-none"
              />

              {showConfirm ? (
                <FiEyeOff
                  onClick={() => setShowConfirm(false)}
                  className='size-5 absolute top-3.5 right-4 cursor-pointer'
                />
              ) : (
                <FiEye
                  onClick={() => setShowConfirm(true)}
                  className='size-5 absolute top-3.5 right-4 cursor-pointer'
                />
              )}
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-500 bg-red-100 rounded px-6 py-2 text-sm mb-3">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="text-green-800 bg-green-100 rounded px-6 py-2 text-sm mb-3">
              {successMsg}
            </p>
          )}

          {/* Checkbox */}
          <div className='flex gap-x-1.5 items-start sm:items-center pb-5'>
            <div
              onClick={() => {
                setChecked(!checked);
                setRegData({ ...regData, terms: !checked });
              }}

              className="w-5 h-5 mt-0.5 sm:mt-0 shrink-0 rounded flex items-center justify-center cursor-pointer border border-[#cccccc]"
            >
              {checked && (
                <svg
                  className="w-3 h-3 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <h4 onClick={() => {
              setChecked(!checked);
              setRegData({ ...regData, terms: !checked });
            }}
              className='defaultfs text-gry cursor-pointer'>Accept all terms & Conditions
            </h4>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleClick}
            className={`w-full py-3.5 font-pop font-semibold text-sm text-white rounded-[43px] transition-all ${loading
              ? "bg-primary/70 cursor-not-allowed"
              : "bg-primary hover:bg-[#1a8f3b] cursor-pointer"
              }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <h3 className='pt-8.5 defaultfs text-gry text-center'>
            Already have account?{" "}
            <Link to="/login" className='text-logoc font-medium underline'>Login</Link>
          </h3>
        </form>
      </div>
    </div>
  )
}

export default Register;
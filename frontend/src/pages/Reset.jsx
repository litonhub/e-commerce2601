import React, { useState } from 'react'
import Navimg from '../assets/images/navigation-img.png'
import { FiEye, FiEyeOff } from "react-icons/fi";
import Container from '../components/layouts/Container';
import { toast, Bounce } from 'react-toastify';
import PageBanner from '../components/common/PageBanner';
import { Link, useNavigate } from "react-router";
import { resetPassword } from "../services/authService";

const Reset = () => {

  const navigate = useNavigate();

  const email = sessionStorage.getItem("resetEmail");
  const otp = sessionStorage.getItem("resetOTP");

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false);

  // validation
  const validate = () => {
    if (!newPassword || !confirmPassword) {
      return "All fields are required"
    }

    const validate = () => {
      if (!newPassword || !confirmPassword) {
        return "All fields are required.";
      }

      if (newPassword !== confirmPassword) {
        return "Passwords do not match.";
      }

      return null;
    };

    if (newPassword !== confirmPassword) {
      return "Passwords do not match"
    }

    return null
  }

  const handleReset = async () => {

    const error = validate();

    if (error) {
      setErrorMsg(error);
      setSuccessMsg("");

      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });

      return;
    }

    if (!email || !otp) {
      toast.error("Session expired. Please try again.");

      navigate("/forget");

      return;
    }

    setLoading(true);

    try {

      const response = await resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      setSuccessMsg(response.data.message);
      setErrorMsg("");

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });

      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetOTP");

      setNewPassword("");
      setConfirmPassword("");
      setErrorMsg("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Something went wrong.";

      setErrorMsg(message);
      setSuccessMsg("");

      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
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
          "Forget Password",
          "Reset Password",
        ]}
      />

      <div className="flex justify-center py-10 lg:py-20 px-4 lg:px-0">
        <div className="w-full sm:w-[400px] lg:w-130 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,38,3,0.08)] border border-[#f2f2f2] px-6 pt-6 pb-8">

          <div className="text-center mx-auto">
            <h2 className='flex justify-center text-center font-pop font-semibold text-[24px] lg:text-hsize text-logoc leading-[120%] pb-2'>
              Reset your Password
            </h2>
            <p className='defaultfs text-gryd'>
              Your previous password has been reset. Please set a new password for your account.
            </p>
          </div>

          <div className="pt-8 pb-4 ">

            <div className='space-y-3'>
              <div className="relative">
                <input
                  name="password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Set a new password"
                  value={newPassword}
                  autoComplete="new-password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-brdr font-pop font-normal text-[16px] text-black placeholder:text-grynine leading-[130%] ps-4 py-3.5 rounded-md outline-none"
                />

                {showPasswords ? (
                  <FiEyeOff
                    onClick={() => setShowPasswords(false)}
                    className='size-5 text-logoc absolute top-3.5 right-4 cursor-pointer'
                  />
                ) : (
                  <FiEye
                    onClick={() => setShowPasswords(true)}
                    className='size-5 text-logoc absolute top-3.5 right-4 cursor-pointer'
                  />
                )}
              </div>

              <div className='relative'>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-brdr font-pop font-normal text-[16px] text-black placeholder:text-grynine leading-[130%] ps-4 py-3.5 rounded-md outline-none"
                />

                {showPassword ? (
                  <FiEyeOff
                    onClick={() => setShowPassword(false)}
                    className='size-5 text-logoc absolute top-3.5 right-4 cursor-pointer'
                  />
                ) : (
                  <FiEye
                    onClick={() => setShowPassword(true)}
                    className='size-5 text-logoc absolute top-3.5 right-4 cursor-pointer'
                  />
                )}
              </div>

            </div>
          </div>

          {errorMsg && (
            <p className="text-red-500 bg-red-100 rounded px-4 py-2 text-sm mb-3">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-green-700 bg-green-100 rounded px-4 py-2 text-sm mb-3">
              {successMsg}
            </p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleReset}
            className={`w-full py-3.5 font-pop font-semibold text-sm text-white leading-[120%] rounded-[43px] transition-all ${loading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary cursor-pointer hover:bg-[#1a8f3b]"
              }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <h3 className='pt-8.5 defaultfs text-gry text-center'>
            <Link to="/login" className='font-medium text-logoc underline'>
              Back to Sign in
            </Link>
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Reset;
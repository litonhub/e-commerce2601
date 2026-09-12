import React from 'react'
import Navimg from '../assets/images/navigation-img.png'
import { Link, useNavigate } from "react-router";
import { GoHome } from "react-icons/go";
import { FaChevronRight } from "react-icons/fa6";
import Container from '../components/layouts/Container';
import { useState } from "react";
import { toast } from "react-toastify";
import { verifyResetOtp, resendResetOtp } from "../services/authService";
import ResendTimer from "../components/common/ResendTimer";
import OtpInput from "react-otp-input";

const Verify = () => {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem("resetEmail");

  const handleVerify = async () => {

    if (!otp.trim()) {
      toast.error("OTP is required.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/forget");
      return;
    }

    setLoading(true);

    try {

      const response = await verifyResetOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      sessionStorage.setItem(
        "resetOTP",
        otp.trim()
      );

      toast.success(response.data.message);
      setLoading(false);

      navigate("/resetpassword");

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="relative w-full">
        <img src={Navimg} alt="navigation-img" className="w-full h-20 sm:h-24 lg:h-30 object-cover" />

        <div className="absolute flex inset-0 pt-6 sm:pt-8 lg:pt-11">
          <Container className="w-full">
            <div className="flex flex-wrap items-center gap-2 lg:gap-x-3">
              <GoHome className="size-5 lg:size-6 text-gryd" />
              <FaChevronRight className="size-2 text-grynine" />
              <h5 className="text-grynine text-[13px] lg:text-base">Account</h5>
              <FaChevronRight className="size-2 text-grynine" />
              <h5 className="text-grynine text-[13px] lg:text-base">Forget Password</h5>
              <FaChevronRight className="size-2 text-grynine" />
              <h5 className="text-primary text-[13px] lg:text-base">Verify Code</h5>
            </div>
          </Container>
        </div>
      </div>

      <div className="flex justify-center py-10 lg:py-20 px-4 lg:px-0">
        <div className="w-full sm:w-[400px] lg:max-w-none lg:w-130 lg:mx-auto bg-white rounded-lg shadow-[0_4px_10px_rgba(0,38,3,0.08)] border border-[#f2f2f2] px-6 pt-6 pb-8">

          <div className='text-center'>
            <h2 className='flex justify-center text-center font-pop font-semibold text-[24px] lg:text-hsize text-logoc leading-[120%]'>
              Verify code
            </h2>
            <p className='defaultfs text-grynine pt-2'>An authentication code has been sent to your email.</p>
          </div>

          <div className="pt-7 pb-5 flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="tel"
              shouldAutoFocus
              containerStyle={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl border border-[#E5E5E5] bg-white text-center text-xl font-semibold text-[#1A1A1A] outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-green-100 shadow-sm"
                />
              )}
            />

          </div>
          <div className="pb-5 pt-1 text-center">
            <ResendTimer
              onResend={async () => {
                const res = await resendResetOtp({
                  email: email.trim().toLowerCase(),
                });
                toast.info(res.data.message);
              }}
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleVerify}
            className={`w-full py-3.5 rounded-[43px] font-pop font-semibold text-sm text-white transition-all duration-300 ${loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-primary hover:bg-green-700"
              }`}
          >
            {loading ? "Verifying..." : "Verify"}
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

export default Verify;
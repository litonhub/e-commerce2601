import React, { useState } from 'react'
import Navimg from '../assets/images/navigation-img.png'
import Container from '../components/layouts/Container';
import ResendTimer from '../components/common/ResendTimer';
import PageBanner from '../components/common/PageBanner';
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { forgotPassword } from "../services/authService";

const Forget = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("")

  const handleForget = async () => {

    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {

      const response = await forgotPassword({
        email: email.trim().toLowerCase(),
      });

      sessionStorage.setItem(
        "resetEmail",
        email.trim().toLowerCase()
      );
      toast.success(response.data.message);

      setEmail("");

      navigate("/verify");

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Something went wrong.";

      toast.error(message);
    }
  };

  return (
    <>
      <PageBanner
        items={[
          "Account",
          "Forget Password",
        ]}
      />

      <div className="flex justify-center py-10 lg:py-20 px-4 lg:px-0">
        <div className="w-full sm:w-[400px] lg:w-130 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,38,3,0.08)] border border-[#f2f2f2] px-6 pt-6 pb-8 text-center">

          <h2 className='flex justify-center text-center font-pop font-semibold text-[24px] lg:text-hsize text-logoc leading-[120%]'>
            Forget your password?
          </h2>
          <p className='defaultfs text-grynine pt-2'>Enter your email below to recover your password</p>

          <div className="py-5">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brdr font-pop font-normal text-[16px] text-black placeholder:text-grynine leading-[130%] ps-4 py-3.5 rounded-md outline-none"
            />
          </div>

          <button
            onClick={handleForget}
            className="w-full bg-primary py-3.5 font-pop font-semibold text-sm text-white leading-[120%] rounded-[43px] cursor-pointer">
            Submit
          </button>

          <h3 className='pt-8.5 defaultfs text-gry text-center'>
            <Link to="/login" className='font-medium text-logoc underline'>
              Back to Sign in
            </Link>
          </h3>

        </div>
      </div>
    </>
  )
}

export default Forget;
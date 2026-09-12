import React from 'react'
import Navimg from '../assets/images/navigation-img.png'
import { Link, useNavigate } from "react-router";
import { GoHome } from "react-icons/go";
import { FaChevronRight } from "react-icons/fa6";
import Container from '../components/layouts/Container';
import { useState } from "react";
import { toast } from "react-toastify";
import { verifyEmail, resendEmailVerification } from "../services/authService";
import ResendTimer from "../components/common/ResendTimer";
import OtpInput from "react-otp-input";

const VerifyEmail = () => {

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const email = sessionStorage.getItem("verifyEmail");

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
            toast.error("Verification session expired.");
            navigate("/register");
            return;
        }

        setLoading(true);

        try {

            const response = await verifyEmail({
                email,
                otp,
            });

            sessionStorage.removeItem("verifyEmail");

            toast.success(response.data.message);

            navigate("/login");

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
                <img src={Navimg} alt="navigation-img" className="w-full h-30 object-cover" />

                <div className="absolute flex inset-0 pt-11">
                    <Container className="w-full">
                        <div className="flex items-center gap-x-3">
                            <GoHome className="size-6 text-gryd" />
                            <FaChevronRight className="size-2 text-grynine" />
                            <h5 className="text-grynine">Account</h5>
                            <FaChevronRight className="size-2 text-grynine" />
                            <h5 className="text-grynine">Create Account</h5>
                            <FaChevronRight className="size-2 text-grynine" />
                            <h5 className="text-primary">Verify Email</h5>
                        </div>
                    </Container>
                </div>
            </div>

            <div className="flex justify-center py-20">
                <div className="w-full max-w-130 mx-4 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,38,3,0.08)] border border-[#f2f2f2] px-6 pt-6 pb-8">

                    <div className='text-center'>
                        <h2 className='flex justify-center font-pop font-semibold text-hsize text-logoc leading-[120%]'>
                            <h2>
                                Verify Your Email
                            </h2>
                        </h2>
                        <p className='defaultfs text-grynine pt-2'>
                            We have sent a 6-digit verification code to your email address.
                        </p>
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
                                gap: "12px",
                                width: "100%",
                            }}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl border border-[#E5E5E5] bg-white text-center text-xl font-semibold text-[#1A1A1A] outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-green-100 shadow-sm"
                                />
                            )}
                        />

                    </div>
                    <div className="pb-5 pt-1 text-center">
                        <ResendTimer
                            onResend={async () => {
                                const res = await resendEmailVerification({
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

export default VerifyEmail;


import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getSingleOrder } from "../services/orderService";
import { toast } from "react-toastify";
import {
    FaBoxOpen,
    FaTruck,
    FaCheckCircle,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Container from "./layouts/Container";
import PageBanner from "./common/PageBanner";
import { useTranslation } from "react-i18next"; // <-- Language Import

const TrackOrder = () => {
    const { t } = useTranslation(); // <-- Translation Hook
    const [searchParams] = useSearchParams();
    const urlOrderId = searchParams.get("orderId");

    const [trackingId, setTrackingId] = useState("");
    const [orderIdToFetch, setOrderIdToFetch] = useState(null);

    useEffect(() => {
        if (urlOrderId) {
            setTrackingId(urlOrderId);
            setOrderIdToFetch(urlOrderId);
        }
    }, [urlOrderId]);

    const { data: orderResponse, isLoading, isError, error } = useQuery({
        queryKey: ["order", orderIdToFetch],
        queryFn: () => getSingleOrder(orderIdToFetch),
        enabled: !!orderIdToFetch,
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            toast.error(error?.response?.data?.message || t('track_order.not_found', "Order not found. Please check your Order ID."));
            setOrderIdToFetch(null);
        }
    }, [isError, error, t]);

    const orderData = orderResponse?.data;
    const showOrder = !!orderData && !isError;

    const handleTrack = (e) => {
        e.preventDefault();
        if (!trackingId.trim()) {
            toast.warn(t('track_order.enter_valid', "Please enter a valid Order ID."));
            return;
        }
        setOrderIdToFetch(trackingId);
    };

    const getTrackingSteps = (status) => {
        const statuses = ["pending", "processing", "shipped", "delivered"];
        const currentIndex = statuses.indexOf(status);

        return [
            { title: t('track_order.step_placed', "Order Placed"), active: currentIndex >= 0, icon: <FaBoxOpen /> },
            { title: t('track_order.step_processing', "Processing"), active: currentIndex >= 1, icon: <FaCheckCircle /> },
            { title: t('track_order.step_out', "Out For Delivery"), active: currentIndex >= 2, icon: <FaTruck /> },
            { title: t('track_order.step_delivered', "Delivered"), active: currentIndex >= 3, icon: <FaMapMarkerAlt /> },
        ];
    };

    const trackingSteps = showOrder ? getTrackingSteps(orderData.orderStatus) : [];

    return (
        <>
            <PageBanner items={[t('track_order.banner', "Track Order")]} />
            <section className="py-20 font-pop bg-gray-50/50 min-h-screen">
                <Container>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
                            {t('track_order.title', 'Track Your Order')}
                        </h1>
                        <p className="text-gray-500 max-w-lg mx-auto">
                            {t('track_order.desc', 'Enter your order number below to get real-time updates about your delivery status and shipping progress.')}
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                                <input
                                    type="text"
                                    placeholder={t('track_order.placeholder', "Enter Order ID (e.g. 64a5e...)")}
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl pl-12 pr-5 py-3.5 outline-none focus:border-[#00B207] focus:ring-1 focus:ring-[#00B207] transition-all bg-gray-50/50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#00B207] hover:bg-[#009206] text-white font-semibold px-8 py-3.5 rounded-xl transition flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    t('track_order.track_btn', "Track Order")
                                )}
                            </button>
                        </form>
                    </div>

                    {isLoading && !showOrder && !isError && (
                        <div className="mt-12 flex flex-col items-center justify-center text-gray-500 gap-3">
                            <div className="w-8 h-8 border-4 border-[#00B207] border-t-transparent rounded-full animate-spin"></div>
                            <p>{t('track_order.fetching', 'Fetching your order details...')}</p>
                        </div>
                    )}

                    {showOrder && !isLoading && (
                        <div className="mt-12 max-w-4xl mx-auto space-y-6">

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{t('track_order.order_id', 'Order ID')}</p>
                                        <h3 className="text-xl font-bold text-[#1A1A1A]">
                                            #{orderData._id}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                                            <span>{t('track_order.placed_on', 'Placed on:')}</span>
                                            <span className="font-medium text-gray-800">
                                                {new Date(orderData.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <div className="bg-green-50/80 px-4 py-3 rounded-xl flex-1 md:flex-none border border-green-100">
                                            <p className="text-[13px] text-gray-500 mb-0.5">{t('track_order.status', 'Status')}</p>
                                            <h4 className="font-semibold text-[#00B207] capitalize">
                                                {orderData.orderStatus}
                                            </h4>
                                        </div>
                                        <div className="bg-orange-50/80 px-4 py-3 rounded-xl flex-1 md:flex-none border border-orange-100">
                                            <p className="text-[13px] text-gray-500 mb-0.5">{t('track_order.payment', 'Payment')}</p>
                                            <h4 className="font-semibold text-orange-600 capitalize">
                                                {orderData.paymentStatus}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                                <h3 className="text-lg font-bold mb-12 text-[#1A1A1A] border-b border-gray-100 pb-4">
                                    {t('track_order.progress', 'Tracking Progress')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 relative">
                                    <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-1 bg-gray-100 rounded-full z-0"></div>

                                    {trackingSteps.map((step, index) => (
                                        <div key={index} className="relative z-10 text-center flex flex-row md:flex-col items-center md:justify-start gap-4 md:gap-0">
                                            {index !== trackingSteps.length - 1 && (
                                                <div className={`md:hidden absolute left-[1.35rem] top-12 bottom-[-2rem] w-0.5 ${step.active ? "bg-[#00B207]" : "bg-gray-200"}`}></div>
                                            )}

                                            <div
                                                className={`w-12 h-12 shrink-0 mx-auto rounded-full flex items-center justify-center text-xl transition-colors duration-300 ring-4 ring-white
                                                ${step.active ? "bg-[#00B207] text-white shadow-md shadow-green-500/30" : "bg-gray-100 text-gray-400"}`}
                                            >
                                                {step.icon}
                                            </div>

                                            <div className="text-left md:text-center md:mt-4">
                                                <h4 className={`font-semibold text-[15px] ${step.active ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                                                    {step.title}
                                                </h4>
                                            </div>

                                            {index !== trackingSteps.length - 1 && step.active && (
                                                <div className="hidden md:block absolute top-7 left-[50%] w-full h-1 bg-[#00B207] -z-10 transition-all duration-500"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h3 className="text-lg font-bold mb-6 border-b border-gray-100 pb-4">{t('track_order.shipping_details', 'Shipping Details')}</h3>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        <FaMapMarkerAlt className="text-[#00B207] text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1A1A1A] mb-1">
                                            {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
                                        </h4>
                                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                                            {orderData.shippingAddress.street}, <br />
                                            {orderData.shippingAddress.city}, {orderData.shippingAddress.country}
                                        </p>
                                        <p className="text-gray-700 font-medium text-sm mt-3 flex items-center gap-2">
                                            <span className="text-gray-400">{t('track_order.phone', 'Phone:')}</span> {orderData.shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </Container>
            </section>
        </>
    );
};

export default TrackOrder;
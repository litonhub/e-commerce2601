import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next"; 

import Container from "../../components/layouts/Container";
import Sidebar from "../../components/common/DashboardSidebar";
import PageBanner from "../../components/common/PageBanner";
import { logout as logoutRequest } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getSingleOrder } from "../../services/orderService";

const OrderDetails = () => {
  const { t, i18n } = useTranslation(); 
  const { id } = useParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { data: orderResponse, isLoading, isError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getSingleOrder(id),
    enabled: !!id,
  });

  const order = orderResponse?.data;

  const handleLogout = async () => {
    try {
      await logoutRequest();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success(t('order_details.logout_success', "Logout successful."));
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || t('order_details.logout_failed', "Logout failed."));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00B207] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">{t('order_details.not_found', 'Order Not Found')}</h2>
        <button onClick={() => navigate("/order-history")} className="bg-[#00B207] text-white px-6 py-2 rounded-full cursor-pointer">{t('order_details.back_to_orders', 'Back to Orders')}</button>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const itemsCount = order.items?.length || order.orderItems?.length || 0;
  const products = order.items || order.orderItems || [];

  const subTotal = order.subTotal || order.itemsPrice || 0;
  const shipping = order.shippingPrice || order.shippingCost || 0;
  const discount = order.discount || order.discountAmount || 0;
  const total = order.totalPrice || order.totalAmount || order.grandTotal || 0;

  const statuses = ["pending", "processing", "shipped", "delivered"];
  const currentStatusIndex = statuses.indexOf(order.orderStatus?.toLowerCase() || "pending");

  const trackingSteps = [
    { title: t('order_details.order_received', "Order received"), step: 1 },
    { title: t('order_details.processing', "Processing"), step: 2 },
    { title: t('order_details.on_the_way', "On the way"), step: 3 },
    { title: t('order_details.delivered', "Delivered"), step: 4 },
  ];

  return (
    <>
      <PageBanner items={[
        t('order_details.account', "Account"),
        t('order_details.order_history', "Order History"),
        t('order_details.order_details', "Order Details")
      ]} />

      <Container>
        <div className="flex flex-col md:flex-row gap-6 pt-6 md:pt-8 pb-12 lg:pb-20 min-h-screen font-pop text-[#1A1A1A]">
          <Sidebar activeMenu="Order History" handleLogout={handleLogout} />

          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

              {/* Header */}
              <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-[13px] md:text-[15px]">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 w-full sm:w-auto mb-1 sm:mb-0">{t('order_details.order_details', 'Order Details')}</h3>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="text-gray-600">{orderDate}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{itemsCount} {t('order_details.products', 'Products')}</span>
                </div>
                <button
                  onClick={() => navigate("/order-history")}
                  className="text-[#00B207] text-sm md:text-base font-medium hover:text-[#009206] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {t('order_details.back_to_list', 'Back to List')}
                </button>
              </div>

              <div className="p-4 md:p-6">
                {/* Top Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 md:mb-10">
                  <div className="lg:col-span-2 border border-gray-200 rounded-lg grid grid-cols-1 md:grid-cols-2">

                    <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
                      <h4 className="text-[11px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">{t('order_details.billing_address', 'Billing Address')}</h4>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                        {order.billingAddress?.firstName || order.shippingAddress?.firstName} {order.billingAddress?.lastName || order.shippingAddress?.lastName}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm mb-4 leading-relaxed max-w-[200px]">
                        {order.billingAddress?.street || order.shippingAddress?.street}, <br />
                        {order.billingAddress?.city || order.shippingAddress?.city}, {order.billingAddress?.country || order.shippingAddress?.country} {order.billingAddress?.zipCode || order.shippingAddress?.zipCode}
                      </p>
                      <div className="space-y-1">
                        <p className="text-[10px] md:text-xs text-gray-400 uppercase font-medium">{t('order_details.email', 'Email')}</p>
                        <p className="text-xs md:text-sm text-gray-800">{order.user?.email || "N/A"}</p>
                      </div>
                      <div className="space-y-1 mt-3">
                        <p className="text-[10px] md:text-xs text-gray-400 uppercase font-medium">{t('order_details.phone', 'Phone')}</p>
                        <p className="text-xs md:text-sm text-gray-800">{order.billingAddress?.phone || order.shippingAddress?.phone || "N/A"}</p>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <h4 className="text-[11px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">{t('order_details.shipping_address', 'Shipping Address')}</h4>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm mb-4 leading-relaxed max-w-[200px]">
                        {order.shippingAddress?.street}, <br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.country} {order.shippingAddress?.zipCode}
                      </p>
                      <div className="space-y-1">
                        <p className="text-[10px] md:text-xs text-gray-400 uppercase font-medium">{t('order_details.email', 'Email')}</p>
                        <p className="text-xs md:text-sm text-gray-800">{order.user?.email || "N/A"}</p>
                      </div>
                      <div className="space-y-1 mt-3">
                        <p className="text-[10px] md:text-xs text-gray-400 uppercase font-medium">{t('order_details.phone', 'Phone')}</p>
                        <p className="text-xs md:text-sm text-gray-800">{order.shippingAddress?.phone}</p>
                      </div>
                    </div>

                  </div>

                  <div className="border border-gray-200 rounded-lg p-5 md:p-6">
                    <div className="flex justify-between items-center mb-5 md:mb-6">
                      <div>
                        <p className="text-[11px] md:text-xs text-gray-400 uppercase font-medium mb-1">{t('order_details.order_id', 'Order ID:')}</p>
                        <p className="text-sm md:text-base font-semibold text-gray-900">#{order._id.substring(0, 4)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] md:text-xs text-gray-400 uppercase font-medium mb-1">{t('order_details.payment_method', 'Payment Method:')}</p>
                        <p className="text-sm md:text-base font-medium text-gray-900 capitalize">{order.paymentMethod || "Paypal"}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 md:pt-5 space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-gray-500">{t('order_details.subtotal', 'Subtotal:')}</span>
                        <span className="font-semibold text-gray-900">${Number(subTotal).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-gray-500">{t('order_details.discount', 'Discount:')}</span>
                        <span className="font-medium text-gray-900">{discount > 0 ? `$${Number(discount).toFixed(2)}` : '0%'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-gray-500">{t('order_details.shipping', 'Shipping:')}</span>
                        <span className="font-medium text-gray-900">{shipping === 0 ? t('order_details.free', "Free") : `$${Number(shipping).toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-base md:text-lg text-gray-900">{t('order_details.total', 'Total')}</span>
                        <span className="text-lg md:text-xl font-bold text-[#00B207]">${Number(total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar (Tracking) */}
                <div className="py-4 md:py-8 px-2 md:px-4 w-full max-w-4xl mx-auto mb-8 md:mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0 relative">
                    {trackingSteps.map((step, index) => {
                      const isCompleted = index < currentStatusIndex;
                      const isActive = index === currentStatusIndex;
                      const isPending = index > currentStatusIndex;

                      return (
                        <div key={index} className="relative z-10 text-center">
                          {index !== trackingSteps.length - 1 && (
                            <div className="hidden md:block absolute top-7 left-1/2 w-full h-[4px] bg-gray-100 rounded-full z-0">
                              <div className={`h-full rounded-full transition-all duration-700 ease-in-out ${isCompleted ? 'bg-[#00B207] w-full' : 'w-0'}`} />
                            </div>
                          )}

                          {index !== trackingSteps.length - 1 && (
                            <div className="md:hidden absolute top-12 left-[20px] bottom-[-40px] w-[3px] bg-gray-100 rounded-full z-0">
                              <div className={`w-full rounded-full transition-all duration-700 ease-in-out ${isCompleted ? 'bg-[#00B207] h-full' : 'h-0'}`} />
                            </div>
                          )}

                          <div className="relative z-10 flex flex-row md:flex-col items-center md:justify-center gap-4 md:gap-3">
                            <div
                              className={`w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-full flex items-center justify-center font-bold text-[14px] md:text-[17px] transition-all duration-500
                                ${isCompleted ? 'bg-[#00B207] text-white shadow-lg shadow-green-500/40 scale-100' : ''}
                                ${isActive ? 'bg-white text-[#00B207] border-[2px] md:border-[3px] border-[#00B207] ring-2 md:ring-4 ring-green-50 shadow-md scale-110' : ''}
                                ${isPending ? 'bg-white text-gray-400 border-2 border-dashed border-gray-300' : ''}
                              `}
                            >
                              {isCompleted ? <FaCheck className="w-3 h-3 md:w-5 md:h-5" /> : `0${step.step}`}
                            </div>

                            <div className="text-left md:text-center mt-0 md:mt-1">
                              <h4 className={`text-[13px] md:text-[15px] font-semibold transition-colors duration-300 ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.title}
                              </h4>
                              {isActive && (
                                <>
                                  <span className="hidden md:inline-block absolute left-1/2 -translate-x-1/2 mt-1.5 text-[10px] font-bold text-[#00B207] uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full">
                                    {t('order_details.current', 'Current')}
                                  </span>
                                  <span className="md:hidden mt-0.5 text-[9px] font-bold text-[#00B207] uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full inline-block">
                                    {t('order_details.current', 'Current')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* --- DESKTOP TABLE --- */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#F2F2F2] text-gray-500 text-xs uppercase tracking-wider font-medium">
                        <th className="px-6 py-3.5">{t('order_details.product', 'Product')}</th>
                        <th className="px-6 py-3.5">{t('order_details.price', 'Price')}</th>
                        <th className="px-6 py-3.5">{t('order_details.quantity', 'Quantity')}</th>
                        <th className="px-6 py-3.5">{t('order_details.subtotal', 'Subtotal')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 border-b border-gray-100">
                      {products.map((item, index) => {
                        const titleData = item.name || item.title || item.product?.title;
                        const itemTitle = typeof titleData === 'object' ? (titleData[i18n.language] || titleData.en) : titleData;

                        return (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-4">
                              <div className="w-12 h-12 flex-shrink-0 bg-white border border-gray-100 rounded p-1">
                                <img src={item.thumbnail || item.product?.thumbnail?.url || item.image} alt={itemTitle} className="w-full h-full object-contain" />
                              </div>
                              <span className="font-medium text-gray-900 text-[15px]">{itemTitle}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">${Number(item.price).toFixed(2)}</td>
                            <td className="px-6 py-4 text-gray-600">x{item.quantity || item.qty}</td>
                            <td className="px-6 py-4 text-gray-900 font-semibold">${Number(item.price * (item.quantity || item.qty)).toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* --- MOBILE CARDS --- */}
                <div className="md:hidden flex flex-col divide-y divide-gray-100 border-t border-gray-100 mt-2">
                  {products.map((item, index) => {
                    const titleData = item.name || item.title || item.product?.title;
                    const itemTitle = typeof titleData === 'object' ? (titleData[i18n.language] || titleData.en) : titleData;

                    return (
                      <div key={index} className="py-4 flex gap-3 items-center">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-50 border border-gray-100 rounded p-1">
                          <img src={item.thumbnail || item.product?.thumbnail?.url || item.image} alt={itemTitle} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1">{itemTitle}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">${Number(item.price).toFixed(2)} <span className="text-gray-400 mx-1">x</span> {item.quantity || item.qty}</span>
                            <span className="text-sm font-semibold text-[#00B207]">${Number(item.price * (item.quantity || item.qty)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default OrderDetails;
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next"; 

import Container from "../../components/layouts/Container";
import Sidebar from "../../components/common/DashboardSidebar";
import PageBanner from "../../components/common/PageBanner";
import { logout as logoutRequest } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../services/orderService";

const OrderHistory = () => {
  const { t, i18n } = useTranslation(); 
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const { data: ordersResponse, isLoading, isError } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const allOrders = ordersResponse?.data?.orders || ordersResponse?.data || [];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);

  const handleLogout = async () => {
    try {
      await logoutRequest();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success(t('order_history.logout_success', "Logout successful."));
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || t('order_history.logout_failed', "Logout failed."));
    }
  };

  return (
    <>
      <PageBanner items={[
        t('order_history.account', "Account"),
        t('order_history.title', "Order History")
      ]} />

      <Container>
        <div className="flex flex-col md:flex-row gap-6 pt-6 md:pt-8 pb-12 lg:pb-20 min-h-screen font-pop text-[#1A1A1A]">
          <Sidebar activeMenu="Order History" handleLogout={handleLogout} />

          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 md:p-5 border-b border-gray-100">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">{t('order_history.title', 'Order History')}</h3>
              </div>

              {/* --- DESKTOP TABLE --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#F2F2F2] text-gray-500 text-xs uppercase tracking-wider font-medium">
                      <th className="px-6 py-3.5">{t('order_history.order_id', 'Order ID')}</th>
                      <th className="px-6 py-3.5">{t('order_history.date', 'Date')}</th>
                      <th className="px-6 py-3.5">{t('order_history.total', 'Total')}</th>
                      <th className="px-6 py-3.5">{t('order_history.status', 'Status')}</th>
                      <th className="px-6 py-3.5 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {isLoading ? (
                      <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">{t('order_history.loading', 'Loading your orders...')}</td></tr>
                    ) : isError || allOrders.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">{t('order_history.empty', 'No order history found.')}</td></tr>
                    ) : (
                      currentOrders.map((order) => {
                        const orderTotal = order.totalPrice || order.totalAmount || order.total || order.grandTotal || 0;
                        const orderProductsCount = order.totalItems || order.items?.length || order.products?.length || order.orderItems?.length || 0;

                        return (
                          <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-900 font-medium">#{order._id.substring(0, 6)}</td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-900 font-medium">${Number(orderTotal).toFixed(2)}</span>
                              <span className="text-gray-500"> ({orderProductsCount} {orderProductsCount > 1 ? t('order_history.products', 'Products') : t('order_history.product', 'Product')})</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 capitalize">{order.orderStatus || t('order_history.processing', 'Processing')}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => navigate(`/order-details/${order._id}`)} className="text-[#00B207] font-medium hover:text-[#009206] transition-colors cursor-pointer">{t('order_history.view_details', 'View Details')}</button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* --- MOBILE CARDS --- */}
              <div className="md:hidden flex flex-col divide-y divide-gray-100">
                {isLoading ? (
                  <div className="p-6 text-center text-gray-500 text-sm">{t('order_history.loading', 'Loading your orders...')}</div>
                ) : isError || allOrders.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">{t('order_history.empty', 'No order history found.')}</div>
                ) : (
                  currentOrders.map((order) => {
                    const orderTotal = order.totalPrice || order.totalAmount || order.total || order.grandTotal || 0;
                    const orderProductsCount = order.totalItems || order.items?.length || order.products?.length || order.orderItems?.length || 0;
                    return (
                      <div key={order._id} className="p-4 flex flex-col gap-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 text-sm uppercase">#{order._id.substring(0, 6)}</span>
                          <span className="text-[11px] font-medium px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full capitalize">{order.orderStatus || t('order_history.processing', 'Processing')}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-sm">
                            <span className="font-bold text-gray-900">${Number(orderTotal).toFixed(2)}</span>
                            <span className="text-xs text-gray-500"> ({orderProductsCount} {orderProductsCount > 1 ? t('order_history.products', 'Products') : t('order_history.product', 'Product')})</span>
                          </div>
                          <button onClick={() => navigate(`/order-details/${order._id}`)} className="text-[#00B207] text-xs font-medium bg-[#00B207]/10 px-3 py-1.5 rounded-full cursor-pointer">{t('order_history.view_details', 'View Details')}</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 md:p-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="text-[10px] md:text-xs" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full text-sm md:text-base font-medium flex items-center justify-center cursor-pointer transition-colors ${currentPage === pageNum ? 'bg-[#00B207] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="text-[10px] md:text-xs" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default OrderHistory;
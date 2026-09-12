import React, { useEffect } from "react";
import Container from '../../components/layouts/Container';
import Sidebar from '../../components/common/DashboardSidebar';
import PageBanner from '../../components/common/PageBanner';
import { logout as logoutRequest } from "../../services/authService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDefaultAddress } from "../../services/addressService";
import { getMyOrders } from "../../services/orderService";
import { useTranslation } from "react-i18next"; 

const UserDashboard = () => {
  const { t, i18n } = useTranslation(); 
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const { data: address } = useQuery({
    queryKey: ["default-address"],
    queryFn: getDefaultAddress,
  });

  const { data: ordersResponse, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const allOrders = ordersResponse?.data?.orders || ordersResponse?.data || [];
  const recentOrders = allOrders.slice(0, 6);

  const handleLogout = async () => {
    try {
      await logoutRequest();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success(t('dashboard.logout_success', "Logout successful."));
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || t('dashboard.logout_failed', "Logout failed."));
    }
  };

  const handleEditAddress = () => {
    navigate("/settings", {
      state: { scrollTo: "billing-address" },
    });
  };

  return (
    <>
      <PageBanner items={[
        t('dashboard.account', "Account"),
        t('dashboard.title', "Dashboard")
      ]} />

      <Container>
        <div className="flex flex-col md:flex-row gap-6 pt-6 md:pt-8 pb-12 lg:pb-20 min-h-screen text-gray-800 font-pop">
          <Sidebar activeMenu="Dashboard" handleLogout={handleLogout} />

          <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Profile Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-100">
                  <img src={user?.avatar || "https://i.pravatar.cc/150?img=12"} alt={user?.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">{user?.name}</h3>
                <p className="text-gray-500 text-xs md:text-sm mb-4">{user?.role}</p>
                <Link to="/settings" className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors cursor-pointer">
                  {t('dashboard.edit_profile', 'Edit Profile')}
                </Link>
              </div>

              {/* Billing Address Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 flex flex-col justify-center">
                <h4 className="text-[11px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">{t('dashboard.billing_address', 'Billing Address')}</h4>
                {address ? (
                  <>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">{address.firstName} {address.lastName}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                      {address.street}, {address.city}, {address.state?.name || address.state}<br />
                      {address.country?.name || address.country} - {address.zipCode}
                    </p>
                    <p className="text-gray-900 text-xs md:text-sm mb-1">{address.email}</p>
                    <p className="text-gray-900 text-xs md:text-sm mb-4 md:mb-6">{address.phone}</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-xs md:text-sm mb-6">{t('dashboard.no_address', 'No billing address found.')}</p>
                )}
                <button onClick={handleEditAddress} className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors text-left cursor-pointer">
                  {address ? t('dashboard.edit_address', "Edit Address") : t('dashboard.add_address', "Add Address")}
                </button>
              </div>
            </div>

            {/* Recent Order History */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-900">{t('dashboard.recent_orders', 'Recent Order History')}</h3>
                <button
                  onClick={() => navigate("/order-history")}
                  className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors cursor-pointer"
                >
                  {t('dashboard.view_all', 'View All')}
                </button>
              </div>

              {/* --- DESKTOP TABLE --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">{t('dashboard.order_id', 'Order ID')}</th>
                      <th className="px-6 py-4 font-medium">{t('dashboard.date', 'Date')}</th>
                      <th className="px-6 py-4 font-medium">{t('dashboard.total', 'Total')}</th>
                      <th className="px-6 py-4 font-medium">{t('dashboard.status', 'Status')}</th>
                      <th className="px-6 py-4 font-medium text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {isOrdersLoading ? (
                      <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">{t('dashboard.loading', 'Loading orders...')}</td></tr>
                    ) : recentOrders.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">{t('dashboard.empty', 'No recent orders found.')}</td></tr>
                    ) : (
                      recentOrders.map((order) => {
                        const orderTotal = order.totalPrice || order.totalAmount || order.total || order.grandTotal || 0;
                        const orderProductsCount = order.totalItems || order.items?.length || order.products?.length || order.orderItems?.length || 0;
                        return (
                          <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-900 font-medium uppercase">#{order._id.substring(0, 6)}...</td>
                            <td className="px-6 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="px-6 py-4">
                              <span className="text-gray-900 font-medium">${Number(orderTotal).toFixed(2)}</span>
                              <span className="text-gray-500"> ({orderProductsCount} {orderProductsCount > 1 ? t('dashboard.products', 'Products') : t('dashboard.product', 'Product')})</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 capitalize">{order.orderStatus || t('dashboard.pending', 'Pending')}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => navigate(`/order-details/${order._id}`)} className="text-green-600 font-medium hover:text-green-700 transition-colors cursor-pointer">{t('dashboard.view_details', 'View Details')}</button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* --- MOBILE CARDS --- */}
              <div className="md:hidden flex flex-col divide-y divide-gray-100 border-t border-gray-100">
                {isOrdersLoading ? (
                  <div className="p-6 text-center text-gray-500 text-sm">{t('dashboard.loading', 'Loading orders...')}</div>
                ) : recentOrders.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">{t('dashboard.empty', 'No recent orders found.')}</div>
                ) : (
                  recentOrders.map((order) => {
                    const orderTotal = order.totalPrice || order.totalAmount || order.total || order.grandTotal || 0;
                    const orderProductsCount = order.totalItems || order.items?.length || order.products?.length || order.orderItems?.length || 0;
                    return (
                      <div key={order._id} className="p-4 flex flex-col gap-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 text-sm uppercase">#{order._id.substring(0, 6)}...</span>
                          <span className="text-[11px] font-medium px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full capitalize">{order.orderStatus || t('dashboard.pending', 'Pending')}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-sm">
                            <span className="font-bold text-gray-900">${Number(orderTotal).toFixed(2)}</span>
                            <span className="text-xs text-gray-500"> ({orderProductsCount} {orderProductsCount > 1 ? t('dashboard.products', 'Products') : t('dashboard.product', 'Product')})</span>
                          </div>
                          <button onClick={() => navigate(`/order-details/${order._id}`)} className="text-green-600 text-xs font-medium bg-green-50 px-3 py-1.5 rounded-full cursor-pointer">{t('dashboard.view_details', 'View Details')}</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UserDashboard;
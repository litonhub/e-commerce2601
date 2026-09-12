import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { 
  FiGrid, 
  FiRefreshCcw, 
  FiHeart, 
  FiShoppingBag, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import { useTranslation } from "react-i18next"; 
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutRequest } from "../../services/authService";
import { toast } from "react-toastify";


const DashboardSidebar = ({ activeMenu }) => {
  const { t } = useTranslation(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  const handleSidebarLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("guestCart");
    localStorage.removeItem("guestWishlist");
    setUser(null);

    queryClient.setQueryData(["cart"], { items: [], totalItems: 0, subtotal: 0, total: 0 });
    queryClient.setQueryData(["wishlist"], { data: { items: [], totalItems: 0 } });

    try {
      await logoutRequest();
    } catch (err) {
      console.warn("Logout warning:", err);
    }

    toast.success(t('sidebar.logout_success', "Logout successful."));
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: 'Dashboard', label: t('sidebar.dashboard', 'Dashboard'), icon: FiGrid, path: '/dashboard' },
    { name: 'Order History', label: t('sidebar.order_history', 'Order History'), icon: FiRefreshCcw, path: '/order-history' },
    { name: 'Wishlist', label: t('sidebar.wishlist', 'Wishlist'), icon: FiHeart, path: '/wishlist' },
    { name: 'Shopping Cart', label: t('sidebar.cart', 'Shopping Cart'), icon: FiShoppingBag, path: '/cart' },
    { name: 'Settings', label: t('sidebar.settings', 'Settings'), icon: FiSettings, path: '/settings' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border border-gray-200 rounded-lg shadow-sm h-fit shrink-0 overflow-hidden">
      <h2 className="hidden md:block text-lg font-semibold px-6 py-5">{t('sidebar.navigation', 'Navigation')}</h2>
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible hide-scrollbar pb-0 md:pb-4 border-b md:border-b-0 border-gray-100">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.name;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`group flex items-center shrink-0 px-4 md:px-6 py-3.5 md:py-3 font-medium transition-all ${
                isActive
                  ? 'bg-gray-100 text-gray-900 border-b-2 md:border-b-0 md:border-l-4 border-primary' 
                  : 'text-gray-600 border-b-2 md:border-b-0 md:border-l-4 border-transparent hover:bg-gray-100 hover:text-gray-900 hover:border-primary' 
              }`}
            >
              <Icon
                className={`w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 transition-colors ${
                  isActive ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-700'
                }`}
              />
              <span className="text-[13px] md:text-base whitespace-nowrap">{item.label}</span>
            </NavLink>
          );
        })}
        
        <button
          onClick={handleSidebarLogout}
          className="group flex items-center shrink-0 px-4 md:px-6 py-3.5 md:py-3 md:mt-2 text-gray-600 border-b-2 md:border-b-0 md:border-l-4 border-transparent hover:bg-gray-100 hover:text-gray-900 hover:border-primary transition-all font-medium cursor-pointer"
        >
          <FiLogOut className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
          <span className="text-[13px] md:text-base whitespace-nowrap">{t('sidebar.logout', 'Log-out')}</span>
        </button>
      </nav>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </aside>
  );
};

export default DashboardSidebar;
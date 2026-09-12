import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlinePlusCircle,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { LuTicketPercent } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router";
import { logout as logoutRequest } from "../../services/authService";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    window.location.replace("/admin");
  };

  // Premium active & inactive state styling
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${isActive
      ? "bg-primary text-white shadow-md shadow-primary/25"
      : "text-gray-500 hover:bg-primary/5 hover:text-primary"
    }`;

  return (
    <div className="flex w-64 flex-col justify-between border-r border-brdrtwo bg-white font-pop h-screen sticky top-0 overflow-y-auto">

      {/* TOP SECTION */}
      <div className="flex flex-col">

        {/* LOGO AREA */}
        <div className="flex h-20 items-center px-6">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <span className="text-lg">A</span>
            </div>
            Admin Panel
          </div>
        </div>

        {/* NAVIGATION MENU */}
        <div className="flex flex-col gap-6 px-4 pt-4 pb-8">

          {/* Main Menu Group */}
          <div>
            <p className="mb-3 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Main Menu
            </p>
            <nav className="flex flex-col gap-1.5">
              <NavLink to="/admin-dashboard" end className={linkClass}>
                <HiOutlineSquares2X2 size={20} />
                Dashboard
              </NavLink>

              <NavLink to="/admin-dashboard/products" end className={linkClass}>
                <HiOutlineShoppingBag size={20} />
                Products
              </NavLink>

              <NavLink to="/admin-dashboard/orders" className={linkClass}>
                <HiOutlineClipboardDocumentList size={20} />
                Orders
              </NavLink>
            </nav>
          </div>

          {/* Management Group */}
          <div>
            <p className="mb-3 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Management
            </p>
            <nav className="flex flex-col gap-1.5">
              
              {/* Category */}
              <NavLink to="/admin-dashboard/categories" end className={linkClass}>
                <HiOutlineTag size={20} />
                Category List
              </NavLink>
              <NavLink to="/admin-dashboard/categories/add" className={linkClass}>
                <HiOutlinePlusCircle size={20} />
                Add Category
              </NavLink>

              {/* Product */}
              <NavLink to="/admin-dashboard/products/add" className={linkClass}>
                <HiOutlinePlusCircle size={20} />
                Add Product
              </NavLink>
              <NavLink to="/admin-dashboard/bulk-add-products" className={linkClass}>
                <HiOutlinePlusCircle size={20} />
                Bulk Add Products
              </NavLink>

              {/* Coupon */}
              <NavLink to="/admin-dashboard/coupons" className={linkClass}>
                <LuTicketPercent size={20} />
                Coupons
              </NavLink>

              {/* Users */}
              <NavLink to="/admin-dashboard/users" className={linkClass}>
                <HiOutlineUsers size={20} />
                Users
              </NavLink>

              {/* Blog Management (NEW) */}
              <NavLink to="/admin-dashboard/blogs" end className={linkClass}>
                <HiOutlineDocumentText size={20} />
                Blog List
              </NavLink>
              <NavLink to="/admin-dashboard/blogs/create" className={linkClass}>
                <HiOutlinePlusCircle size={20} />
                Add Blog
              </NavLink>

            </nav>
          </div>

          {/* Settings Group */}
          <div>
            <p className="mb-3 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              System
            </p>
            <nav className="flex flex-col gap-1.5">
              <NavLink to="/admin-dashboard/analytics" className={linkClass}>
                <HiOutlineChartBar size={20} />
                Analytics
              </NavLink>
              <NavLink to="/admin-dashboard/settings" className={linkClass}>
                <HiOutlineCog6Tooth size={20} />
                Settings
              </NavLink>
            </nav>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION (LOGOUT) */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
        >
          <HiOutlineArrowLeftOnRectangle size={20} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default AdminSidebar;
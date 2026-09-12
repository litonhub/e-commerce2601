import { 
  HiOutlineBell, 
  HiOutlineMagnifyingGlass,
  HiChevronDown,
  HiOutlineUser,
  HiOutlineArrowLeftOnRectangle
} from "react-icons/hi2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { logout as logoutRequest } from "../../services/authService"; // Logout এর জন্য

const AdminTopbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (err) {
      // Ignore err
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/admin", {
      replace: true,
    });
  };

  return (
    <div className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-brdrtwo bg-white/80 px-6 font-pop backdrop-blur-md">
      
      {/* LEFT - SEARCH (Premium Look) */}
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-transparent bg-gray-50/80 px-4 py-2.5 transition-all duration-300 focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
        <HiOutlineMagnifyingGlass size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products, orders..."
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
        {/* Optional Premium touch: Search shortcut hint */}
        <div className="hidden rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-400 md:block">
          ⌘K
        </div>
      </div>

      {/* RIGHT - ICONS + USER */}
      <div className="relative flex items-center gap-3 sm:gap-5">
        
        {/* NOTIFICATION */}
        <button className="relative rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary">
          <HiOutlineBell size={24} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block"></div>

        {/* USER PROFILE TRIGGER */}
        <div
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-1.5 transition-colors hover:bg-gray-50 hover:border-gray-100"
          onClick={() => setOpen(!open)}
        >
          <img
            src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
            alt={user?.name || "Admin"}
            className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
          />

          <div className="hidden flex-col items-start md:flex">
            <span className="text-sm font-semibold leading-none text-gray-800">
              {user?.name || "Super Admin"}
            </span>
            <span className="mt-1 text-xs font-medium text-gray-500">
              Admin
            </span>
          </div>

          <HiChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} 
          />
        </div>

        {/* PREMIUM DROPDOWN MENU */}
        {open && (
          <>
            {/* Click Outside Overlay (Optional but good for UX) */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setOpen(false)} 
            />
            
            <div className="absolute right-0 top-[110%] z-50 mt-1 w-56 animate-in fade-in slide-in-from-top-2 rounded-2xl border border-brdrtwo bg-white p-2 shadow-xl shadow-gray-200/50">
              
              {/* Dropdown Header */}
              <div className="mb-2 flex flex-col border-b border-gray-100 px-3 pb-3 pt-2">
                <span className="text-sm font-bold text-gray-900">
                  {user?.name || "Super Admin"}
                </span>
                <span className="truncate text-xs font-medium text-gray-500">
                  {user?.email || "admin@store.com"}
                </span>
              </div>

              {/* Dropdown Links */}
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => {
                    navigate("/admin-dashboard/settings");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                >
                  <HiOutlineUser size={18} />
                  My Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <HiOutlineArrowLeftOnRectangle size={18} />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTopbar;
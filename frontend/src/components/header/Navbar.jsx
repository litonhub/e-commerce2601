import React, { useEffect, useState } from 'react';
import Container from '../layouts/Container';
import { FaAngleDown, FaBars, FaChevronDown, FaRegNewspaper, FaQuestionCircle, FaInfoCircle, FaPhoneAlt, FaUserCircle, FaChevronRight } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { TbPhoneCall } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation, useNavigate } from 'react-router';
import { FiLogOut } from "react-icons/fi";
import Apple from '../../assets/svg/Apple';
import Vegetables from '../../assets/svg/Vegetables';
import Fish from '../../assets/svg/Fish';
import Chicken from '../../assets/svg/Chicken';
import Drink from '../../assets/svg/Drink';
import Icecream from '../../assets/svg/Icecream';
import Cake from '../../assets/svg/Cake';
import Cream from '../../assets/svg/Cream';
import Cooking from '../../assets/svg/Cooking';
import Sidebarbg from '../../assets/images/sidebarbg.png';
import DropdownHover from '../common/DropdownHover';
import { HiOutlineTrendingUp } from "react-icons/hi";
import { FaFire, FaBolt, FaGift, FaTags, FaCalendarAlt, FaPercent } from "react-icons/fa";
import { FaLeaf, FaSun, FaRegSnowflake } from "react-icons/fa6";
import { LuArrowUpNarrowWide } from "react-icons/lu";
import { HiSquares2X2, HiOutlineShoppingBag } from "react-icons/hi2";
import { BsCalendarWeek } from "react-icons/bs";
import { FaCrown, FaTrophy, FaCartShopping, FaHeart, FaStar } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCart } from "../../services/cartService";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutRequest } from "../../services/authService";
import { toast } from "react-toastify";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  const [active, setActive] = useState("fresh vegetables");
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [isCartOpenLocal, setIsCartOpenLocal] = useState(false);

  const { data: cartData } = useQuery({ queryKey: ["cart"], queryFn: getCart });
  const totalItems = cartData?.totalItems || 0;

  useEffect(() => {
    if (sidebarOpen || mobileCategoryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen, mobileCategoryOpen]);

  useEffect(() => {
    setSidebarOpen(false);
    setMobileCategoryOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const openSidebar = () => setSidebarOpen(true);
    window.addEventListener("open-master-sidebar", openSidebar);

    const closeSidebars = () => {
      setSidebarOpen(false);
      setMobileCategoryOpen(false);
    };

    const handleCartOpen = () => {
      closeSidebars();
      setIsCartOpenLocal(true);
    };

    const handleCartClose = () => setIsCartOpenLocal(false);
    const handleCartToggle = () => {
      closeSidebars();
      setIsCartOpenLocal(prev => !prev);
    };

    window.addEventListener("open-cart-sidebar", handleCartOpen);
    window.addEventListener("close-cart-sidebar", handleCartClose);
    window.addEventListener("toggle-cart-sidebar", handleCartToggle);

    return () => {
      window.removeEventListener("open-master-sidebar", openSidebar);
      window.removeEventListener("open-cart-sidebar", handleCartOpen);
      window.removeEventListener("close-cart-sidebar", handleCartClose);
      window.removeEventListener("toggle-cart-sidebar", handleCartToggle);
    }
  }, []);

  const closeCart = () => {
    window.dispatchEvent(new Event("close-cart-sidebar"));
  };

  const toggleCart = () => {
    window.dispatchEvent(new Event("toggle-cart-sidebar"));
  };

  const openMobileCategorySidebar = () => {
    setMobileCategoryOpen(true);
    window.dispatchEvent(new Event("close-mobile-menu"));
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("guestCart");
      localStorage.removeItem("guestWishlist");
      setUser(null);

      queryClient.setQueryData(["cart"], { items: [], totalItems: 0, subtotal: 0 });
      queryClient.setQueryData(["wishlist"], { data: { items: [], totalItems: 0 } });

      setSidebarOpen(false);
      toast.success("Logout successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const menuItems = [
    {
      name: t('navbar.menu.deals.title', 'Deals'),
      badge: "HOT",
      badgeColor: "bg-[#FF8A00]",
      dropdown: true,
      options: [
        // --- [FIXED]: Updated to production flow URL 'hotDeals=true' ---
        { label: t('navbar.menu.deals.today', "Today's Deals"), path: "/shop?hotDeals=true", icon: <FaTags /> },
        { label: t('navbar.menu.deals.flash', 'Flash Sales'), path: "/shop?isDiscounted=true", icon: <FaBolt /> },
        { label: t('navbar.menu.deals.bundle', 'Bundle Offers'), path: "/shop?tag=bundle", icon: <FaGift /> },
        { label: t('navbar.menu.deals.buy1get1', 'Buy 1 Get 1'), path: "/shop?tag=buy1get1", icon: <FaFire /> },
        { label: t('navbar.menu.deals.weekend', 'Weekend Sale'), path: "/shop?tag=weekend", icon: <FaCalendarAlt /> },
        { label: t('navbar.menu.deals.clearance', 'Clearance'), path: "/shop?isDiscounted=true", icon: <FaPercent /> },
      ],
    },
    {
      name: t('navbar.menu.new_arrivals.title', 'New Arrivals'),
      badge: "NEW",
      badgeColor: "bg-[#00b207]",
      dropdown: true,
      options: [
        { label: t('navbar.menu.new_arrivals.recently', 'Recently Added'), path: "/shop?sort=new-arrivals", icon: <FaRegSnowflake /> },
        { label: t('navbar.menu.new_arrivals.fresh', 'Fresh Stock'), path: "/shop?sort=new-arrivals", icon: <BsCalendarWeek /> },
        { label: t('navbar.menu.new_arrivals.seasonal', 'Seasonal'), path: "/shop?tag=seasonal", icon: <FaSun /> },
        { label: t('navbar.menu.new_arrivals.trending', 'Trending Now'), path: "/shop?tag=trending", icon: <LuArrowUpNarrowWide /> },
        { label: t('navbar.menu.new_arrivals.organic', 'Organic'), path: "/shop?tag=organic", icon: <FaLeaf /> },
        { label: t('navbar.menu.new_arrivals.latest', 'Latest'), path: "/shop?sort=new-arrivals", icon: <HiSquares2X2 /> },
      ],
    },
    {
      icon: <HiOutlineTrendingUp />,
      name: t('navbar.menu.best_sellers.title', 'Best Sellers'),
      dropdown: true,
      options: [
        { label: t('navbar.menu.best_sellers.top_today', 'Top Today'), path: "/shop?sort=best-selling", icon: <FaFire /> },
        { label: t('navbar.menu.best_sellers.weekly', 'Weekly Best'), path: "/shop?sort=best-selling", icon: <FaTrophy /> },
        { label: t('navbar.menu.best_sellers.monthly', 'Monthly Best'), path: "/shop?sort=best-selling", icon: <FaCrown /> },
        { label: t('navbar.menu.best_sellers.most_ordered', 'Most Ordered'), path: "/shop?sort=best-selling", icon: <FaCartShopping /> },
        { label: t('navbar.menu.best_sellers.customer', 'Customer Favorites'), path: "/shop?sort=top-rated", icon: <FaHeart /> },
        { label: t('navbar.menu.best_sellers.top_rated', 'Top Rated'), path: "/shop?sort=top-rated", icon: <FaStar /> },
      ],
    },
    {
      name: t('navbar.menu.more', 'More'),
      dropdown: true,
      options: [
        { label: t('navbar.menu.blog', 'Blog'), path: "/blog", icon: <FaRegNewspaper /> },
        { label: t('navbar.menu.faq', 'FAQ'), path: "/faq", icon: <FaQuestionCircle /> },
        { label: t('navbar.menu.about', 'About Us'), path: "/about", icon: <FaInfoCircle /> },
        { label: t('navbar.menu.contact', 'Contact Us'), path: "/contact", icon: <FaPhoneAlt /> },
      ],
    }
  ];

  // --- [FIXED]: Mapped to database compatible exact lowercase values ---
  const categories = [
    { name: t('navbar.categories_list.fresh_fruit', 'Fresh Fruit'), value: 'fresh fruit', icon: <Apple /> },
    { name: t('navbar.categories_list.vegetables', 'Fresh Vegetables'), value: 'fresh vegetables', icon: <Vegetables /> },
    { name: t('navbar.categories_list.river_fish', 'River Fish'), value: 'river fish', icon: <Fish /> },
    { name: t('navbar.categories_list.chicken_meat', 'Chicken & Meat'), value: 'chicken & meat', icon: <Chicken /> },
    { name: t('navbar.categories_list.drink_water', 'Drink & Water'), value: 'beverages', icon: <Drink /> }, // Changed to beverages
    { name: t('navbar.categories_list.yogurt_icecream', 'Yogurt & Ice Cream'), value: 'yogurt & ice cream', icon: <Icecream /> },
    { name: t('navbar.categories_list.cake_bread', 'Cake & Bread'), value: 'bread & bakery', icon: <Cake /> }, // Changed to bread & bakery
    { name: t('navbar.categories_list.butter_cream', 'Butter & Cream'), value: 'butter & cream', icon: <Cream /> },
    { name: t('navbar.categories_list.cooking', 'Cooking'), value: 'cooking', icon: <Cooking /> },
  ];

  const isHomeActive = location.pathname === "/";
  const isDashboardActive = location.pathname.includes("/dashboard");

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <div className='bg-logoc hidden lg:block'>
        <Container>
          <div className='flex items-center gap-x-8 font-pop leading-[150%]'>

            <div className="flex items-center w-78 bg-subb text-white">
              <div
                className="bg-primary p-4 transition-colors hover:bg-[#009206] cursor-pointer"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars className="size-8" />
              </div>

              <div
                className="relative flex items-center flex-1 cursor-pointer"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <h4 className="px-4 py-5 font-medium text-[16px]">
                  {t('navbar.all_categories')}
                </h4>
                <FaChevronDown
                  className={`ml-auto mr-4 size-5 transition duration-300 ${isOpen ? "rotate-180" : ""}`}
                />

                <div
                  className={`absolute -left-16 top-full w-61.75 border border-brdr bg-white shadow-md z-50 transition-all duration-300 ${isOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-1"
                    }`}
                >
                  {categories.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => { setActive(item.value); navigate(`/shop?category=${encodeURIComponent(item.value)}`); setIsOpen(false); }}
                      className="group defaultfs text-logoc flex items-center gap-x-3 px-5 py-4 cursor-pointer hover:bg-primary hover:text-white transition border-b border-gray-50 last:border-0"
                    >
                      <span className="text-xl text-grynine group-hover:text-white transition-colors">{item.icon}</span>
                      {item.name}
                    </div>
                  ))}
                  <div
                    onClick={() => { navigate('/shop'); setIsOpen(false); }}
                    className="group flex items-center gap-x-3 defaultfs text-logoc px-5 py-4 cursor-pointer hover:bg-primary hover:text-white transition border-t border-brdr"
                  >
                    <AiOutlinePlus className='text-grynine text-2xl group-hover:text-white transition-colors' />
                    {t('navbar.view_all_category', 'View All Categories')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full">
              <div>
                <ul className="flex items-center text-grynine text-sm font-medium gap-x-7">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <DropdownHover
                        options={item.options}
                        onChange={(selected) => {
                          if (selected.path) {
                            navigate(selected.path);
                          } else {
                            navigate('/shop');
                          }
                        }}
                        renderTrigger={(open) => (
                          <div
                            className={`flex items-center gap-x-1 cursor-pointer transition-colors duration-300 ${open ? "text-white" : "text-grynine"} hover:text-white`}
                          >
                            {item.icon && (
                              <span className="text-xl text-primary">
                                {item.icon}
                              </span>
                            )}
                            {item.name}
                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.5 text-[10px] font-bold text-white rounded ${item.badgeColor}`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <FaAngleDown
                              className={`transition duration-300 ${open ? "rotate-180" : ""}`}
                            />
                          </div>
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-x-5">
                <div>
                  <Link to='/track-order' className='font-pop font-medium text-sm text-grynine border border-gry hover:border-primary hover:text-white rounded-sm px-4 py-2 transition'>{t('navbar.track_order')}</Link>
                </div>
                <div className='flex items-center gap-x-2 text-white cursor-pointer group'>
                  <TbPhoneCall className='size-7 group-hover:text-primary transition' />
                  <Link to='tel:+8801701054694' className='text-sm font-medium group-hover:text-primary transition'>
                    {t('navbar.menu.phone_number', '(+880) 170 105 4694')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* MOBILE BOTTOM APP BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] z-80 flex justify-between items-center px-6 py-2.5 border-t border-gray-100 font-pop pb-safe">
        <Link to="/" onClick={closeCart} className={`flex flex-col items-center gap-1 transition-colors ${isHomeActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
          <AiOutlineHome size={22} />
          <span className="text-[10px] font-medium tracking-wide uppercase">Home</span>
        </Link>
        <button onClick={() => { closeCart(); openMobileCategorySidebar(); }} className={`flex flex-col items-center gap-1 transition-colors ${mobileCategoryOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
          <HiSquares2X2 size={22} />
          <span className="text-[10px] font-medium tracking-wide uppercase">Category</span>
        </button>
        <button onClick={toggleCart} className={`flex flex-col items-center gap-1 transition-colors relative ${isCartOpenLocal ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
          <div className="relative">
            <HiOutlineShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 lg:min-w-5 h-4 lg:min-h-5 bg-[#2C742F] text-white text-[9px] lg:text-[11px] font-semibold font-pop rounded-full border-[1.5px] lg:border-2 border-white px-1 shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide uppercase">Cart</span>
        </button>
        <Link to={user ? "/dashboard" : "/login"} onClick={closeCart} className={`flex flex-col items-center gap-1 transition-colors ${isDashboardActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
          {user ? (
            user.avatar ? (
              <img src={user.avatar} alt="Profile" className={`w-[22px] h-[22px] rounded-full object-cover border ${isDashboardActive ? 'border-primary' : 'border-gray-200'}`} />
            ) : (
              <FaUserCircle size={22} />
            )
          ) : (
            <AiOutlineUser size={22} />
          )}
          <span className="text-[10px] font-medium tracking-wide uppercase truncate max-w-[60px] text-center">
            {user ? (user.name?.split(" ")[0] || user.firstName || "Account") : "Account"}
          </span>
        </Link>
      </div>

      {/* =========================================
          MASTER NAVIGATION SIDEBAR (DESKTOP)
          ========================================= */}

      <div
        className={`fixed inset-0 bg-black/40 z-100 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[85%] sm:w-75 bg-white z-110 shadow-2xl transform transition-transform duration-300 flex flex-col font-pop ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="bg-[#0a1a0f] p-5 flex justify-between items-center text-white relative">
          <Link to={user ? "/dashboard" : "/login"} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 relative z-10 group">
            {user ? (
              user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full border-2 border-primary object-cover group-hover:scale-105 transition-transform bg-white" />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FaUserCircle className="w-11 h-11 text-gray-300" />
                </div>
              )
            ) : (
              <FaUserCircle className="w-12 h-12 text-primary group-hover:scale-105 transition-transform" />
            )}
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{t('mobile_menu.welcome', 'Welcome,')}</span>
              <h2 className="text-lg font-semibold leading-none group-hover:text-primary transition-colors">
                {user ? (user.name?.split(" ")[0] || user.firstName) : t('sidebar.sign_in', 'Sign In')}
              </h2>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white transition-colors relative z-10 cursor-pointer">
            <RxCross2 className="size-7" />
          </button>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
            <img src={Sidebarbg} className="w-full h-full object-cover style-mask" alt="bg" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 hide-scrollbar pb-24 lg:pb-6">
          <div className="py-5 border-b border-gray-100">
            <h3 className="px-6 text-base font-bold text-gray-900 mb-3">{t('mobile_menu.trending', 'TRENDING')}</h3>
            <ul className="flex flex-col">
              <li>
                <Link to="/shop?sort=best-selling" onClick={() => setSidebarOpen(false)} className="block px-6 py-2.5 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition font-medium">
                  {t('mobile_menu.best_sellers', 'Best Sellers')}
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=new-arrivals" onClick={() => setSidebarOpen(false)} className="block px-6 py-2.5 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition font-medium">
                  {t('mobile_menu.new_arrivals', 'New Arrivals')}
                </Link>
              </li>
              <li>
                {/* --- [FIXED]: Updated Sidebar link to production flow --- */}
                <Link to="/shop?hotDeals=true" onClick={() => setSidebarOpen(false)} className="block px-6 py-2.5 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition font-medium">
                  {t('mobile_menu.todays_deals', "Today's Deals")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="py-5 border-b border-gray-100">
            <h3 className="px-6 text-base font-bold text-gray-900 mb-3">{t('mobile_menu.categories', 'CATEGORIES')}</h3>
            <ul className="flex flex-col">
              {categories.map((item, i) => (
                <li key={i}>
                  <div
                    onClick={() => { setActive(item.value); navigate(`/shop?category=${encodeURIComponent(item.value)}`); setSidebarOpen(false); }}
                    className="flex items-center justify-between px-6 py-3 text-gray-600 hover:bg-primary hover:text-white transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl text-gray-400 group-hover:text-white transition-colors">{item.icon}</span>
                      <span className="text-[15px] font-medium">{item.name}</span>
                    </div>
                  </div>
                </li>
              ))}
              <li>
                <Link to="/shop" onClick={() => setSidebarOpen(false)} className="flex items-center gap-4 px-6 py-4 text-gray-600 hover:bg-primary hover:text-white transition cursor-pointer font-medium mt-1 group">
                  <AiOutlinePlus className="text-xl text-gray-400 group-hover:text-white transition-colors" />
                  <span>{t('navbar.view_all_category', 'View All Categories')}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="py-5 border-b border-gray-100">
            <h3 className="px-6 text-base font-bold text-gray-900 mb-3">{t('sidebar.discover', 'Discover')}</h3>
            <ul className="flex flex-col">
              <li>
                <Link to="/blog" onClick={() => setSidebarOpen(false)} className="block px-6 py-2.5 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition font-medium">
                  {t('navbar.menu.blog', 'Blog')}
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={() => setSidebarOpen(false)} className="block px-6 py-2.5 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition font-medium">
                  {t('navbar.menu.faq', 'FAQ')}
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setSidebarOpen(false)} className="block px-6 py-2.5 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition font-medium">
                  {t('navbar.menu.about', 'About Us')}
                </Link>
              </li>
            </ul>
          </div>

          {user && (
            <div className="py-5">
              <div onClick={handleLogout} className="flex items-center justify-center gap-3 px-6 py-3 mx-4 my-2 text-[15px] text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer font-semibold shadow-sm">
                <FiLogOut className="text-xl" />
                {t('mobile_menu.sign_out', 'Sign Out')}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =========================================
          SHOPPING & CATEGORY SIDEBAR (MOBILE ONLY)
          ========================================= */}

      <div
        className={`fixed inset-0 bg-black/40 z-90 transition-opacity duration-300 lg:hidden ${mobileCategoryOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setMobileCategoryOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-100 transform transition-transform duration-300 lg:hidden flex flex-col font-pop ${mobileCategoryOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 border-b border-brdr flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-lg text-logoc">{t('mobile_menu.explore_shop', 'Explore & Shop')}</h3>
          <button onClick={() => setMobileCategoryOpen(false)}>
            <RxCross2 className='text-gry text-2xl active:scale-90 transition-transform' />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 hide-scrollbar pb-24">

          {/* Mobile Trending Section */}
          <div className="pt-4 border-b border-gray-100">
            <h3 className="px-5 text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('mobile_menu.trending', 'TRENDING')}</h3>
            <ul className="flex flex-col">
              <li className="border-b border-gray-100/70 last:border-none">
                <Link to="/shop?sort=best-selling" onClick={() => setMobileCategoryOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 active:bg-gray-50 active:text-primary transition-all duration-200 font-medium">
                  <span>{t('mobile_menu.best_sellers', 'Best Sellers')}</span>
                  <FaChevronRight className="text-gray-300 text-[10px]" />
                </Link>
              </li>
              <li className="border-b border-gray-100/70 last:border-none">
                <Link to="/shop?sort=new-arrivals" onClick={() => setMobileCategoryOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 active:bg-gray-50 active:text-primary transition-all duration-200 font-medium">
                  <span>{t('mobile_menu.new_arrivals', 'New Arrivals')}</span>
                  <FaChevronRight className="text-gray-300 text-[10px]" />
                </Link>
              </li>
              <li className="border-b border-gray-100/70 last:border-none">
                <Link to="/shop?hotDeals=true" onClick={() => setMobileCategoryOpen(false)} className="flex items-center justify-between px-5 py-3.5 text-[15px] text-gray-700 active:bg-gray-50 active:text-primary transition-all duration-200 font-medium">
                  <span>{t('mobile_menu.todays_deals', "Today's Deals")}</span>
                  <FaChevronRight className="text-gray-300 text-[10px]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Categories Section */}
          <div className="py-4">
            <h3 className="px-5 text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('mobile_menu.categories', 'CATEGORIES')}</h3>
            <div className="flex flex-col">
              {categories.map((item, i) => (
                <div
                  key={i}
                  onClick={() => { setActive(item.value); navigate(`/shop?category=${encodeURIComponent(item.value)}`); setMobileCategoryOpen(false); }}
                  className="flex items-center justify-between px-5 py-3.5 cursor-pointer active:bg-gray-50 transition-all duration-200 border-b border-gray-100/70 last:border-0 group"
                >
                  <div className="flex items-center gap-x-3">
                    <span className="text-xl text-gray-400 group-active:text-primary transition-colors">{item.icon}</span>
                    <span className="font-medium text-[15px] text-gray-700 group-active:text-primary">{item.name}</span>
                  </div>
                  <FaChevronRight className="text-gray-300 text-[10px]" />
                </div>
              ))}

              <div
                onClick={() => { navigate('/shop'); setMobileCategoryOpen(false); }}
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer active:bg-gray-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-x-3">
                  <AiOutlinePlus className='text-gray-400 text-2xl group-active:text-primary transition-colors' />
                  <span className="font-medium text-[15px] text-gray-700 group-active:text-primary">{t('navbar.view_all_category', 'View All Categories')}</span>
                </div>
                <FaChevronRight className="text-gray-300 text-[10px]" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .style-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, black);
          mask-image: linear-gradient(to right, transparent, black);
        }
      `}} />
    </>
  )
}

export default Navbar;
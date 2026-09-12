import React, { useEffect, useState, useRef } from "react";
import Container from "../layouts/Container";
import Logo from "../../assets/images/Logo.png";
import Sidebarbg from '../../assets/images/sidebarbg.png';
import { FiSearch, FiLoader, FiMenu, FiLogOut } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, removeCartItem } from "../../services/cartService";
import { getWishlist } from "../../services/wishlistService";
import { getSearchSuggestions } from "../../services/productService";
import CartSidebar from "../CartSidebar";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { useCurrency } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { logout as logoutRequest } from "../../services/authService";
import { FaUserCircle } from "react-icons/fa";

const MainHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { t, i18n } = useTranslation();
    const { currency, handleCurrencyChange, formatPrice } = useCurrency();
    const { user, setUser } = useAuth();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [language, setLanguage] = useState(() => {
        if (i18n.language === "bn") return "Bng";
        return "Eng";
    });

    const handleLanguageChange = (selectedLang) => {
        setLanguage(selectedLang);
        if (selectedLang === "Eng") i18n.changeLanguage("en");
        else if (selectedLang === "Bng") i18n.changeLanguage("bn");
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const openSidebar = () => setIsCartOpen(true);
        const closeSidebar = () => setIsCartOpen(false);
        const toggleSidebar = () => setIsCartOpen(prev => !prev);

        window.addEventListener("open-cart-sidebar", openSidebar);
        window.addEventListener("close-cart-sidebar", closeSidebar);
        window.addEventListener("toggle-cart-sidebar", toggleSidebar);

        return () => {
            window.removeEventListener("open-cart-sidebar", openSidebar);
            window.removeEventListener("close-cart-sidebar", closeSidebar);
            window.removeEventListener("toggle-cart-sidebar", toggleSidebar);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const closeMenu = () => setIsMobileMenuOpen(false);
        window.addEventListener("close-mobile-menu", closeMenu);
        return () => window.removeEventListener("close-mobile-menu", closeMenu);
    }, []);

    const openMobileMenu = () => {
        setIsMobileMenuOpen(true);
        window.dispatchEvent(new Event("close-category-sidebar"));
        window.dispatchEvent(new Event("close-cart-sidebar"));
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

            setIsMobileMenuOpen(false);
            toast.success("Logout successful");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed");
        }
    };

    const { data: cartData } = useQuery({ queryKey: ["cart"], queryFn: getCart });
    const { data: wishlistData } = useQuery({ queryKey: ["wishlist"], queryFn: getWishlist });

    const { data: searchResults = [], isFetching: isSearching } = useQuery({
        queryKey: ["search", debouncedTerm],
        queryFn: () => getSearchSuggestions(debouncedTerm),
        enabled: !!debouncedTerm,
        staleTime: 5 * 60 * 1000,
    });

    const cartItems = cartData?.items || [];
    const totalItems = cartData?.totalItems || 0;
    const totalPrice = cartData?.total || cartData?.subtotal || 0;
    const totalWishlistItems = wishlistData?.data?.totalItems || 0;

    const removeMutation = useMutation({
        mutationFn: removeCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Item removed from cart");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to remove item");
        },
    });

    const handleRemoveItem = (productId) => { removeMutation.mutate(productId); };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setIsDropdownOpen(false);
            navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const infoMenuItems = [
        { name: t('navbar.track_order', 'Track Order'), path: "/track-order" },
        { name: t('navbar.menu.blog', 'Blog'), path: "/blog" },
        { name: t('navbar.menu.faq', 'FAQ'), path: "/faq" },
        { name: t('navbar.menu.about', 'About Us'), path: "/about" }
    ];

    return (
        <>
            <div className="bg-white sticky top-0 z-40 lg:static shadow-sm lg:shadow-none">
                <Container>
                    <div className="flex flex-wrap lg:flex-nowrap items-center justify-between py-3 lg:py-6 gap-y-3 lg:gap-y-0">

                        <Link to="/" className="shrink-0 w-1/2 lg:w-auto">
                            <img src={Logo} alt="Logo" className="w-28 sm:w-32 lg:w-auto" />
                        </Link>

                        <div className="hidden lg:flex items-center justify-end w-auto gap-x-8 shrink-0 order-last">
                            <div>
                                <Link to="/wishlist" className="relative block p-1 lg:p-0">
                                    <AiOutlineHeart className="size-6 lg:size-8 text-logoc cursor-pointer hover:text-primary transition" />
                                    <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 lg:min-w-5 h-4 lg:h-5 bg-[#2C742F] text-white text-[9px] lg:text-[11px] font-semibold font-pop rounded-full border-[1.5px] lg:border-2 border-white px-1 shadow-sm">
                                        {totalWishlistItems}
                                    </span>
                                </Link>
                            </div>

                            <div
                                onClick={() => setIsCartOpen(true)}
                                className="flex items-center gap-x-3 cursor-pointer relative after:hidden lg:after:block after:w-px after:h-6 after:bg-brdr after:content-[''] after:absolute after:top-1 after:-left-4 group p-1 lg:p-0"
                            >
                                <div className="relative">
                                    <HiOutlineShoppingBag className="size-6 lg:size-8 text-logoc group-hover:text-primary transition" />
                                    <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-4 lg:min-w-5 h-4 lg:h-5 bg-[#2C742F] text-white text-[9px] lg:text-[11px] font-semibold font-pop rounded-full border-[1.5px] lg:border-2 border-white px-1 shadow-sm">
                                        {totalItems}
                                    </span>
                                </div>
                                <div className="hidden lg:block">
                                    <p className="font-pop font-normal text-sm text-[#4D4D4D] leading-[120%] group-hover:text-primary transition">
                                        {t('mainheader.shopping_cart', 'Shopping Cart')}
                                    </p>
                                    <p className="font-pop font-medium text-sm text-logoc leading-[100%]">
                                        {formatPrice(totalPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex lg:hidden items-center justify-end w-1/2 shrink-0 order-2 gap-1 sm:gap-2">
                            <Link to="/wishlist" className="relative p-1.5 text-logoc hover:text-primary transition cursor-pointer mt-0.5">
                                <AiOutlineHeart className="size-6" />
                                {totalWishlistItems > 0 && (
                                    <span className="absolute top-0.5 -right-px flex items-center justify-center min-w-4 h-4 bg-[#2C742F] text-white text-[9px] font-bold rounded-full px-1 border border-white shadow-sm">
                                        {totalWishlistItems}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={openMobileMenu}
                                className="p-1.5 text-logoc hover:text-primary transition cursor-pointer active:scale-90 duration-200"
                            >
                                <FiMenu className="size-7" />
                            </button>
                        </div>

                        <div className="flex relative w-full lg:max-w-xl mx-0 lg:mx-8 order-last lg:order-0" ref={searchRef}>
                            <form onSubmit={handleSearchSubmit} className="flex w-full shadow-sm lg:shadow-none rounded-full lg:rounded-none">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder={t('mainheader.search_placeholder', 'Search products...')}
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        className="w-full border border-gray-200 lg:border-brdr lg:focus:border-primary border-r-0 font-pop text-[13px] lg:text-[15px] text-black placeholder:text-gray-400 font-normal leading-5.5 ps-10 lg:ps-11 py-2.5 lg:py-3.5 rounded-l-full lg:rounded-none lg:rounded-l-md outline-none transition-colors"
                                    />
                                    {isSearching ? (
                                        <FiLoader className="absolute top-1/2 -translate-y-1/2 left-3 lg:left-4 size-4 lg:size-5 text-gray-400 animate-spin" />
                                    ) : (
                                        <FiSearch className="absolute top-1/2 -translate-y-1/2 left-3 lg:left-4 size-4 lg:size-5 text-gray-400 lg:text-logoc" />
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-primary text-white text-[13px] lg:text-sm font-semibold font-pop leading-[120%] px-5 lg:px-6 py-2.5 lg:py-4 rounded-r-full lg:rounded-none lg:rounded-r-md hover:bg-opacity-90 transition cursor-pointer shrink-0"
                                >
                                    {t('mainheader.search_btn', 'Search')}
                                </button>
                            </form>

                            {isDropdownOpen && searchTerm.trim() !== "" && (
                                <div className="absolute top-full left-0 w-full mt-2 lg:mt-1 bg-white border border-gray-100 lg:border-gray-100 rounded-2xl lg:rounded-lg shadow-xl z-50 overflow-hidden font-pop max-h-[60vh] lg:max-h-none overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">{t('mainheader.searching', 'Searching...')}</div>
                                    ) : searchResults.length > 0 ? (
                                        <ul>
                                            {searchResults.map((product) => {
                                                const productTitle = typeof product.title === 'object' ? (product.title[i18n.language] || product.title.en) : product.title;

                                                return (
                                                    <li key={product._id}>
                                                        <Link
                                                            to={`/product-details/${product.slug}`}
                                                            onClick={() => {
                                                                setIsDropdownOpen(false);
                                                                setSearchTerm("");
                                                            }}
                                                            className="flex items-center gap-3 lg:gap-4 p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                                                        >
                                                            <div className="w-12 h-12 shrink-0 bg-gray-100 rounded overflow-hidden">
                                                                <img
                                                                    src={product.thumbnail?.url || "/placeholder-image.jpg"}
                                                                    alt={productTitle}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-[13px] lg:text-sm font-medium text-gray-800 truncate">
                                                                    {productTitle}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[12px] lg:text-xs font-medium text-primary">
                                                                        {formatPrice(product.price)}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                                                                        {product.category}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            {t('mainheader.no_products_found', 'No products found for')} "{searchTerm}"
                                        </div>
                                    )}

                                    {searchResults.length > 0 && (
                                        <div
                                            onClick={handleSearchSubmit}
                                            className="bg-gray-50 p-3 text-center border-t border-gray-100 cursor-pointer hover:text-primary transition"
                                        >
                                            <span className="text-[13px] lg:text-sm font-medium">{t('mainheader.view_all_results', 'View all results for')} "{searchTerm}"</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => {
                    setIsCartOpen(false);
                    window.dispatchEvent(new Event("close-cart-sidebar"));
                }}
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
            />

            <div
                className={`fixed inset-0 bg-black/50 z-100 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] bg-white z-110 transform transition-transform duration-300 lg:hidden flex flex-col shadow-2xl font-pop ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

                <div className="bg-[#0a1a0f] py-4 px-5 flex justify-between items-center text-white relative">
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
                        <img src={Sidebarbg} className="w-full h-full object-cover style-mask" alt="bg" />
                    </div>
                    <Link to={user ? "/dashboard" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 relative z-10 group">
                        {user ? (
                            user.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full border-2 border-primary object-cover group-active:scale-105 transition-transform bg-white" />
                            ) : (
                                <div className="w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center group-active:scale-105 transition-transform">
                                    <FaUserCircle className="w-11 h-11 text-gray-300" />
                                </div>
                            )
                        ) : (
                            <FaUserCircle className="w-12 h-12 text-primary group-active:scale-105 transition-transform" />
                        )}
                        <div>
                            <span className="text-xs text-gray-400 block mb-0.5">{t('mobile_menu.welcome', 'Welcome,')}</span>
                            <h2 className="text-lg font-semibold leading-none group-active:text-primary transition-colors">
                                {user ? (user.name?.split(" ")[0] || user.firstName) : t('sidebar.sign_in', 'Sign In')}
                            </h2>
                        </div>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white active:scale-90 transition-all duration-200 relative z-10 cursor-pointer">
                        <MdClose className="size-6" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 hide-scrollbar">

                    <div className="pt-4 border-b border-gray-100">
                        <h3 className="px-6 text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('mobile_menu.information', 'INFORMATION')}</h3>
                        <ul className="flex flex-col">
                            {infoMenuItems.map((item, idx) => (
                                <li key={idx} className="border-b border-gray-100/70 last:border-none">
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between px-6 py-3.5 text-[15px] font-medium text-gray-700 active:bg-gray-50 active:text-primary transition-all duration-200"
                                    >
                                        <span>{item.name}</span>
                                        <FaChevronRight className="text-gray-300 text-[10px]" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 pb-3">
                        <h3 className="px-6 text-[13px] font-bold text-gray-400 mb-2 uppercase tracking-wider">{t('mobile_menu.settings', 'Settings')}</h3>
                        <ul className="flex flex-col">

                            <li className="border-b border-gray-100/70">
                                <div className="flex items-center justify-between px-6 py-3">
                                    <span className="text-[15px] font-medium text-gray-700">{t('mobile_menu.currency', 'Currency')}</span>
                                    <div className="flex items-center bg-gray-100 p-1 rounded-full w-30">
                                        {["USD", "BDT"].map(curr => (
                                            <button
                                                key={curr}
                                                onClick={() => handleCurrencyChange(curr)}
                                                className={`flex-1 text-center py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 ${(currency || 'BDT') === curr ? 'text-white bg-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {curr}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </li>

                            <li className="border-b border-gray-100/70">
                                <div className="flex items-center justify-between px-6 py-3">
                                    <span className="text-[15px] font-medium text-gray-700">{t('mobile_menu.language', 'Language')}</span>
                                    <div className="flex items-center bg-gray-100 p-1 rounded-full w-30">
                                        {["Eng", "Bng"].map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => handleLanguageChange(lang)}
                                                className={`flex-1 text-center py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 ${language === lang ? 'text-white bg-primary shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </li>

                            <li className="border-b border-gray-100/70 last:border-none">
                                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-6 py-3.5 text-[15px] font-medium text-gray-700 active:bg-gray-50 active:text-primary transition-all duration-200">
                                    <span>{t('mobile_menu.customer_service', 'Customer Service')}</span>
                                    <FaChevronRight className="text-gray-300 text-[10px]" />
                                </Link>
                            </li>

                            {user && (
                                <li>
                                    <div onClick={handleLogout} className="flex items-center justify-center gap-3 px-6 py-3 mx-4 mt-3 text-[15px] text-red-600 bg-red-50 active:bg-red-600 active:text-white rounded-lg transition-all duration-200 cursor-pointer font-semibold shadow-sm">
                                        <FiLogOut className="text-xl" />
                                        {t('mobile_menu.sign_out', 'Sign Out')}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>

                </div>

                <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50">
                    <p className="text-[13px] text-gray-500 mb-1">{t('mobile_menu.need_help', 'Need help?')}</p>
                    <Link to='tel:+8801701054694' className="text-[16px] font-semibold text-primary block cursor-pointer">
                        (+880) 1701054694
                    </Link>
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
    );
};

export default MainHeader;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { IoCloseOutline } from 'react-icons/io5';
import { MdClose } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext'; 
import { HiOutlineShoppingBag } from "react-icons/hi2";

const CartSidebar = ({ isOpen, onClose, cartItems = [], onRemoveItem }) => {
    const { t, i18n } = useTranslation();
    const { formatPrice } = useCurrency(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/50 z-100 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            />

            <div
                className={`fixed top-0 right-0 h-dvh w-full sm:w-100 bg-white z-110 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-[18px] sm:text-[20px] font-medium text-logoc font-pop">
                        {t('cart_sidebar.title', 'Shopping Cart')} ({cartItems.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black transition-colors bg-gray-50 p-1 rounded-full cursor-pointer"
                    >
                        <MdClose size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
                            <HiOutlineShoppingBag className="text-gray-300 text-6xl" />
                            <p className="font-medium text-[16px] sm:text-lg">{t('cart_sidebar.empty', 'Your cart is empty.')}</p>
                        </div>
                    ) : (
                        cartItems.map((item, index) => {
                            const itemTitle = typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title;

                            return (

                                <div key={item.product?._id || index} className="flex items-center gap-3 sm:gap-4 group">

                                    <div className="w-17.5 h-17.5 sm:w-20 sm:h-20 shrink-0 bg-white rounded flex items-center justify-center">
                                        <img
                                            src={
                                                item.thumbnail ||
                                                item.product?.thumbnail?.url ||
                                                "/images/no-image.png"
                                            }
                                            alt={itemTitle}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col font-pop">
                                        <h4 className="text-[13px] sm:text-[14px] text-logoc font-medium mb-1 line-clamp-2 group-hover:text-[#00B207] transition-colors leading-[130%]">
                                            {itemTitle}
                                        </h4>
                                        <div className="text-[13px] sm:text-[14px] text-gry mt-1">
                                            {item.quantity || 1} x <span className="font-semibold text-logoc">
                                                {formatPrice(item.price)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            onRemoveItem &&
                                            onRemoveItem(item.product?._id)
                                        }
                                        className="w-7 h-7 sm:w-6 sm:h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                                    >
                                        <IoCloseOutline size={18} />
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div 
                        className="p-4 sm:p-6 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.03)] font-pop pb-8 lg:pb-8"
                    >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <span className="text-[14px] sm:text-[15px] text-[#4d4d4d]">{cartItems.length} {t('cart_sidebar.product', 'Product')}</span>
                            <span className="text-[16px] sm:text-[18px] font-bold text-logoc">{formatPrice(totalAmount)}</span>
                        </div>

                        <div className="flex flex-col gap-2.5 sm:gap-3">
                            <button
                                onClick={() => { onClose(); navigate('/checkout'); }}
                                className="w-full py-3 sm:py-3.5 rounded-full bg-[#00B207] text-white font-semibold text-[14px] sm:text-[15px] hover:bg-[#009206] transition-colors shadow-sm cursor-pointer"
                            >
                                {t('cart_sidebar.checkout', 'Checkout')}
                            </button>
                            <button
                                onClick={() => { onClose(); navigate('/cart'); }}
                                className="w-full py-3 sm:py-3.5 rounded-full bg-[#e6f7e6] text-[#00B207] font-semibold text-[14px] sm:text-[15px] hover:bg-[#d5f0d5] transition-colors cursor-pointer"
                            >
                                {t('cart_sidebar.go_cart', 'Go To Cart')}
                            </button>
                        </div>
                    </div>
                )}
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
      `}} />
        </>
    );
};

export default CartSidebar;
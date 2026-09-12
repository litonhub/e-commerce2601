import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageBanner from '../components/common/PageBanner';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext'; 
import { useAuth } from '../context/AuthContext';

import {
  getCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon
} from '../services/cartService';
import Container from '../components/layouts/Container';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState('');
  
  const { user } = useAuth();

  const { data: cartData, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const cartItems = cartData?.items || [];
  const subtotal = cartData?.subtotal || 0;
  const discount = cartData?.couponDiscount || cartData?.discount || 0;
  const shipping = cartData?.shipping || 0;
  const total = cartData?.total || 0;
  const appliedCoupon = cartData?.coupon?.code?.trim() ? cartData.coupon : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const updateQuantityMutation = useMutation({
    mutationFn: updateCartItem,
    onMutate: async (newUpdate) => {

      await queryClient.cancelQueries({ queryKey: ['cart'] });

      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old;

        const updatedItems = old.items.map(item => {
          const prodId = item.product?._id || item.product;
          if (prodId === newUpdate.productId) {
            return { ...item, quantity: newUpdate.quantity };
          }
          return item;
        });

        const newSubtotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const currentDiscount = old.couponDiscount || old.discount || 0;
        const newTotal = newSubtotal + (old.shipping || 0) - currentDiscount;

        return {
          ...old,
          items: updatedItems,
          subtotal: newSubtotal,
          total: newTotal
        };
      });

      return { previousCart };
    },
    onError: (err, newUpdate, context) => {

      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      toast.success('Item removed from cart');
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: applyCoupon,
    onSuccess: () => {
      toast.success('Coupon applied successfully');
      setCouponCode('');
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid or expired coupon');
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: removeCoupon,
    onSuccess: () => {
      toast.info('Coupon removed');
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove coupon');
    },
  });

  const handleUpdateQuantity = (productId, currentQuantity, stock, type) => {
    let newQuantity = currentQuantity;
    const availableStock = stock || 100;

    if (type === 'inc') {
      if (currentQuantity >= availableStock) {
        toast.warning(`Only ${availableStock} items available in stock.`);
        return;
      }
      newQuantity += 1;
    } else if (type === 'dec' && currentQuantity > 1) {
      newQuantity -= 1;
    } else {
      return;
    }

    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId) => {
    removeItemMutation.mutate(productId);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please login to apply coupons.');
      navigate('/login');
      return;
    }

    if (!couponCode.trim()) {
      return toast.warning('Please enter a coupon code.');
    }
    applyCouponMutation.mutate(couponCode.trim());
  };

  const handleRemoveCoupon = () => {
    removeCouponMutation.mutate();
  };

  const handleUpdateCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    toast.success("Cart Updated");
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00B207] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4">Something went wrong while loading your cart.</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["cart"] })}
          className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <PageBanner items={[ t('cart.shopping_cart', "Shopping cart") ]} />

      <section className="pt-8 lg:pt-10 pb-16 lg:pb-20 bg-white font-pop text-logoc">
        <Container>
          <h2 className="text-[24px] lg:text-hsize font-semibold text-center mb-6 lg:mb-10 text-gray-900 px-4">{t('cart.title', 'My Shopping Cart')}</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 lg:py-20 border border-gray-200 rounded-xl bg-gray-50 mx-4 md:mx-6 lg:mx-0">
              <h3 className="text-xl lg:text-2xl font-medium text-gray-600 mb-4 px-4">{t('cart.empty', 'Your cart is currently empty.')}</h3>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 lg:px-8 py-3 bg-[#00B207] text-white rounded-full font-semibold hover:bg-[#009206] transition cursor-pointer"
              >
                {t('cart.return_shop', 'Return to shop')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 items-start px-4 md:px-6 lg:px-0">

              <div className="w-full lg:w-[68%] flex flex-col gap-4 lg:gap-6">

                {/* Table & Cards Wrapper */}
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  
                  {/* --- MOBILE VIEW: Cards --- */}
                  <div className="md:hidden flex flex-col divide-y divide-gray-100">
                    {cartItems.map((item) => {
                      const prodId = item.product?._id || item.product;
                      const stock = item.product?.stock || 0;
                      const itemName = typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title;

                      return (
                        <div key={prodId} className="p-4 flex gap-3 relative bg-white">
                          <button
                            onClick={() => handleRemoveItem(prodId)}
                            disabled={removeItemMutation.isPending && removeItemMutation.variables === prodId}
                            className="absolute top-3 right-3 w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <IoCloseOutline size={18} />
                          </button>

                          <div className="w-20 h-20 shrink-0 bg-[#f9f9f9] rounded border border-gray-100 flex items-center justify-center p-1">
                            <img
                              src={item.thumbnail || "https://placehold.co/70x70"}
                              alt={itemName}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 flex flex-col pr-6">
                            <h4 className="text-[13px] sm:text-[14px] font-medium text-logoc line-clamp-2 leading-[130%] mb-1">
                              {itemName}
                            </h4>
                            <div className="text-[13px] sm:text-[14px] font-semibold text-logoc mb-2.5">
                              {formatPrice(item.price)}
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center border border-gray-200 rounded-full h-8 w-22.5 px-1 bg-white">
                                <button
                                  onClick={() => handleUpdateQuantity(prodId, item.quantity, stock, 'dec')}
                                  disabled={updateQuantityMutation.isPending && updateQuantityMutation.variables?.type === 'dec'}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                >
                                  <FiMinus size={14} />
                                </button>
                                <span className="flex-1 text-center font-medium text-[13px] text-logoc">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(prodId, item.quantity, stock, 'inc')}
                                  disabled={updateQuantityMutation.isPending && updateQuantityMutation.variables?.type === 'inc'}
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>

                              <div className="text-[13px] sm:text-[14px] font-medium text-[#00B207]">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* --- DESKTOP VIEW: Table --- */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-150">
                      <thead>
                        <tr className="border-b border-gray-200 text-gryd text-[13px] font-medium uppercase tracking-wider">
                          <th className="py-4 px-6 font-medium">{t('cart.product', 'Product')}</th>
                          <th className="py-4 px-6 font-medium">{t('cart.price', 'Price')}</th>
                          <th className="py-4 px-6 font-medium text-center">{t('cart.quantity', 'Quantity')}</th>
                          <th className="py-4 px-6 font-medium text-right">{t('cart.subtotal', 'Subtotal')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => {
                          const prodId = item.product?._id || item.product;
                          const stock = item.product?.stock || 0;
                          const itemName = typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title;

                          return (
                            <tr key={prodId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-17.5 h-17.5 shrink-0 flex items-center justify-center">
                                    <img
                                      src={item.thumbnail || "https://placehold.co/70x70"}
                                      alt={itemName}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                  <span className="font-medium text-logoc text-[15px]">
                                    {itemName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-logoc text-[15px] font-medium">
                                {formatPrice(item.price)}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center justify-center">
                                  <div className="flex items-center border border-gray-200 rounded-full h-10.5 w-27.5 px-2 bg-white">
                                    <button
                                      onClick={() => handleUpdateQuantity(prodId, item.quantity, stock, 'dec')}
                                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
                                    >
                                      <FiMinus size={16} />
                                    </button>
                                    <span className="flex-1 text-center font-medium text-[15px] text-logoc">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleUpdateQuantity(prodId, item.quantity, stock, 'inc')}
                                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
                                    >
                                      <FiPlus size={16} />
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right font-medium text-logoc text-[15px]">
                                <div className="flex items-center justify-end gap-6">
                                  {formatPrice(item.price * item.quantity)}
                                  <button
                                    onClick={() => handleRemoveItem(prodId)}
                                    disabled={removeItemMutation.isPending && removeItemMutation.variables === prodId}
                                    className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    <IoCloseOutline size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 lg:gap-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/shop')}
                      className="w-full sm:w-auto px-6 lg:px-8 py-3 rounded-full bg-[#F2F2F2] text-logoc font-medium text-[13px] lg:text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {t('cart.return_shop', 'Return to shop')}
                    </button>
                    <button
                      onClick={handleUpdateCart}
                      className="w-full sm:w-auto px-6 lg:px-8 py-3 rounded-full bg-[#F2F2F2] text-logoc font-medium text-[13px] lg:text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {t('cart.update_cart', 'Update Cart')}
                    </button>
                  </div>
                </div>

                {/* Coupon Area */}
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 lg:gap-4 bg-white">
                  <span className="text-[16px] lg:text-[18px] font-medium text-logoc shrink-0">{t('cart.coupon_code', 'Coupon Code')}</span>
                  {appliedCoupon ? (
                    <div className="flex w-full sm:max-w-lg relative items-center justify-between bg-green-50 border border-green-200 rounded-full px-5 py-2.5 lg:py-3">
                      <span className="text-green-700 font-medium text-[13px] lg:text-[15px]">
                        Coupon: {appliedCoupon.code}
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={removeCouponMutation.isPending}
                        className="text-red-500 hover:underline text-[12px] lg:text-sm font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex w-full sm:max-w-lg relative">
                      <input
                        type="text"
                        placeholder={t('cart.enter_code', 'Enter code')}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full border border-gray-200 rounded-full h-11.5 lg:h-13 pl-5 lg:pl-6 pr-32 lg:pr-40 outline-none focus:border-[#00B207] text-logoc text-[13px] lg:text-[15px] transition-colors uppercase"
                      />
                      <button
                        type="submit"
                        disabled={applyCouponMutation.isPending}
                        className="absolute right-0 top-0 h-11.5 lg:h-13 px-6 lg:px-8 bg-subb text-white rounded-full font-medium text-[13px] lg:text-[15px] hover:bg-black transition-colors disabled:opacity-70 cursor-pointer"
                      >
                        {applyCouponMutation.isPending ? t('cart.applying', 'Applying...') : t('cart.apply_coupon', 'Apply Coupon')}
                      </button>
                    </form>
                  )}
                </div>

              </div>

              {/* Cart Total Sidebar */}
              <div className="w-full lg:w-[32%] border border-gray-200 rounded-lg p-5 lg:p-6 bg-white shrink-0">
                <h3 className="text-[18px] lg:text-xl font-medium text-logoc mb-5 lg:mb-6">{t('cart.cart_total', 'Cart Total')}</h3>

                <div className="flex justify-between items-center py-2.5 lg:py-3 border-b border-gray-200">
                  <span className="text-gry text-[14px] lg:text-[15px]">{t('cart.subtotal', 'Subtotal')}:</span>
                  <span className="font-medium text-logoc text-[14px] lg:text-[15px]">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 lg:py-3 border-b border-gray-200">
                  <span className="text-gry text-[14px] lg:text-[15px]">{t('cart.shipping', 'Shipping')}:</span>
                  <span className="font-medium text-logoc text-[14px] lg:text-[15px]">{shipping === 0 ? t('cart.free', 'Free') : formatPrice(shipping)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center py-2.5 lg:py-3 border-b border-gray-200">
                    <span className="text-gry text-[14px] lg:text-[15px]">{t('cart.discount', 'Discount')}:</span>
                    <span className="font-medium text-red-500 text-[14px] lg:text-[15px]">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-4 mb-3 lg:mb-4">
                  <span className="text-logoc text-[15px] lg:text-[16px] font-medium">{t('cart.total', 'Total')}:</span>
                  <span className="font-bold text-logoc text-[16px] lg:text-[18px]">{formatPrice(total)}</span>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      toast.info("Please login to proceed to checkout");
                      navigate('/login');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full h-11.5 lg:h-13 bg-[#00B207] text-white rounded-full font-semibold text-[14px] lg:text-[15px] hover:bg-[#009206] transition-colors flex items-center justify-center cursor-pointer"
                >
                  {t('cart.proceed', 'Proceed to checkout')}
                </button>
              </div>

            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default Cart;
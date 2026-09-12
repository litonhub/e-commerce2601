import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IoCloseOutline } from 'react-icons/io5';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram } from 'react-icons/fa';
import Container from "../components/layouts/Container";
import { useTranslation } from "react-i18next";
import { useCurrency } from '../context/CurrencyContext'; 
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import { addToCart } from "../services/cartService";
import PageBanner from '../components/common/PageBanner';

const Wishlist = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency(); 
  const queryClient = useQueryClient();

  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const wishlistItems = wishlistData?.data?.items || [];

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,

    onSuccess: () => {
      toast.success("Product removed from wishlist");

      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
        "Failed to remove product"
      );
    },
  });

  const addCartMutation = useMutation({
    mutationFn: addToCart,

    onSuccess: () => {
      toast.success("Product added to cart");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      window.dispatchEvent(
        new Event("open-cart-sidebar")
      );
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
        "Failed to add product"
      );
    },
  });

  const handleRemoveItem = (productId) => {
    removeMutation.mutate(productId);
  };

  const handleAddToCart = (item) => {
    if (
      item.product?.availabilityStatus ===
      "Out of Stock"
    )
      return;

    addCartMutation.mutate({
      productId: item.product._id,
      quantity: 1,
      product: item.product
    });
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <PageBanner
        items={[
          t('wishlist.banner', "Wishlist"),
        ]}
      />

      <section className="pt-6 lg:pt-10 pb-12 lg:pb-20 bg-white font-pop text-logoc">
        <Container>

          <h2 className="text-[24px] lg:text-[32px] font-semibold text-center mb-6 lg:mb-10 text-gray-900 px-4">
            {t('wishlist.title', 'My Wishlist')}
          </h2>

          {wishlistItems.length === 0 ? (
            <div className="border border-gray-200 rounded-lg bg-white py-16 px-4 text-center mx-4 md:mx-6 lg:mx-0">
              <p className="text-gray-500 font-medium text-[16px] md:text-lg">
                {t('wishlist.empty', 'Your wishlist is empty.')}
              </p>
            </div>
          ) : (
            <div className="px-4 md:px-6 lg:px-0">
              {/* Wrapper: Transparent on mobile, bordered card on desktop */}
              <div className="md:border md:border-gray-200 md:rounded-lg md:bg-white overflow-hidden">

                {/* --- MOBILE VIEW: Cards (Hidden on Desktop) --- */}
                <div className="md:hidden flex flex-col gap-3">
                  {wishlistItems.map((item, index) => {
                    const itemName = typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title;
                    const isOutOfStock = item.product?.availabilityStatus === "Out of Stock";

                    return (
                      <div key={item._id || item.product?._id || index} className="relative p-4 border border-gray-200 rounded-lg bg-white flex flex-col gap-3 shadow-sm">
                        
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="absolute top-3 right-3 w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <IoCloseOutline size={18} />
                        </button>

                        <div className="flex gap-3">
                          <div className="w-[70px] h-[70px] shrink-0 bg-[#f9f9f9] rounded flex items-center justify-center p-1 border border-gray-100">
                            <img
                              src={item.thumbnail}
                              alt={itemName}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          
                          <div className="flex flex-col justify-center pr-6">
                            <span className="font-medium text-logoc text-[14px] line-clamp-2 leading-[130%] mb-1">
                              {itemName}
                            </span>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-semibold text-logoc text-[14px]">
                                {formatPrice(item.price)}
                              </span>
                              {item.discountPercentage > 0 && (
                                <span className="text-[#999] text-[12px] line-through">
                                  {formatPrice(item.price / (1 - item.discountPercentage / 100))}
                                </span>
                              )}
                            </div>
                            <div>
                              {isOutOfStock ? (
                                <span className="bg-[#f5e1e1] text-badgered text-[10px] font-medium px-2 py-0.5 rounded">
                                  {t('wishlist.out_of_stock', 'Out of Stock')}
                                </span>
                              ) : (
                                <span className="bg-[#e6f7e6] text-[#00B207] text-[10px] font-medium px-2 py-0.5 rounded">
                                  {t('wishlist.in_stock', 'In Stock')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={isOutOfStock || addCartMutation.isPending}
                          className={`w-full py-2.5 rounded-full font-semibold text-[13px] transition-all cursor-pointer mt-1 ${
                            isOutOfStock
                            ? "bg-[#f2f2f2] text-[#b3b3b3] cursor-not-allowed"
                            : "bg-[#00B207] text-white hover:bg-[#009206]"
                          }`}
                        >
                          {t('wishlist.add_to_cart', 'Add to Cart')}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* --- DESKTOP VIEW: Table (Hidden on Mobile) --- */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-200">
                    <thead>
                      <tr className="border-b border-gray-200 text-gryd text-[13px] font-medium uppercase tracking-wider">
                        <th className="py-5 px-6 font-medium w-2/5">{t('wishlist.product', 'Product')}</th>
                        <th className="py-5 px-6 font-medium w-1/5">{t('wishlist.price', 'Price')}</th>
                        <th className="py-5 px-6 font-medium w-1/5">{t('wishlist.stock_status', 'Stock Status')}</th>
                        <th className="py-5 px-6 font-medium w-1/5 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlistItems.map((item, index) => {
                        const itemName = typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title;
                        const isOutOfStock = item.product?.availabilityStatus === "Out of Stock";

                        return (
                          <tr key={item._id || item.product?._id || index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="w-17.5 h-17.5 shrink-0 flex items-center justify-center bg-white rounded">
                                  <img
                                    src={item.thumbnail}
                                    alt={itemName}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                                <span className="font-medium text-logoc text-[15px]">
                                  {itemName}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-logoc text-[15px]">
                                  {formatPrice(item.price)}
                                </span>
                                {
                                  item.discountPercentage > 0 && (
                                    <span className="text-[#999] text-[14px] line-through">
                                      {formatPrice(item.price / (1 - item.discountPercentage / 100))}
                                    </span>
                                  )
                                }
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              {
                                isOutOfStock ? (
                                  <span className="bg-[#f5e1e1] text-badgered text-[13px] font-medium px-3 py-1 rounded">
                                    {t('wishlist.out_of_stock', 'Out of Stock')}
                                  </span>
                                ) : (
                                  <span className="bg-[#e6f7e6] text-[#00B207] text-[13px] font-medium px-3 py-1 rounded">
                                    {t('wishlist.in_stock', 'In Stock')}
                                  </span>
                                )
                              }
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-4">
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  disabled={isOutOfStock || addCartMutation.isPending}
                                  className={`px-8 py-2.5 rounded-full font-semibold text-[14px] transition-all cursor-pointer ${
                                    isOutOfStock
                                    ? "bg-[#f2f2f2] text-[#b3b3b3] cursor-not-allowed"
                                    : "bg-[#00B207] text-white hover:bg-[#009206]"
                                    }`}
                                >
                                  {t('wishlist.add_to_cart', 'Add to Cart')}
                                </button>

                                <button
                                  onClick={() =>
                                    handleRemoveItem(item.product._id)
                                  }
                                  className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
                                >
                                  <IoCloseOutline size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* --- SHARE SECTION (Responsive) --- */}
                <div className="mt-4 md:mt-0 p-4 md:p-6 border border-gray-200 md:border-0 md:border-t md:border-gray-200 flex items-center justify-center md:justify-start gap-4 bg-white rounded-lg md:rounded-none">
                  <span className="text-[14px] font-medium text-logoc">{t('wishlist.share', 'Share:')}</span>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer">
                      <FaFacebookF size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer">
                      <FaTwitter size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer">
                      <FaPinterestP size={14} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer">
                      <FaInstagram size={14} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </Container>
      </section>
    </>
  );
};

export default Wishlist;
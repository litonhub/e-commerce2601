import React, { useState, useEffect } from 'react';
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaFacebookF, FaTwitter, FaPinterestP, FaInstagram,
  FaChevronUp, FaChevronDown, FaTimes
} from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FiMinus, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../context/CurrencyContext"; 

const ProductQuickView = ({ isOpen, onClose, product }) => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency(); 
  const queryClient = useQueryClient();

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
        "Failed to add product"
      );
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product._id,
      quantity,
      product: product
    });
  };

  const addToWishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      toast.success("Product added to wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to add product to wishlist"
      );
    },
  });

  const handleAddToWishlist = () => {
    addToWishlistMutation.mutate({ 
      productId: product._id,
      product: product
    });
  };

  useEffect(() => {
    if (product) {
      setMainImage(product.thumbnail?.url || product.images?.[0]?.url || "https://via.placeholder.com/400");
      setQuantity(1);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleQuantity = (type) => {
    if (type === 'inc' && quantity < (product?.stock || 100)) {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-[#FF8A00] text-[10px] lg:text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-[#FF8A00] text-[10px] lg:text-sm" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-[#FF8A00] text-[10px] lg:text-sm" />);
    }
    return stars;
  };

  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  const prodTitle = typeof product.title === 'object' ? (product.title[i18n.language] || product.title.en) : product.title;
  const prodDesc = typeof product.description === 'object' ? (product.description[i18n.language] || product.description.en) : product.description;
  const currentTags = typeof product.tags === 'object' && !Array.isArray(product.tags)
    ? (product.tags[i18n.language] || product.tags.en || [])
    : (product.tags || []);

  return (
    <div
      className="fixed inset-0 z-100 bg-black/60 flex items-center justify-center p-3 lg:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative w-full max-w-262.5">
        
        {/* Close Button: Absolute inside modal on mobile, outside on desktop */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 lg:-top-10 lg:right-0 w-7 h-7 lg:w-auto lg:h-auto bg-gray-100 lg:bg-transparent rounded-full flex items-center justify-center text-gray-600 lg:text-white hover:text-gray-900 lg:hover:text-gray-300 transition-colors z-[110] cursor-pointer"
        >
          <FaTimes className="text-[12px] lg:text-[26px]" />
        </button>

        {/* Modal Body */}
        <div
          // Added max-h-[90vh] or max-h-[85vh] for mobile to ensure it fits screen
          className="bg-white w-full rounded-lg lg:rounded-xl p-4 lg:p-10 flex flex-col lg:flex-row gap-3 lg:gap-10 max-h-[85vh] lg:max-h-[90vh] overflow-y-auto hide-scrollbar cursor-default relative"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Images Section: Made much more compact on mobile */}
          <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4 lg:w-1/2 h-auto lg:h-100">
            <div className="flex flex-row lg:flex-col items-center gap-2 lg:gap-3 w-full lg:w-20 shrink-0">
              <button className="hidden lg:block text-gray-400 hover:text-[#00B207] transition cursor-pointer">
                <FaChevronUp />
              </button>
              
              {/* Thumbnails */}
              <div className="flex flex-row lg:flex-col gap-1.5 lg:gap-3 overflow-x-auto lg:overflow-y-auto hide-scrollbar flex-1 py-1 w-full lg:w-auto">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImage(img.url)}
                    // Smaller thumbnails on mobile
                    className={`w-12 h-12 lg:w-20 lg:h-20 shrink-0 rounded border cursor-pointer p-0.5 lg:p-1 transition-all ${mainImage === img.url ? 'border-[#00B207]' : 'border-gray-200 hover:border-[#00B207]'}`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              
              <button className="hidden lg:block text-gray-400 hover:text-[#00B207] transition cursor-pointer">
                <FaChevronDown />
              </button>
            </div>

            {/* Main Image: Reduced height on mobile */}
            <div className="flex-1 flex items-center justify-center p-1 lg:p-4 bg-white h-40 sm:h-55 lg:h-full">
              <img src={mainImage} alt={prodTitle} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          {/* Details Section: Reduced margins and text sizes for compactness */}
          <div className="flex flex-col justify-center lg:w-1/2 font-pop text-logoc">

            <div className="flex flex-wrap items-center gap-1.5 lg:gap-3 mb-1.5 pr-6 lg:pr-0">
              <h2 className="text-[16px] sm:text-[18px] lg:text-3xl font-semibold leading-[120%] line-clamp-1">{prodTitle}</h2>
              {product.stock > 0 ? (
                <span className="bg-[#e6f7e6] text-[#00B207] text-[9px] lg:text-xs font-medium px-1.5 py-0.5 lg:px-2.5 lg:py-1 rounded shrink-0">{t('details.in_stock', 'In Stock')}</span>
              ) : (
                <span className="bg-[#f5e1e1] text-badgered text-[9px] lg:text-xs font-medium px-1.5 py-0.5 lg:px-2.5 lg:py-1 rounded shrink-0">{t('details.out_of_stock', 'Out of Stock')}</span>
              )}
            </div>

            <div className="flex items-center gap-2 lg:gap-4 text-[11px] lg:text-sm text-gray-500 mb-2 lg:mb-4">
              <div className="flex items-center gap-1">
                {renderStars(product.rating || product.averageRating)}
                <span className="ml-1 text-logoc">{product.totalRatings || 0} {t('details.review', 'Review')}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div><span className="font-medium text-logoc">SKU:</span> {product.sku || "2,51,594"}</div>
            </div>

            {/* Price Area: Smaller margin bottom */}
            <div className="flex items-center gap-1.5 lg:gap-3 mb-2.5 lg:mb-5 pb-2.5 lg:pb-5 border-b border-gray-100">
              {product.discountPercentage > 0 && (
                <span className="text-[14px] lg:text-xl text-gray-400 line-through">
                  {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                </span>
              )}
              <span className="text-[18px] lg:text-2xl font-semibold text-[#00B207]">
                {formatPrice(product.price)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="bg-[#f5e1e1] text-badgered text-[9px] lg:text-xs font-semibold px-1.5 py-0.5 lg:px-2.5 lg:py-1 rounded-full">
                  {product.discountPercentage}% {t('details.off', 'Off')}
                </span>
              )}
            </div>

            {/* Brand & Share: Flex row even on mobile to save vertical space */}
            <div className="flex flex-row items-center justify-between mb-2.5 lg:mb-5">
              <div className="flex items-center gap-1.5 lg:gap-2">
                <span className="text-[11px] lg:text-sm font-medium">{t('details.brand', 'Brand')}:</span>
                <div className="px-1.5 lg:px-3 h-5 lg:h-8 border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-[#00B207] font-semibold text-[9px] lg:text-xs capitalize">{product.brand || t('details.local', 'Local')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 lg:gap-3">
                <span className="hidden sm:inline text-[11px] lg:text-sm font-medium">{t('details.share', 'Share item')}:</span>
                <div className="flex gap-1 lg:gap-2">
                  <button className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer"><FaFacebookF className="text-[10px] lg:text-[14px]" /></button>
                  <button className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer"><FaTwitter className="text-[10px] lg:text-[14px]" /></button>
                  <button className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer"><FaPinterestP className="text-[10px] lg:text-[14px]" /></button>
                  <button className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300 cursor-pointer"><FaInstagram className="text-[10px] lg:text-[14px]" /></button>
                </div>
              </div>
            </div>

            {/* Description: Clamped to 2 lines on mobile */}
            <p className="text-gry text-[11px] lg:text-sm leading-[140%] lg:leading-relaxed mb-3 lg:mb-6 line-clamp-2 lg:line-clamp-3">
              {prodDesc || "No description available for this product."}
            </p>

            {/* Action Buttons: Adjusted heights and gaps */}
            <div className="flex flex-row items-center gap-2 lg:gap-4 mb-3 lg:mb-6 pb-3 lg:pb-6 border-b border-gray-100">
              <div className="flex items-center border border-gray-200 rounded-full h-8 lg:h-12 w-20 lg:w-32 px-2 lg:px-4 justify-between shrink-0">
                <button onClick={() => handleQuantity('dec')} disabled={product.stock < 1} className="text-gray-500 hover:text-black p-0.5 disabled:opacity-50 cursor-pointer"><FiMinus className="text-[10px] lg:text-[16px]" /></button>
                <span className="font-medium text-[12px] lg:text-base">{quantity}</span>
                <button onClick={() => handleQuantity('inc')} disabled={product.stock < 1} className="text-gray-500 hover:text-black p-0.5 disabled:opacity-50 cursor-pointer"><FiPlus className="text-[10px] lg:text-[16px]" /></button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={
                  product.stock < 1 ||
                  addToCartMutation.isPending
                }
                className="flex-1 h-8 lg:h-12 bg-[#00B207] text-white rounded-full text-[12px] lg:text-base font-semibold flex items-center justify-center gap-1.5 hover:bg-[#009206] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer px-2"
              >
                <span className="truncate">
                  {addToCartMutation.isPending ? t('hot_deals.adding', "Adding...") : t('details.add_to_cart', "Add to Cart")}
                </span>
                <HiOutlineShoppingBag className="text-[14px] lg:text-[20px] shrink-0" />
              </button>

              <button
                onClick={handleAddToWishlist}
                disabled={addToWishlistMutation.isPending}
                className="h-8 w-8 lg:h-12 lg:w-12 bg-[#e6f7e6] text-[#00B207] rounded-full flex items-center justify-center hover:bg-[#00B207] hover:text-white transition shrink-0 cursor-pointer disabled:opacity-50"
              >
                <AiOutlineHeart className="text-[14px] lg:text-[22px]" />
              </button>
            </div>

            {/* Meta tags */}
            <div className="space-y-1 lg:space-y-2">
              <p className="text-[11px] lg:text-sm"><span className="font-medium text-logoc">{t('details.category', 'Category')}:</span> <span className="text-gray-500 capitalize">{product.category}</span></p>
              {currentTags.length > 0 && (
                <p className="text-[11px] lg:text-sm"><span className="font-medium text-logoc">{t('details.tag', 'Tag')}:</span> <span className="text-gray-500 capitalize line-clamp-1 inline-block align-bottom">{currentTags.join(", ")}</span></p>
              )}
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
      `}} />
    </div>
  );
};

export default ProductQuickView;
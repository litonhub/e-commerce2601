import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  FaStar, FaStarHalfAlt, FaRegStar,
  FaFacebookF, FaInstagram, FaWhatsapp, FaGithub,
  FaCheckCircle, FaPlay
} from "react-icons/fa";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";

import Container from "../components/layouts/Container";
import PageBanner from '../components/common/PageBanner';
import Pdv from '../assets/images/pdv.png'
import ProductQuickView from "../components/ProductQuickView";

import { getSingleProduct } from "../api/productApi";
import { getProductReviews, submitReview } from "../services/reviewService";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";

const ProductDetails = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("descriptions");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const mobileThumbRef = useRef(null);
  const desktopThumbRef = useRef(null);

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: reviewsLoading
  } = useInfiniteQuery({
    queryKey: ['reviews', product?._id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getProductReviews(product._id, { page: pageParam, limit: 5 });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    enabled: !!product?._id && activeTab === 'customer',
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data) => {
      return await submitReview(data);
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews", product?._id] });
      loadProductDetails();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to write a review");
    submitReviewMutation.mutate({ productId: product._id, rating: reviewRating, comment: reviewComment });
  };

  const addToWishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      toast.success("Product added to wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add product to wishlist");
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      window.dispatchEvent(new Event("open-cart-sidebar"));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add product");
    },
  });

  const handleAddToCart = (item, qty = 1) => {
    addToCartMutation.mutate({
      productId: item._id,
      quantity: qty,
      product: item
    });
  };

  const handleAddToWishlist = (item, e) => {
    if (e) e.stopPropagation();
    addToWishlistMutation.mutate({
      productId: item._id,
      product: item
    });
  };

  useEffect(() => {
    if (slug) {
      loadProductDetails();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);

      const res = await getSingleProduct(slug);

      const productData = res.data.data.product;
      const relatedData = res.data.data.relatedProducts || [];

      setProduct(productData);
      setRelatedProducts(relatedData);

      setMainImage(productData.thumbnail?.url || productData.images?.[0]?.url);
      setQuantity(1);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantity = (type) => {
    if (type === 'inc' && quantity < (product?.stock || 1)) {
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
      stars.push(<FaStar key={`full-${i}`} className="text-[#FF8A00] text-[12px] lg:text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-[#FF8A00] text-[12px] lg:text-sm" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-[#FF8A00] text-[12px] lg:text-sm" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00B207] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-700">{t('details.not_found', 'Product not found')}</h2>
        <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-[#00B207] text-white rounded-md">{t('details.return_shop', 'Return to Shop')}</button>
      </div>
    );
  }

  const prodTitle = typeof product.title === 'object' ? (product.title[i18n.language] || product.title.en) : product.title;
  const prodDesc = typeof product.description === 'object' ? (product.description[i18n.language] || product.description.en) : product.description;

  const currentTags = typeof product.tags === 'object' && !Array.isArray(product.tags)
    ? (product.tags[i18n.language] || product.tags.en || [])
    : (product.tags || []);

  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
  const currentIndex = allImages.findIndex(img => img.url === mainImage);
  const allFetchedReviews = reviewsData?.pages.flatMap(page => page.reviews) || [];

  const scrollToThumb = (index) => {
    const applyScroll = (ref) => {
      if (ref.current) {
        const thumbArray = Array.from(ref.current.children);
        if (thumbArray[index]) {
          thumbArray[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };
    applyScroll(mobileThumbRef);
    applyScroll(desktopThumbRef);
  };

  const handleNextImage = () => {
    if (allImages.length === 0) return;
    const nextIndex = (currentIndex + 1) % allImages.length;
    setMainImage(allImages[nextIndex].url);
    scrollToThumb(nextIndex);
  };

  const handlePrevImage = () => {
    if (allImages.length === 0) return;
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setMainImage(allImages[prevIndex].url);
    scrollToThumb(prevIndex);
  };

  const socialLinks = [
    { icon: FaFacebookF, link: "https://www.facebook.com/arfin.sipon" },
    { icon: FaWhatsapp, link: "http://wa.me/+8801701054694" },
    { icon: FaGithub, link: "https://github.com/litonhub" },
    { icon: FaInstagram, link: "https://www.instagram.com/arfin.sipon" },
  ];

  return (
    <>
      <PageBanner items={["Product Details"]} />

      <Container className="pt-6 lg:pt-8 bg-white font-pop text-logoc pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-6 lg:px-0">

          {/* --- Image Section --- */}
          <div className="flex lg:hidden flex-row gap-2.5 h-[280px] sm:h-[380px]">
            <div className="flex flex-col items-center justify-center gap-1.5 w-14 sm:w-16 shrink-0 h-full">
              {allImages.length > 4 && (
                <button onClick={handlePrevImage} className="text-grynine hover:text-[#00B207] transition cursor-pointer shrink-0 py-1">
                  <GoChevronUp className="text-[20px]" />
                </button>
              )}
              <div ref={mobileThumbRef} className="flex flex-col gap-2.5 overflow-y-auto hide-scrollbar flex-1 py-1 w-full scroll-smooth min-h-0">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setMainImage(img.url); scrollToThumb(idx); }}
                    className={`shrink-0 rounded-sm border cursor-pointer w-full h-14 sm:h-16 transition-all p-0.5 ${mainImage === img.url ? 'border-primary' : 'border-gray-200 hover:border-grynine'}`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              {allImages.length > 4 && (
                <button onClick={handleNextImage} className="text-grynine hover:text-[#00B207] transition cursor-pointer shrink-0 py-1">
                  <GoChevronDown className="text-[20px]" />
                </button>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center bg-white h-full border border-gray-100 rounded-lg p-2 min-w-0">
              <img src={mainImage} alt={prodTitle} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <div className="hidden lg:flex gap-4 h-112.5 xl:h-125">
            {/* Thumbnails Sidebar */}
            <div className="flex flex-col items-center gap-4 w-20 shrink-0 h-full">
              <button onClick={handlePrevImage} className="text-gray-400 hover:text-[#00B207] transition cursor-pointer">
                <GoChevronUp size={24} />
              </button>
              <div ref={desktopThumbRef} className="flex flex-col gap-3 overflow-y-auto hide-scrollbar flex-1 py-1 scroll-smooth">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setMainImage(img.url); scrollToThumb(idx); }}
                    className={`shrink-0 rounded-md border cursor-pointer h-20 transition-all p-1 bg-white ${mainImage === img.url ? 'border-[#00B207] shadow-sm' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              <button onClick={handleNextImage} className="text-gray-400 hover:text-[#00B207] transition cursor-pointer">
                <GoChevronDown size={24} />
              </button>
            </div>

            {/* Main Image with Zoom Effect */}
            <div
              className="flex-1 relative flex items-center justify-center bg-white rounded-lg border border-gray-100 cursor-crosshair overflow-hidden"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={mainImage}
                alt={prodTitle}
                className={`w-full h-full max-h-100 xl:max-h-112.5 object-contain p-4 transition-opacity duration-200 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
              />

              {/* Zoom Layer (Visible on hover) */}
              <div
                className={`absolute inset-0 bg-no-repeat bg-white transition-opacity duration-200 pointer-events-none ${isZoomed ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '200%',
                }}
              />
            </div>
          </div>

          {/* --- Details Section --- */}
          <div className="flex flex-col justify-center mt-2 lg:mt-0">

            <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <h1 className="text-[22px] sm:text-2xl lg:text-3xl font-semibold leading-[130%] lg:leading-none">{prodTitle}</h1>
              {product.stock > 0 ? (
                <span className="bg-[#e6f7e6] text-[#00B207] text-[10px] lg:text-xs font-medium px-2 py-0.5 lg:py-1 rounded shrink-0">{t('details.in_stock', 'In Stock')}</span>
              ) : (
                <span className="bg-[#f5e1e1] text-badgered text-[10px] lg:text-xs font-medium px-2 py-0.5 lg:py-1 rounded shrink-0">{t('details.out_of_stock', 'Out of Stock')}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-[12px] lg:text-sm text-gray-500 mb-4 lg:mb-5">
              <div className="flex items-center gap-1">
                {renderStars(product.averageRating || product.rating || 0)}
                <span className="ml-1 text-logoc">{product.totalRatings || 0} {t('details.review', 'Review')}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div><span className="font-medium text-logoc">SKU:</span> {product.sku || "N/A"}</div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 mb-5 lg:mb-6 pb-5 lg:pb-6 border-b border-gray-100">
              {product.discountPercentage > 0 && (
                <span className="text-[16px] lg:text-xl text-gray-400 line-through">
                  {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                </span>
              )}
              <span className="text-[22px] lg:text-2xl font-semibold text-[#00B207]">{formatPrice(product.price)}</span>
              {product.discountPercentage > 0 && (
                <span className="bg-[#f5e1e1] text-badgered text-[10px] lg:text-xs font-semibold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full">
                  {product.discountPercentage}% {t('details.off', 'Off')}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 lg:mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[13px] lg:text-sm font-medium">{t('details.brand', 'Brand')}:</span>
                <div className="px-2 lg:px-3 h-7 lg:h-8 border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-[#00B207] font-semibold text-[11px] lg:text-xs capitalize">{product.brand || t('details.local', 'Local')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-[13px] lg:text-sm font-medium">{t('details.share', 'Share item')}:</span>

                {/* --- NEW SOCIAL LINKS RENDER --- */}
                <div className="flex gap-1.5 lg:gap-2">
                  {socialLinks.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-transparent text-[#4D4D4D] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-all duration-300"
                      >
                        <Icon size={12} className="lg:text-[14px]" />
                      </a>
                    );
                  })}
                </div>

              </div>
            </div>

            <p className="text-gry text-[13px] lg:text-[15px] leading-relaxed mb-6 lg:mb-8 line-clamp-3 lg:line-clamp-none">
              {prodDesc || "No description available for this product."}
            </p>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 lg:gap-4 mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-100">
              <div className="flex items-center border border-gray-200 rounded-full h-10 lg:h-12 w-28 lg:w-32 px-3 lg:px-4 justify-between shrink-0">
                <button onClick={() => handleQuantity('dec')} disabled={product.stock < 1} className="text-gray-500 hover:text-black p-1 disabled:opacity-50"><FiMinus size={14} className="lg:text-base" /></button>
                <span className="font-medium text-[14px] lg:text-base">{quantity}</span>
                <button onClick={() => handleQuantity('inc')} disabled={product.stock < 1} className="text-gray-500 hover:text-black p-1 disabled:opacity-50"><FiPlus size={14} className="lg:text-base" /></button>
              </div>

              <button
                onClick={() => handleAddToCart(product, quantity)}
                disabled={product.stock < 1 || addToCartMutation.isPending}
                className="flex-1 h-10 lg:h-12 bg-[#00B207] text-white rounded-full font-semibold text-[13px] lg:text-base flex items-center justify-center gap-2 hover:bg-[#009206] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 px-2"
              >
                <span className="truncate">{t('details.add_to_cart', 'Add to Cart')}</span> <HiOutlineShoppingBag size={18} className="lg:text-[20px]" />
              </button>

              <button
                onClick={(e) => handleAddToWishlist(product, e)}
                disabled={addToWishlistMutation.isPending}
                className="h-10 w-10 lg:h-12 lg:w-12 bg-[#e6f7e6] text-[#00B207] rounded-full flex items-center justify-center hover:bg-[#00B207] hover:text-white transition disabled:opacity-50 cursor-pointer shrink-0"
              >
                <AiOutlineHeart size={18} className="lg:text-[22px]" />
              </button>
            </div>

            <div className="space-y-1.5 lg:space-y-2">
              <p className="text-[12px] lg:text-sm"><span className="font-medium">{t('details.category', 'Category')}:</span> <span className="text-gray-500 capitalize">{product.category}</span></p>
              {currentTags.length > 0 && (
                <p className="text-[12px] lg:text-sm"><span className="font-medium">{t('details.tag', 'Tag')}:</span> <span className="text-gray-500 capitalize leading-relaxed">{currentTags.join(", ")}</span></p>
              )}
            </div>

          </div>
        </div>

        {/* --- Description Tabs --- */}
        <div className="mb-16 lg:mb-20 mt-12 lg:mt-20 px-4 md:px-6 lg:px-0">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-6 lg:mb-8 md:justify-center">
            {[t('details.tab_desc', 'Descriptions'), t('details.tab_info', 'Additional Information'), t('details.tab_feedback', 'Customer Feedback')].map((tab, idx) => {
              const keys = ['descriptions', 'additional', 'customer'];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(keys[idx])}
                  className={`px-4 lg:px-8 py-3 lg:py-4 font-medium text-[14px] lg:text-base transition-colors relative whitespace-nowrap ${activeTab === keys[idx] ? 'text-[#1a1a1a]' : 'text-gray-500 hover:text-black'}`}
                >
                  {tab}
                  {activeTab === keys[idx] && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00B207]"></div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12">

            <div className="text-[#666666] text-[13px] lg:text-[15px] leading-relaxed space-y-4 lg:space-y-6">

              {activeTab === 'descriptions' && (
                <>
                  <p>{prodDesc}</p>
                  <ul className="space-y-2.5 lg:space-y-3 mt-4">
                    <li className="flex items-center gap-2"><FaCheckCircle className="text-[#00B207] shrink-0" /> <span>{t('details.feat1', '100% Organic & Fresh Product.')}</span></li>
                    <li className="flex items-center gap-2"><FaCheckCircle className="text-[#00B207] shrink-0" /> <span>{t('details.feat2', 'Best quality guaranteed for you.')}</span></li>
                    <li className="flex items-center gap-2"><FaCheckCircle className="text-[#00B207] shrink-0" /> <span>{t('details.feat3', 'Fast and reliable delivery system.')}</span></li>
                  </ul>
                </>
              )}

              {activeTab === 'additional' && (
                <p>{t('details.weight', 'Weight')}: {product.weight || "N/A"} <br /> {t('details.unit', 'Unit')}: {product.unit || "pcs"}</p>
              )}

              {/* --- NEW REVIEW SYSTEM --- */}
              {activeTab === 'customer' && (
                <div className="flex flex-col gap-10 text-[#1a1a1a]">

                  {/* 1. Review Submit Form */}
                  <div className="bg-white border border-[#E6E6E6] rounded-xl p-5 lg:p-7 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    <h3 className="text-[16px] lg:text-[18px] font-semibold mb-4 lg:mb-5">Write a Review</h3>

                    {!user ? (
                      <div className="bg-[#f2f2f2] rounded-lg p-4 text-center">
                        <p className="text-[14px] text-gray-500">
                          Please <button onClick={() => navigate('/login')} className="text-[#00B207] font-semibold hover:underline">login</button> to write a review.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit}>
                        <div className="flex items-center gap-3 mb-4 lg:mb-5">
                          <span className="text-[14px] font-medium text-gray-600">Your Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`cursor-pointer text-[18px] lg:text-[22px] transition-colors ${star <= (hoverRating || reviewRating) ? 'text-[#FF8A00]' : 'text-gray-200'
                                  }`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setReviewRating(star)}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows="4"
                            placeholder="Share your thoughts about this product..."
                            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00B207] text-[14px] resize-none transition-colors placeholder:text-gray-400"
                            required
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={submitReviewMutation.isPending}
                          className="bg-[#00B207] text-white px-8 py-3 rounded-full font-semibold text-[14px] hover:bg-[#009206] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* 2. Review Display List */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[16px] lg:text-[18px] font-semibold">
                        Customer Reviews {product.totalRatings > 0 ? <span className="text-gray-400 text-sm">({product.totalRatings})</span> : ''}
                      </h3>
                    </div>

                    {reviewsLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="w-8 h-8 border-3 border-[#00B207] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : allFetchedReviews.length > 0 ? (
                      <div className="space-y-6">
                        {allFetchedReviews.map((review) => (
                          <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex gap-4">
                              <img
                                src={review.user?.avatar?.url || review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}&background=E6F7E6&color=00B207`}
                                alt={review.user?.name}
                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover shrink-0 border border-gray-100"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1.5">
                                  <h4 className="font-semibold text-[14px] lg:text-[15px]">{review.user?.name || 'Anonymous'}</h4>
                                  <span className="text-[11px] lg:text-[12px] text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString(i18n.language === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-0.5 mb-2.5">
                                  {renderStars(review.rating)}
                                </div>
                                <p className="text-[13px] lg:text-[14px] text-gray-600 leading-relaxed">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {hasNextPage && (
                          <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-full py-3 mt-2 border border-[#00B207] text-[#00B207] rounded-full font-semibold text-[14px] hover:bg-[#00B207] hover:text-white transition-colors disabled:opacity-60 cursor-pointer"
                          >
                            {isFetchingNextPage ? 'Loading...' : 'Load More Reviews'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-[#f9f9f9] rounded-lg border border-gray-100">
                        <p className="text-gray-500 text-[14px]">{t('details.no_review', 'No reviews yet for this product. Be the first to review!')}</p>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            <div>
              <div className="w-full h-48 lg:h-75 bg-gray-100 rounded-md overflow-hidden relative mb-4 lg:mb-6">
                <img src={Pdv} alt="Promo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <button className="w-12 h-12 lg:w-14 lg:h-14 bg-[#00B207] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <FaPlay className="ml-1 text-[16px] lg:text-[20px]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 border border-gray-100 rounded-lg p-4 lg:p-6 bg-white shadow-sm">
                <div className="flex items-start gap-2.5 lg:gap-3">
                  <div className="text-[#00B207] text-xl lg:text-2xl mt-0.5 lg:mt-1">🏷️</div>
                  <div>
                    <h4 className="font-semibold text-[13px] lg:text-sm mb-0.5 lg:mb-1">{t('details.promo1_title', 'Big Discount')}</h4>
                    <p className="text-[11px] lg:text-xs text-gray-500">{t('details.promo1_desc', 'Save your money with us')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 lg:gap-3">
                  <div className="text-[#00B207] text-xl lg:text-2xl mt-0.5 lg:mt-1">🌿</div>
                  <div>
                    <h4 className="font-semibold text-[13px] lg:text-sm mb-0.5 lg:mb-1">{t('details.promo2_title', '100% Organic')}</h4>
                    <p className="text-[11px] lg:text-xs text-gray-500">{t('details.promo2_desc', '100% Organic Products')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Related Products --- */}
        {relatedProducts?.length > 0 && (
          <div className="lg:py-20 px-4 md:px-6 lg:px-0">
            <h2 className="text-[24px] lg:text-hsize font-semibold text-center mb-6 lg:mb-8 leading-[120%] text-logoc">{t('details.related', 'Related Products')}</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product-details/${item.slug}`)}
                  className="group relative border border-brdr rounded-lg bg-white p-2.5 lg:p-4 flex flex-col transition-all duration-300 hover:border-[#00B207] hover:shadow-[0_8px_20px_rgba(0,178,7,0.15)] hover:z-10 cursor-pointer overflow-hidden"
                >
                  {item.discountPercentage > 0 && (
                    <span className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-badgered text-white text-[10px] lg:text-xs font-semibold px-1.5 py-0.5 lg:px-2.5 lg:py-1 rounded z-10">
                      {t('details.sale', 'Sale')} {item.discountPercentage}%
                    </span>
                  )}

                  <div className="absolute top-2 right-2 lg:top-4 lg:right-4 flex flex-col gap-1.5 lg:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                    <button
                      onClick={(e) => handleAddToWishlist(item, e)}
                      disabled={addToWishlistMutation.isPending}
                      className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-white border border-[#f2f2f2] flex items-center justify-center hover:bg-[#00B207] hover:text-white transition-colors disabled:opacity-50"
                    >
                      <AiOutlineHeart className="text-[14px] lg:text-[20px]" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(item); }}
                      className="hidden lg:flex w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-white border border-[#f2f2f2] items-center justify-center hover:bg-[#00B207] hover:text-white transition-colors"
                    >
                      <AiOutlineEye className="text-[14px] lg:text-[20px]" />
                    </button>
                  </div>

                  <div className="w-full h-28 lg:h-75.5 flex items-center justify-center p-1.25 relative mt-2 lg:mt-0">
                    <img
                      src={item.thumbnail?.url}
                      alt={typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="mt-auto flex flex-col pt-2 lg:pt-2 pr-6 lg:pr-0">
                    <h3 className="text-[12px] lg:text-sm font-medium text-gray-700 group-hover:text-[#00B207] transition-colors mb-1 lg:mb-1.5 line-clamp-2 lg:line-clamp-1 leading-[130%] lg:leading-normal">
                      {typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                      <span className="font-semibold text-[14px] lg:text-base text-logoc">
                        {formatPrice(item.price)}
                      </span>
                      {item.discountPercentage > 0 && (
                        <span className="line-through text-[11px] lg:text-sm font-medium text-gray-400">
                          {formatPrice(item.price / (1 - item.discountPercentage / 100))}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 origin-left scale-90 lg:scale-100">
                      {renderStars(item.averageRating || item.rating || 0)}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(item, 1); }}
                      disabled={addToCartMutation.isPending}
                      className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#f2f2f2] text-gray-700 flex items-center justify-center transition-all duration-300 group-hover:bg-[#00B207] group-hover:text-white z-10 disabled:opacity-50 shadow-sm lg:shadow-none"
                    >
                      <HiOutlineShoppingBag className="text-[14px] lg:text-[20px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        <ProductQuickView
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
        />
      </Container>

    </>
  );
};

export default ProductDetails;
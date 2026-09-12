import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FaArrowRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import {
  AiOutlineHeart,
  AiOutlineEye,
} from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import Container from "./layouts/Container";
import { getProducts } from "../api/productApi";
import ProductQuickView from "../components/ProductQuickView";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; 
import { useCurrency } from "../context/CurrencyContext"; 

const PopularProducts = () => {
  const { t, i18n } = useTranslation(); 
  const { formatPrice } = useCurrency(); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const addToWishlistMutation = useMutation({
    mutationFn: addToWishlist,

    onSuccess: () => {
      toast.success("Product added to wishlist");

      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
        "Failed to add product to wishlist"
      );
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,

    onSuccess: () => {
      toast.success("Product added to cart");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      window.dispatchEvent(new Event("open-cart-sidebar"));
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
        "Failed to add product"
      );
    },
  });

const handleAddToCart = (item, e) => {
    if (e) e.stopPropagation();
    
    addToCartMutation.mutate({
      productId: item._id,
      quantity: 1,
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

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await getProducts({
        popular: true,
        limit: 10,
      });

      setProducts(res.data.data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          className="text-orange-400 text-xs lg:text-sm"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt
          key="half"
          className="text-orange-400 text-xs lg:text-sm"
        />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <FaRegStar
          key={`empty-${stars.length}`}
          className="text-orange-400 text-xs lg:text-sm"
        />
      );
    }

    return stars;
  };

  return (
    <section className="py-5 lg:py-15">
      <Container>
        {/* Title & View All strictly on 1 line on mobile */}
        <div className="flex items-center justify-between mb-4 lg:mb-8 px-4 md:px-6 lg:px-0">
          <h2 className="font-pop font-semibold text-[20px] lg:text-hsize text-logoc leading-[120%] truncate pr-2">
            {t('popular_products.title', 'Popular Products')}
          </h2>

          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-x-1 lg:gap-x-3 font-pop text-primary font-medium text-[14px] lg:text-[16px] leading-[150%] cursor-pointer shrink-0 hover:underline"
          >
            {t('popular_products.view_all', 'View All')}
            <FaArrowRight className="size-3.25 lg:size-3.75" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 -mr-px -mb-px px-4 md:px-6 lg:px-0">
          {products.map((item, index) => {

            const isWidowOnMobile = index === products.length - 1 && products.length % 2 !== 0;

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/product-details/${item.slug}`)}
                className={`group relative border border-brdrtwo -mr-px -mb-px bg-white transition-all duration-300 hover:border-[#2C742F] hover:shadow-[0_0_12px_0_rgba(32,181,38,0.32)] hover:z-10 cursor-pointer overflow-hidden py-3 lg:py-0 flex-col ${isWidowOnMobile ? 'hidden md:flex' : 'flex'}`}
              >
                {item.discountPercentage > 0 && (
                  <span className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-[#EA4B48] text-white text-[10px] lg:defaultfs px-1.5 py-0.5 lg:px-2 lg:py-1 rounded z-10">
                    {t('popular_products.sale', 'Sale')} {item.discountPercentage}%
                  </span>
                )}

                {/* Icons Area: Visible on mobile, hover-only on desktop */}
                <div className="absolute top-2 right-2 lg:top-4 lg:right-4 flex flex-col gap-2 lg:gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                  <button
                    onClick={(e) => handleAddToWishlist(item, e)}
                    disabled={addToWishlistMutation.isPending}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full cursor-pointer text-logoc bg-white shadow border border-[#f2f2f2] flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-50 text-xs lg:text-base"
                  >
                    <AiOutlineHeart />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(item);
                    }}
                    className="hidden lg:flex w-8 h-8 lg:w-10 lg:h-10 rounded-full cursor-pointer text-logoc bg-white border border-[#f2f2f2] shadow items-center justify-center hover:bg-primary hover:text-white text-xs lg:text-base"
                  >
                    <AiOutlineEye />
                  </button>
                </div>

                <div className="grow flex items-center justify-center min-h-30 lg:min-h-auto">
                  <img
                    src={item.thumbnail?.url}
                    alt={typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                    className="h-32 sm:h-44 lg:h-57.5 mx-auto object-contain px-2 pt-2 lg:px-1.25 lg:pt-1.25"
                  />
                </div>

                {/* Added pr-9 on mobile to protect space for cart icon & line-clamp-2 to prevent overflow */}
                <div className="px-2.5 lg:px-3 mt-2 lg:mt-4.25 mb-2 lg:mb-3 pr-9 lg:pr-3">
                  <h3 className="text-[12px] sm:text-[13px] lg:defaultfs text-[#4d4d4d] transition-colors duration-300 group-hover:text-[#2C742F] line-clamp-2 leading-[130%] lg:leading-normal">
                    {typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 lg:gap-2 font-pop text-[13px] lg:text-[16px] leading-[150%] mt-1">
                    <span className="font-medium text-logoc">
                      {formatPrice(item.price)}
                    </span>

                    {item.discountPercentage > 0 && (
                      <span className="line-through font-normal text-[11px] lg:text-base text-grynine">
                        {formatPrice(item.price / (1 - item.discountPercentage / 100))}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 mt-0.5 lg:mt-1 scale-90 origin-left lg:scale-100">
                    {renderStars(item.rating || item.averageRating)}
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(item, e)}
                  disabled={addToCartMutation.isPending}
                  className="absolute bottom-3 right-2.5 lg:bottom-6 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#f2f2f2] text-logoc cursor-pointer flex items-center justify-center transition-all duration-300 group-hover:bg-green-500 group-hover:text-white z-10 disabled:opacity-60 text-sm lg:text-base shadow-sm lg:shadow-none"
                >
                  <HiOutlineShoppingBag />
                </button>
              </div>
            );
          })}
        </div>
      </Container>

      <ProductQuickView
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </section>
  );
};

export default PopularProducts;
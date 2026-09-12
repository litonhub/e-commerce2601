import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FaArrowRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import Container from "./layouts/Container";
import { getProducts } from "../api/productApi";
import ProductQuickView from "../components/ProductQuickView";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../context/CurrencyContext"; 

const BestSeller = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency(); 

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: addToCart,

    onSuccess: () => {
      toast.success("Product added to cart");

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      // Sidebar Open
      window.dispatchEvent(new Event("open-cart-sidebar"));
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
        "Failed to add product"
      );
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: addToWishlist,

    onSuccess: () => {
      toast.success("Product added to wishlist");

      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
        "Failed to add wishlist"
      );
    },
  });

  const handleAddToCart = (product, e) => {
    e.stopPropagation();

    addToCartMutation.mutate({
      productId: product._id,
      quantity: 1,
      product: product
    });
  };

  const handleAddToWishlist = (product, e) => {
    e.stopPropagation();

    wishlistMutation.mutate({
      productId: product._id,
      product: product
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts({
        bestSeller: true,
        limit: 10,
      });

      setProducts(res.data.data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-[12px] lg:text-sm" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-[12px] lg:text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[12px] lg:text-sm" />);
      }
    }

    return stars;
  };

  // Modal Open/Close Handlers
  const handleOpenModal = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="py-4 lg:py-0">
      <Container>
        <div className="mb-4 lg:mb-8 flex items-center justify-between px-4 md:px-6 lg:px-0">
          <h2 className="font-pop text-[20px] lg:text-hsize font-semibold leading-[120%] text-logoc truncate pr-2">
            {t('best_sellers.title', 'Best Seller Products')}
          </h2>

          <button
            onClick={() => navigate('/shop')}
            className="flex shrink-0 cursor-pointer items-center gap-x-1 lg:gap-x-3 font-pop text-[14px] lg:text-[16px] font-medium leading-[150%] text-primary hover:underline"
          >
            {t('best_sellers.view_all', 'View All')}
            <FaArrowRight className="size-3.25 lg:size-3.75" />
          </button>
        </div>

        <div className="-mb-px -mr-px grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 px-4 md:px-6 lg:px-0">
          {products.map((item, index) => {
            const isWidowOnMobile = index === products.length - 1 && products.length % 2 !== 0;

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/product-details/${item.slug}`)}
                className={`group relative -mb-px -mr-px cursor-pointer overflow-hidden border border-brdrtwo bg-white transition-all duration-300 hover:z-10 hover:border-[#2C742F] hover:shadow-[0_0_12px_0_rgba(32,181,38,0.32)] flex-col py-3 lg:py-0 ${isWidowOnMobile ? 'hidden md:flex' : 'flex'}`}
              >
                {item.discountPercentage > 0 && (
                  <span className="absolute left-2 top-2 lg:left-4 lg:top-4 rounded bg-[#EA4B48] px-1.5 py-0.5 lg:px-2 lg:py-1 text-[9px] lg:defaultfs text-white z-10">
                    {t('best_sellers.sale', 'Sale')} {item.discountPercentage}%
                  </span>
                )}

                <div className="absolute right-2 top-2 lg:right-4 lg:top-4 flex flex-col gap-2 lg:gap-3 opacity-100 lg:opacity-0 transition duration-300 group-hover:opacity-100 z-20">
                  {/* Heart Icon: Always visible on mobile, hover-only on desktop */}
                  <button
                    onClick={(e) => handleAddToWishlist(item, e)}
                    disabled={wishlistMutation.isPending}
                    className="flex h-8 w-8 lg:h-10 lg:w-10 cursor-pointer items-center justify-center rounded-full border border-[#f2f2f2] bg-white text-logoc shadow hover:bg-primary hover:text-white disabled:opacity-50"
                  >
                    <AiOutlineHeart className="text-sm lg:text-base" />
                  </button>
                  {/* Quick View (Eye) Icon: Now visible on mobile with correct size, hover-only on desktop */}
                  <button
                    onClick={(e) => handleOpenModal(item, e)}
                    className="hidden lg:flex h-8 w-8 lg:h-10 lg:w-10 cursor-pointer items-center justify-center rounded-full border border-[#f2f2f2] bg-white text-logoc shadow hover:bg-primary hover:text-white"
                  >
                    <AiOutlineEye className="text-sm lg:text-base" />
                  </button>
                </div>

                <div className="grow flex items-center justify-center min-h-30 lg:min-h-auto">
                  <img
                    src={item.thumbnail?.url}
                    alt={typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                    className="h-32 sm:h-44 lg:h-57.5 mx-auto object-contain px-2 pt-4 lg:px-1.25 lg:pt-1.25"
                  />
                </div>

                <div className="mt-2 lg:mt-4.25 mb-2 lg:mb-3 px-2.5 lg:px-3 pr-8 lg:pr-3">
                  <h3 className="text-[12px] sm:text-[13px] lg:defaultfs text-[#4d4d4d] transition-colors duration-300 group-hover:text-[#2C742F] line-clamp-2 lg:line-clamp-1 leading-[130%] lg:leading-normal">
                    {typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 lg:gap-2 font-pop text-[13px] lg:text-[16px] leading-[150%] mt-1 lg:mt-0">
                    <span className="font-medium text-logoc">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 lg:gap-1 text-orange-400 mt-1 origin-left">
                    {renderStars(item.rating || item.averageRating)}
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(item, e)}
                  disabled={addToCartMutation.isPending}
                  className="absolute bottom-3 right-2.5 lg:bottom-6 lg:right-4 flex h-8 w-8 lg:h-10 lg:w-10 cursor-pointer items-center justify-center rounded-full bg-[#f2f2f2] text-logoc transition-all duration-300 group-hover:bg-green-500 group-hover:text-white hover:bg-green-500 hover:text-white z-20 disabled:opacity-50 shadow-sm lg:shadow-none"
                >
                  <HiOutlineShoppingBag className="text-sm lg:text-base" />
                </button>
              </div>
            );
          })}
        </div>
      </Container>

      <ProductQuickView
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default BestSeller;
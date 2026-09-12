import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft
} from "react-icons/fa";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { VscSettings } from "react-icons/vsc";
import { MdClose } from "react-icons/md"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../context/CurrencyContext"; 

import Container from "../components/layouts/Container";
import PageBanner from '../components/common/PageBanner';
import ProductQuickView from "../components/ProductQuickView";

import { getProducts } from "../api/productApi";
import { addToCart } from "../services/cartService";
import { addToWishlist } from "../services/wishlistService";

const Shop = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const ITEMS_PER_PAGE = 15; 

  const categoryFromUrl = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("q") || "";
  
  const tagFromUrl = searchParams.get("tag") || "";
  const isDiscountedFromUrl = searchParams.get("isDiscounted") === "true";
  const sortFromUrl = searchParams.get("sort") || "latest";
  const hotDealsFromUrl = searchParams.get("hotDeals") === "true";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [sortBy, setSortBy] = useState(sortFromUrl);
  const [selectedRating, setSelectedRating] = useState(null);

  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [debouncedPrice, setDebouncedPrice] = useState([0, 1500]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true,
    tags: true
  });

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [categoriesData, setCategoriesData] = useState([
    { name: 'All Products', value: 'All', count: 0 },
    { name: 'Fresh Fruit', value: 'fresh fruit', count: 0 },
    { name: 'Fresh Vegetables', value: 'fresh vegetables', count: 0 },
    { name: 'Cooking', value: 'cooking', count: 0 },
    { name: 'Snacks', value: 'snacks', count: 0 },
    { name: 'Beverages', value: 'beverages', count: 0 },
    { name: 'Beauty & Health', value: 'beauty & health', count: 0 },
    { name: 'Bread & Bakery', value: 'bread & bakery', count: 0 },
  ]);

  const tags = ["Healthy", "Low fat", "Vegetarian", "Kid foods", "Vitamins", "Bread", "Meat", "Snacks", "Fruit"];

  const queryClient = useQueryClient();

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

const handleAddToCart = (item, e) => {
    if(e) e.stopPropagation();
    addToCartMutation.mutate({ productId: item._id, quantity: 1, product: item });
  };

  const handleAddToWishlist = (item, e) => {
    if(e) e.stopPropagation();
    addToWishlistMutation.mutate({ productId: item._id, product: item });
  };

  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    const sort = searchParams.get("sort") || "latest";
    setSelectedCategory(cat);
    setSortBy(sort);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPrice(priceRange);
    }, 500);
    return () => clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, selectedRating, debouncedPrice, searchQuery]);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileFilterOpen]);

  const fetchCategoryCounts = async () => {
    try {
      const categoriesList = [
        'fresh fruit',
        'fresh vegetables',
        'cooking',
        'snacks',
        'beverages',
        'beauty & health',
        'bread & bakery'
      ];

      const countsPromises = categoriesList.map(async (catVal) => {
        const res = await getProducts({ category: catVal, limit: 1 });
        return { value: catVal, count: res.data.data.pagination?.totalProducts || res.data.data.total || 0 };
      });

      const allRes = await getProducts({ limit: 1 });
      const totalAllCount = allRes.data.data.pagination?.totalProducts || allRes.data.data.total || 0;

      const results = await Promise.all(countsPromises);

      setCategoriesData(prev => prev.map(c => {
        if (c.value === 'All') return { ...c, count: totalAllCount };
        const found = results.find(r => r.value === c.value);
        return found ? { ...c, count: found.count } : c;
      }));
    } catch (err) {
      console.error("Failed to load category counts", err);
    }
  };


  useEffect(() => {
    loadProducts();
    window.scrollTo(0, 0);
  }, [selectedCategory, currentPage, sortBy, selectedRating, debouncedPrice, searchQuery, tagFromUrl, isDiscountedFromUrl, hotDealsFromUrl]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({
        q: searchQuery || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        sort: searchQuery ? undefined : sortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        minPrice: debouncedPrice[0],
        maxPrice: debouncedPrice[1],
        rating: selectedRating || undefined,
        // --- [FIXED]: Pass dynamic parameters to backend API ---
        tag: tagFromUrl || undefined,
        isDiscounted: isDiscountedFromUrl || undefined,
        hotDeals: hotDealsFromUrl || undefined,
      });

      let fetchedProducts = res.data.data.products || [];

      if (searchQuery && fetchedProducts.length > 0) {
        fetchedProducts.sort((a, b) => {
          if (sortBy === "price_asc") return a.price - b.price;
          if (sortBy === "price_desc") return b.price - a.price;
          if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
          if (sortBy === "rating") return (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0);
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }

      setProducts(fetchedProducts);

      const total = res.data.data.pagination?.totalProducts || res.data.data.total || 0;
      setTotalResults(total);

    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 10);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 10);
    setPriceRange([priceRange[0], value]);
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-orange-400 text-[10px] lg:text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-orange-400 text-[10px] lg:text-sm" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-orange-400 text-[10px] lg:text-sm" />);
    }
    return stars;
  };

  // --- [FIXED]: Updated sorting options label based on generic params ---
  const sortOptions = [
    { value: "latest", label: t('shop.latest', 'Latest') },
    { value: "new-arrivals", label: t('shop.new_arrivals', 'New Arrivals') },
    { value: "best-selling", label: t('shop.best_selling', 'Best Selling') },
    { value: "top-rated", label: t('shop.top_rated', 'Top Rated') },
    { value: "oldest", label: t('shop.oldest', 'Oldest') },
    { value: "price_asc", label: t('shop.price_asc', 'Price: Low to High') },
    { value: "price_desc", label: t('shop.price_desc', 'Price: High to Low') }
  ];

  return (
    <>
      <PageBanner items={["Shop"]} />

      <Container className="py-6 lg:py-8 bg-white font-pop text-logoc">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6 lg:mb-8 px-4 md:px-6 lg:px-0">
          
          <div className="hidden lg:block w-full lg:w-78 shrink-0"></div>

          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            
            <button 
              onClick={() => { if(window.innerWidth < 1024) setIsMobileFilterOpen(true) }}
              className="w-full sm:w-auto lg:hidden bg-primary hover:bg-[#246326] text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
            >
              <span>{t('shop.filter', 'Filter')}</span>
              <VscSettings size={18} />
            </button>

            <div className="flex flex-row items-center justify-between w-full text-[13px] lg:text-[14px]">
              
              <div className="flex items-center gap-2">
                <span className="text-grynine hidden sm:inline">{t('shop.sort_by', 'Sort by:')}</span>
                
                <div className="relative" ref={sortRef}>
                  <div
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="border border-brdrtwo rounded-md px-3 lg:px-4 py-1.5 flex items-center justify-between gap-3 cursor-pointer bg-white min-w-[140px] lg:min-w-44 hover:border-primary transition-colors select-none"
                  >
                    <span className="font-medium text-logoc text-[12px] lg:text-[14px] truncate">
                      {sortOptions.find(opt => opt.value === sortBy)?.label || "Sort"}
                    </span>
                    <FaChevronDown className={`text-grynine text-[10px] lg:text-xs transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-primary' : ''}`} />
                  </div>

                  <div className={`absolute right-0 lg:left-0 top-full mt-1.5 w-[160px] lg:w-full bg-white border border-gray-100 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-50 transition-all duration-300 origin-top-right lg:origin-top ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                          // --- Update URL on sort change ---
                          const params = new URLSearchParams(searchParams);
                          params.set("sort", option.value);
                          navigate(`?${params.toString()}`);
                        }}
                        className={`px-4 py-2.5 text-[12px] lg:text-[14px] cursor-pointer transition-colors ${sortBy === option.value ? 'bg-[#e6f7e6] text-[#2C742F] font-medium border-l-2 border-[#2C742F]' : 'text-gray-600 hover:bg-gray-50 hover:text-logoc border-l-2 border-transparent'}`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="font-medium text-logoc">
                <span className="font-bold">{totalResults}</span> {t('shop.results', 'Results Found')}
              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {isMobileFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-110 lg:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            />
          )}

          <aside className={`fixed inset-y-0 left-0 z-120 w-70 sm:w-[320px] bg-white h-dvh overflow-y-auto px-5 py-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-[20px] font-semibold text-logoc">{t('shop.filter', 'Filter')}</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="mb-6 pb-6 border-b border-brdrtwo">
              <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSection('category')}>
                <h3 className="text-[16px] font-semibold text-logoc">{t('shop.all_categories', 'All Categories')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.category ? 'rotate-180' : ''}`} />
              </div>
              {openSections.category && (
                <ul className="space-y-3">
                  {categoriesData.map((cat, idx) => {
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <li key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => { 
                        setSelectedCategory(cat.value); 
                        setIsMobileFilterOpen(false);
                        const params = new URLSearchParams(searchParams);
                        params.set("category", cat.value);
                        navigate(`?${params.toString()}`);
                      }}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-[#2C742F]' : 'border-brdrtwo group-hover:border-[#2C742F]'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#2C742F]"></div>}
                        </div>
                        <span className={`text-[13px] ${isSelected ? 'text-logoc font-medium' : 'text-grynine group-hover:text-logoc'}`}>{cat.name}</span>
                        <span className="text-grynine text-[11px] ml-auto">({cat.count || 0})</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="mb-6 pb-6 border-b border-brdrtwo">
              <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSection('price')}>
                <h3 className="text-[16px] font-semibold text-logoc">{t('shop.price', 'Price')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} />
              </div>
              {openSections.price && (
                <div className="px-2 pt-2 pb-4">
                  <div className="relative h-1 bg-[#f2f2f2] rounded-full mb-6 mt-4">
                    <div className="absolute h-full bg-[#2C742F] rounded-full pointer-events-none" style={{ left: `${(priceRange[0] / 1500) * 100}%`, right: `${100 - (priceRange[1] / 1500) * 100}%` }}></div>
                    <input type="range" min="0" max="1500" value={priceRange[0]} onChange={handleMinPriceChange} className="custom-slider absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none outline-none" style={{ zIndex: priceRange[0] > 1400 ? 5 : 3 }} />
                    <input type="range" min="0" max="1500" value={priceRange[1]} onChange={handleMaxPriceChange} className="custom-slider absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none outline-none" style={{ zIndex: 4 }} />
                  </div>
                  <div className="text-[13px] text-grynine">
                    Price: <span className="font-medium text-logoc">{formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6 pb-6 border-b border-brdrtwo">
              <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSection('rating')}>
                <h3 className="text-[16px] font-semibold text-logoc">{t('shop.rating', 'Rating')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.rating ? 'rotate-180' : ''}`} />
              </div>
              {openSections.rating && (
                <ul className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star, idx) => {
                    const isSelected = selectedRating === star;
                    return (
                      <li key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => { setSelectedRating(isSelected ? null : star); setIsMobileFilterOpen(false); }}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#2C742F] border-[#2C742F]' : 'border-brdrtwo group-hover:border-[#2C742F]'}`}>
                          {isSelected && (<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                        </div>
                        <div className="flex items-center gap-1">{renderStars(star)}</div>
                        <span className={`text-[13px] ${isSelected ? 'text-logoc font-medium' : 'text-grynine'}`}>{star}.0 & up</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="mb-6 pb-6">
              <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSection('tags')}>
                <h3 className="text-[16px] font-semibold text-logoc">{t('shop.popular_tag', 'Popular Tag')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.tags ? 'rotate-180' : ''}`} />
              </div>
              {openSections.tags && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("tag", tag.toLowerCase());
                        navigate(`?${params.toString()}`);
                        setIsMobileFilterOpen(false);
                      }} 
                      key={idx} className="px-3 py-1.5 rounded-full text-[12px] cursor-pointer transition-colors bg-[#f2f2f2] text-logoc hover:bg-[#e6f7e6] hover:text-[#2C742F]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </aside>


          <aside className="w-full lg:w-78 shrink-0 hidden lg:block">
            <div className="mb-6 pb-6 border-b border-brdrtwo">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('category')}
              >
                <h3 className="text-lg font-semibold text-logoc">{t('shop.all_categories', 'All Categories')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.category ? 'rotate-180' : ''}`} />
              </div>
              {openSections.category && (
                <ul className="space-y-3">
                  {categoriesData.map((cat, idx) => {
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <li
                        key={idx}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          const params = new URLSearchParams(searchParams);
                          params.set("category", cat.value);
                          navigate(`?${params.toString()}`);
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-[#2C742F]' : 'border-brdrtwo group-hover:border-[#2C742F]'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#2C742F]"></div>}
                        </div>
                        <span className={`text-[14px] ${isSelected ? 'text-logoc font-medium' : 'text-grynine group-hover:text-logoc'}`}>{cat.name}</span>
                        <span className="text-grynine text-xs ml-auto">({cat.count || 0})</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="mb-6 pb-6 border-b border-brdrtwo">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('price')}
              >
                <h3 className="text-lg font-semibold text-logoc">{t('shop.price', 'Price')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} />
              </div>
              {openSections.price && (
                <div className="px-2 pt-2 pb-4">
                  <div className="relative h-1 bg-[#f2f2f2] rounded-full mb-6 mt-4">
                    <div
                      className="absolute h-full bg-[#2C742F] rounded-full pointer-events-none"
                      style={{
                        left: `${(priceRange[0] / 1500) * 100}%`,
                        right: `${100 - (priceRange[1] / 1500) * 100}%`
                      }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="1500"
                      value={priceRange[0]}
                      onChange={handleMinPriceChange}
                      className="custom-slider absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none outline-none"
                      style={{ zIndex: priceRange[0] > 1400 ? 5 : 3 }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1500"
                      value={priceRange[1]}
                      onChange={handleMaxPriceChange}
                      className="custom-slider absolute w-full -top-1.5 h-4 appearance-none bg-transparent pointer-events-none outline-none"
                      style={{ zIndex: 4 }}
                    />
                  </div>
                  <div className="text-[14px] text-grynine">
                    Price: <span className="font-medium text-logoc">{formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6 pb-6 border-b border-brdrtwo">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('rating')}
              >
                <h3 className="text-lg font-semibold text-logoc">{t('shop.rating', 'Rating')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.rating ? 'rotate-180' : ''}`} />
              </div>
              {openSections.rating && (
                <ul className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star, idx) => {
                    const isSelected = selectedRating === star;
                    return (
                      <li
                        key={idx}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setSelectedRating(isSelected ? null : star)}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#2C742F] border-[#2C742F]' : 'border-brdrtwo group-hover:border-[#2C742F]'}`}>
                          {isSelected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-1">{renderStars(star)}</div>
                        <span className={`text-[14px] ${isSelected ? 'text-logoc font-medium' : 'text-grynine'}`}>{star}.0 & up</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="mb-6 pb-6 border-b border-brdrtwo">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('tags')}
              >
                <h3 className="text-lg font-semibold text-logoc">{t('shop.popular_tag', 'Popular Tag')}</h3>
                <FaChevronDown className={`text-grynine text-sm transition-transform duration-300 ${openSections.tags ? 'rotate-180' : ''}`} />
              </div>
              {openSections.tags && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <span
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("tag", tag.toLowerCase());
                        navigate(`?${params.toString()}`);
                      }}
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-[13px] cursor-pointer transition-colors bg-[#f2f2f2] text-logoc hover:bg-[#e6f7e6] hover:text-[#2C742F]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 w-full">
            {loading ? (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#2C742F] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="w-full h-64 flex flex-col items-center justify-center text-grynine bg-[#f9f9f9] rounded-xl px-4 text-center mx-4 md:mx-6 lg:mx-0">
                <HiOutlineShoppingBag size={48} className="text-gray-300 mb-4" />
                <p className="text-lg font-medium text-logoc">{t('shop.no_products', 'No products found')}</p>
                <p className="text-sm mt-1">{t('shop.adjust_filters', 'Try adjusting your filters (category, price, or rating).')}</p>
                <button
                  onClick={() => { 
                    setSelectedCategory("All"); 
                    setPriceRange([0, 1500]); 
                    setSelectedRating(null); 
                    navigate("/shop"); 
                  }}
                  className="mt-5 px-6 py-2.5 bg-primary text-white rounded-md hover:bg-[#246326] transition-colors cursor-pointer text-sm"
                >
                  {t('shop.clear_filters', 'Clear Filters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 px-4 md:px-6 lg:px-0">
                {products.map((item, index) => {
                  
                  const isWidowOnMobile = products.length > 1 && index === products.length - 1 && products.length % 2 !== 0;

                  return (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/product-details/${item.slug}`)}
                      className={`group relative border border-brdrtwo rounded-lg bg-white p-2.5 lg:p-4 flex flex-col transition-all duration-300 hover:border-[#2C742F] hover:shadow-[0_0_12px_0_rgba(32,181,38,0.32)] hover:z-10 cursor-pointer overflow-hidden ${isWidowOnMobile ? 'col-span-2 lg:col-span-1' : ''}`}
                    >
                      {item.discountPercentage > 0 && (
                        <span className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-[#EA4B48] text-white text-[10px] lg:text-[12px] px-1.5 py-0.5 lg:px-2 lg:py-1 rounded z-10">
                          {t('shop.sale', 'Sale')} {item.discountPercentage}%
                        </span>
                      )}

                      <div className="absolute top-2 right-2 lg:top-4 lg:right-4 flex flex-col gap-1.5 lg:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                        <button
                          onClick={(e) => handleAddToWishlist(item, e)}
                          disabled={addToWishlistMutation.isPending}
                          className="w-7 h-7 lg:w-9 lg:h-9 rounded-full cursor-pointer text-logoc bg-white shadow-sm border border-[#f2f2f2] flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-50"
                        >
                          <AiOutlineHeart className="text-[14px] lg:text-[18px]" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setQuickViewProduct(item); }}
                          className="hidden lg:flex w-7 h-7 lg:w-9 lg:h-9 rounded-full cursor-pointer text-logoc bg-white border border-[#f2f2f2] shadow-sm items-center justify-center hover:bg-primary hover:text-white"
                        >
                          <AiOutlineEye className="text-[14px] lg:text-[18px]" />
                        </button>
                      </div>

                      <div className="w-full h-28 sm:h-40 lg:h-75.5 flex items-center justify-center pt-2 pb-2 relative mt-2 lg:mt-0">
                        <img
                          src={item.thumbnail?.url || item.image || "https://via.placeholder.com/150"}
                          alt={typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                          className="max-w-full max-h-full object-contain p-1 lg:p-0"
                        />
                      </div>

                      <div className="mt-2 lg:mt-4 flex flex-col grow justify-end pr-8 lg:pr-0">
                        <h3 className="text-[12px] sm:text-[13px] lg:text-[14px] text-[#4d4d4d] transition-colors duration-300 group-hover:text-[#2C742F] line-clamp-2 lg:line-clamp-1 leading-[130%] lg:leading-normal">
                          {typeof item.title === 'object' ? (item.title[i18n.language] || item.title.en) : item.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-1 lg:gap-2 mt-1">
                          <span className="font-medium text-[13px] sm:text-[14px] lg:text-[16px] text-logoc">
                            {formatPrice(item.price)}
                          </span>
                          {item.discountPercentage > 0 && (
                            <span className="line-through text-[11px] lg:text-[14px] font-normal text-grynine">
                              {formatPrice(item.price / (1 - item.discountPercentage / 100))}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-0.5 mt-1 lg:mt-1.5 origin-left scale-90 lg:scale-100">
                          {renderStars(item.rating || item.averageRating)}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        disabled={addToCartMutation.isPending}
                        className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#f2f2f2] text-logoc cursor-pointer flex items-center justify-center transition-all duration-300 group-hover:bg-green-500 group-hover:text-white z-10 disabled:opacity-60 shadow-sm lg:shadow-none"
                      >
                        <HiOutlineShoppingBag className="text-[14px] lg:text-[20px]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="flex flex-wrap justify-center items-center gap-1.5 lg:gap-2 mt-8 lg:mt-12 px-4 lg:px-0">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-brdrtwo flex items-center justify-center text-grynine hover:bg-[#f2f2f2] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-[10px] lg:text-sm" />
                </button>

                {[...Array(Math.min(3, Math.ceil(totalResults / ITEMS_PER_PAGE)))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full font-medium text-[13px] lg:text-base flex items-center justify-center cursor-pointer ${currentPage === pageNum ? 'bg-primary text-white' : 'text-logoc hover:bg-[#f2f2f2]'}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {Math.ceil(totalResults / ITEMS_PER_PAGE) > 3 && (
                  <>
                    <span className="text-grynine mx-1">...</span>
                    <button
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full text-logoc hover:bg-[#f2f2f2] text-[13px] lg:text-base font-medium flex items-center justify-center cursor-pointer"
                      onClick={() => setCurrentPage(Math.ceil(totalResults / ITEMS_PER_PAGE))}
                    >
                      {Math.ceil(totalResults / ITEMS_PER_PAGE)}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(totalResults / ITEMS_PER_PAGE)}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-brdrtwo flex items-center justify-center text-grynine hover:bg-[#f2f2f2] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="text-[10px] lg:text-sm" />
                </button>
              </div>
            )}
          </main>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          .custom-slider::-webkit-slider-thumb {
            pointer-events: auto;
            width: 16px;
            height: 16px;
            -webkit-appearance: none;
            background: white;
            border: 2px solid #2C742F;
            border-radius: 50%;
            cursor: pointer;
          }
          .custom-slider::-moz-range-thumb {
            pointer-events: auto;
            width: 16px;
            height: 16px;
            background: white;
            border: 2px solid #2C742F;
            border-radius: 50%;
            cursor: pointer;
          }
        `}} />
      </Container>

      <ProductQuickView
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </>
  );
};

export default Shop;
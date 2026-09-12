import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { FiSearch } from "react-icons/fi";
import { FaUser, FaComments, FaArrowRight, FaChevronLeft, FaChevronRight, FaPlay, FaChevronDown } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { MdClose } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import { getBlogSidebarData, getBlogs } from "../services/blogService";
import Container from "../components/layouts/Container";
import PageBanner from '../components/common/PageBanner';

const getLangText = (field, lang) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

const Blog = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const lang = i18n.language === 'bn' ? 'bn' : 'en';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { value: "Latest", label: t('blog.latest', 'Latest') },
    { value: "Oldest", label: t('blog.oldest', 'Oldest') }
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTag, sortBy]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileSidebarOpen]);

  const { data: sidebarRes, isLoading: sidebarLoading } = useQuery({
    queryKey: ["blogSidebar"],
    queryFn: async () => {
      const response = await getBlogSidebarData();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: blogsRes, isLoading: blogsLoading } = useQuery({
    queryKey: ["blogs", debouncedSearch, selectedCategory, selectedTag, sortBy, currentPage],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: 6,
        sort: sortBy,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedTag) params.tag = selectedTag;

      return await getBlogs(params);
    }
  });

  const categories = sidebarRes?.categories || [];
  const popularTags = sidebarRes?.tags || [];
  const galleryImages = sidebarRes?.galleryImages || [];
  const recentPosts = sidebarRes?.recentPosts || [];

  const blogs = blogsRes?.data || [];
  const totalResults = blogsRes?.totalResults || 0;
  const totalPages = blogsRes?.totalPages || 1;

  const getCardDate = (isoDate) => {
    const d = new Date(isoDate);
    return {
      day: d.getDate(),
      month: d.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short' }).toUpperCase()
    };
  };

  const getRecentDate = (isoDate) => {
    return new Date(isoDate).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderSidebar = () => (
    <div className="space-y-8">
      <div className="relative">
        <input
          type="text"
          placeholder={t('blog.search', 'Search...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-4 pr-10 border border-gray-200 rounded-md outline-none focus:border-[#00B207] text-sm"
        />
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-logoc">{t('blog.top_categories', 'Top Categories')}</h3>
        {sidebarLoading ? (
          <p className="text-sm text-gray-400">{t('blog.loading_categories', 'Loading categories...')}</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat, idx) => {
              const catId = cat._id || getLangText(cat.name, 'en');
              const catName = getLangText(cat.name, lang);
              
              return (
                <li 
                  key={idx}
                  onClick={() => { setSelectedCategory(selectedCategory === catId ? null : catId); setIsMobileSidebarOpen(false); }}
                  className={`flex justify-between items-center text-sm cursor-pointer transition-colors ${selectedCategory === catId ? 'text-[#00B207] font-semibold' : 'text-gray-600 hover:text-[#00B207]'}`}
                >
                  <span>{catName}</span>
                  <span className="text-gray-400">({cat.count})</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-logoc">{t('blog.popular_tag', 'Popular Tag')}</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, idx) => {
            const tagDisplay = getLangText(tag, lang);
            const tagValue = getLangText(tag, 'en');

            return (
              <button
                key={idx}
                onClick={() => { setSelectedTag(selectedTag === tagValue ? null : tagValue); setIsMobileSidebarOpen(false); }}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${selectedTag === tagValue ? 'bg-[#00B207] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#00B207] hover:text-white'}`}
              >
                {tagDisplay}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-logoc">{t('blog.our_gallery', 'Our Gallery')}</h3>
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="w-full h-16 rounded-md overflow-hidden border border-gray-100">
              <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition duration-300" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-logoc">{t('blog.recently_added', 'Recently Added')}</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => {
            const postTitle = getLangText(post.title, lang);

            return (
              <div 
                key={post._id} 
                onClick={() => { navigate(`/blog/${post.slug}`); setIsMobileSidebarOpen(false); }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img src={post.image} alt={postTitle} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-800 group-hover:text-[#00B207] transition line-clamp-2 leading-relaxed">
                    {postTitle}
                  </h4>
                  <span className="text-[11px] text-gray-400 mt-1 block">📅 {getRecentDate(post.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageBanner items={[t('blog.blog', 'Blog')]} />

      <Container className="py-6 lg:py-12 font-pop text-logoc px-4 md:px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {isMobileSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-[110] lg:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          <aside className={`fixed inset-y-0 left-0 z-[120] w-[280px] sm:w-[320px] bg-white h-[100dvh] overflow-y-auto px-5 py-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-[20px] font-semibold text-logoc">{t('blog.sidebar', 'Sidebar')}</h2>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>
            {renderSidebar()}
          </aside>

          <aside className="hidden lg:block w-full lg:w-[310px] shrink-0">
            {renderSidebar()}
          </aside>

          <div className="flex-1 w-full">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4 w-full">
              
              <button 
                onClick={() => { if(window.innerWidth < 1024) setIsMobileSidebarOpen(true) }}
                className="w-full sm:w-auto lg:hidden bg-primary hover:bg-[#246326] text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer shadow-sm"
              >
                <span>{t('blog.sidebar', 'Sidebar')}</span>
                <VscSettings size={18} />
              </button>

              <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 hidden sm:inline">{t('blog.sort_by', 'Sort by:')}</span>
                  
                  <div className="relative" ref={sortRef}>
                    <div
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="border border-gray-200 rounded-md px-3 lg:px-4 py-1.5 flex items-center justify-between gap-3 cursor-pointer bg-white min-w-[130px] hover:border-[#00B207] transition-colors select-none"
                    >
                      <span className="font-medium text-gray-800 text-[13px] lg:text-[14px] truncate">
                        {sortOptions.find(opt => opt.value === sortBy)?.label || sortBy}
                      </span>
                      <FaChevronDown className={`text-gray-500 text-[10px] lg:text-xs transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-[#00B207]' : ''}`} />
                    </div>

                    <div className={`absolute right-0 lg:left-0 top-full mt-1.5 w-[140px] lg:w-full bg-white border border-gray-100 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-50 transition-all duration-300 origin-top-right lg:origin-top ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                      {sortOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`px-4 py-2.5 text-[12px] lg:text-[14px] cursor-pointer transition-colors ${sortBy === option.value ? 'bg-[#e6f7e6] text-[#00B207] font-medium border-l-2 border-[#00B207]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'}`}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-800 block sm:hidden font-medium">
                  <strong className="font-semibold text-gray-900">{totalResults}</strong> {t('blog.results_found', 'Results Found')}
                </div>
              </div>

              <div className="hidden sm:block text-right text-sm text-gray-800">
                <strong className="font-semibold text-gray-900">{totalResults}</strong> {t('blog.results_found', 'Results Found')}
              </div>
            </div>

            {blogsLoading ? (
              <div className="py-20 text-center text-gray-500">
                <div className="w-10 h-10 border-4 border-[#00B207] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>{t('blog.loading_blogs', 'Loading blogs...')}</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-semibold mb-2 text-logoc">{t('blog.no_blogs', 'No Blog Posts Found')}</h3>
                <p className="text-sm">{t('blog.no_blogs_desc', 'Try searching with a different keyword or removing filters.')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {blogs.map((post) => {
                  const dateInfo = getCardDate(post.createdAt);
                  const postTitle = getLangText(post.title, lang);
                  const catName = getLangText(post.category?.name || post.category, lang) || "General";

                  return (
                    <div 
                      key={post._id}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-[#00B207] hover:shadow-md transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-gray-100">
                        <img 
                          src={post.image} 
                          alt={postTitle} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        
                        <div className="absolute top-4 left-4 bg-white rounded-md px-3 py-1.5 text-center shadow-md">
                          <span className="block font-bold text-sm text-logoc leading-tight">{dateInfo.day}</span>
                          <span className="block text-[10px] text-gray-500 uppercase font-semibold">{dateInfo.month}</span>
                        </div>

                        {post.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-12 h-12 bg-white text-[#00B207] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                              <FaPlay size={16} className="ml-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#00B207]">🏷️</span>
                            <span>{catName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaUser className="text-[#00B207]" />
                            <span>{t('blog.by', 'By')} {post.author?.name || "Admin"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaComments className="text-[#00B207]" />
                            <span>{post.commentCount || 0} {t('blog.comments', 'Comments')}</span>
                          </div>
                        </div>

                        <h3 className="text-base font-medium text-logoc group-hover:text-[#00B207] transition line-clamp-2 mb-4 leading-snug">
                          {postTitle}
                        </h3>

                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <button className="flex items-center gap-2 text-[#00B207] font-semibold text-sm hover:gap-3 transition-all cursor-pointer">
                            {t('blog.read_more', 'Read More')} <FaArrowRight size={12} />
                          </button>
                        </div>

                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  <FaChevronLeft size={12} />
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const num = idx + 1;
                  return (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-10 h-10 rounded-full font-medium flex items-center justify-center cursor-pointer transition ${currentPage === num ? 'bg-[#00B207] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {num}
                    </button>
                  )
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            )}

          </div>

        </div>
      </Container>
    </>
  );
};

export default Blog;
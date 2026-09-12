import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FiSearch, FiLink } from "react-icons/fi";
import { FaUser, FaComments, FaFacebookF, FaTwitter, FaPinterestP, FaArrowRight } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import { getBlogSidebarData, getSingleBlog, submitBlogComment } from "../services/blogService";
import Container from "../components/layouts/Container";
import PageBanner from '../components/common/PageBanner';

const getLangText = (field, lang) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [commentData, setCommentData] = useState({ fullName: "", email: "", message: "", saveInfo: false });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const lang = i18n.language === 'bn' ? 'bn' : 'en';

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileSidebarOpen]);

  const { data: sidebarRes } = useQuery({
    queryKey: ["blogSidebar"],
    queryFn: async () => {
      const response = await getBlogSidebarData();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: blogRes, isLoading } = useQuery({
    queryKey: ["singleBlog", slug],
    queryFn: async () => {
      const response = await getSingleBlog(slug);
      return response.data;
    },
    enabled: !!slug
  });

  const commentMutation = useMutation({
    mutationFn: async (newComment) => {
      return await submitBlogComment(newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["singleBlog", slug]);
      toast.success(t('blog.comment_success', 'Comment posted successfully!'));
      setCommentData({ fullName: "", email: "", message: "", saveInfo: false });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('blog.comment_failed', 'Failed to post comment.'));
    }
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentData.fullName || !commentData.email || !commentData.message) {
      toast.error(t('blog.fill_all', 'Please fill in all fields.'));
      return;
    }
    commentMutation.mutate({
      blogId: blog._id,
      fullName: commentData.fullName,
      email: commentData.email,
      message: commentData.message
    });
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      navigate(`/blog?search=${searchTerm}`);
      setIsMobileSidebarOpen(false);
    }
  };

  const categories = sidebarRes?.categories || [];
  const popularTags = sidebarRes?.tags || [];
  const galleryImages = sidebarRes?.galleryImages || [];
  const recentPosts = sidebarRes?.recentPosts || [];

  const blog = blogRes?.blog;
  const comments = blogRes?.comments || [];
  const commentCount = blogRes?.commentCount || 0;

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00B207] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-20 text-center text-gray-500 min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{t('blog.not_found', 'Blog Not Found')}</h2>
        <button onClick={() => navigate("/blog")} className="bg-[#00B207] text-white px-6 py-2 rounded-full cursor-pointer">
          {t('blog.back_to_blog', 'Back to Blog')}
        </button>
      </div>
    );
  }

  const displayTags = blog.tags?.[lang] || blog.tags?.en || blog.tags || [];
  const blogTitle = getLangText(blog.title, lang);
  const blogCategory = getLangText(blog.category?.name || blog.category, lang) || "General";
  const blogContent = getLangText(blog.content, lang);

  const renderSidebar = () => (
    <div className="space-y-8">
      <div className="relative">
        <input
          type="text"
          placeholder={t('blog.search', 'Search...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchSubmit}
          className="w-full h-12 pl-4 pr-10 border border-gray-200 rounded-md outline-none focus:border-[#00B207] text-sm"
        />
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-logoc">{t('blog.top_categories', 'Top Categories')}</h3>
        <ul className="space-y-3">
          {categories.map((cat, idx) => {
            const catId = cat._id || getLangText(cat.name, 'en');
            const catName = getLangText(cat.name, lang);
            return (
              <li
                key={idx}
                onClick={() => { navigate(`/blog?category=${encodeURIComponent(catId)}`); setIsMobileSidebarOpen(false); }}
                className="flex justify-between items-center text-sm cursor-pointer transition-colors text-gray-600 hover:text-[#00B207]"
              >
                <span>{catName}</span>
                <span className="text-gray-400">({cat.count})</span>
              </li>
            );
          })}
        </ul>
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
                onClick={() => { navigate(`/blog?tag=${encodeURIComponent(tagValue)}`); setIsMobileSidebarOpen(false); }}
                className="px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer bg-gray-100 text-gray-700 hover:bg-[#00B207] hover:text-white"
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
            <div key={idx} className="w-full h-16 rounded-md overflow-hidden border border-gray-100 cursor-pointer">
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
                  <span className="text-[11px] text-gray-400 mt-1 block items-center gap-1">
                    📅 {formatDate(post.createdAt)}
                  </span>
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
      <PageBanner items={[
        { label: t('blog.blog', 'Blog'), path: "/blog" },
        t('blog.single_blog', 'Single Blog'),
      ]} />

      <Container className="py-6 lg:py-12 font-pop text-logoc px-4 md:px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          <div className="flex-1 w-full overflow-hidden">

            <button
              onClick={() => { if (window.innerWidth < 1024) setIsMobileSidebarOpen(true) }}
              className="w-full lg:hidden bg-primary hover:bg-[#246326] text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer shadow-sm mb-6"
            >
              <span>{t('blog.sidebar', 'Sidebar')}</span>
              <VscSettings size={18} />
            </button>

            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-6 bg-gray-100">
              <img
                src={blog.image}
                alt={blogTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[#00B207]">🏷️</span>
                <span>{blogCategory}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaUser className="text-[#00B207]" />
                <span>{t('blog.by', 'By')} {blog.author?.name || "Admin"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaComments className="text-[#00B207]" />
                <span>{commentCount} {t('blog.comments', 'Comments')}</span>
              </div>
            </div>

            <h1 className="text-[28px] md:text-4xl font-semibold text-logoc leading-tight mb-6">
              {blogTitle}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
              <div className="flex items-center gap-3">
                <img src={blog.author?.avatar || "https://i.pravatar.cc/150?img=8"} alt="Author" className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{blog.author?.name || "System Admin"}</h4>
                  <p className="text-xs text-gray-500">{formatDate(blog.createdAt)} • {blog.readTime || "5 min read"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#00B207] transition bg-gray-50 cursor-pointer"><FaFacebookF size={14} /></button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#00B207] transition bg-gray-50 cursor-pointer"><FaTwitter size={14} /></button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#00B207] transition bg-gray-50 cursor-pointer"><FaPinterestP size={14} /></button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#00B207] transition bg-gray-50 cursor-pointer"><FiLink size={14} /></button>
              </div>
            </div>

            <div
              className="prose max-w-none text-gray-600 text-[15px] leading-relaxed space-y-6 mb-8"
              dangerouslySetInnerHTML={{ __html: blogContent }}
            />

            {displayTags.length > 0 && (
              <div className="flex items-center gap-3 mt-8 mb-12 border-t border-gray-100 pt-6">
                <span className="font-semibold text-sm text-gray-900">{t('blog.tags', 'Tags:')}</span>
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag, idx) => {
                    const tagString = getLangText(tag, lang);
                    return (
                      <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 text-xs rounded-full cursor-pointer hover:bg-[#00B207] hover:text-white transition">
                        {tagString}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative w-full h-48 sm:h-56 bg-[#0a1a0f] rounded-lg overflow-hidden flex items-center p-6 md:p-10 mb-12 shadow-lg">
              <div className="relative z-10 text-white max-w-sm">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-300 block mb-1">{t('blog.summer_sales', 'Summer Sales')}</span>
                <h3 className="text-3xl font-semibold mb-4">{t('blog.fresh_fruit', 'Fresh Fruit')}</h3>
                <button onClick={() => navigate('/shop')} className="bg-[#00B207] hover:bg-[#009206] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-2 cursor-pointer">
                  {t('blog.shop_now', 'Shop Now')} <FaArrowRight size={12} />
                </button>
              </div>

              <div className="absolute top-8 left-[45%] md:left-[35%] bg-black w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 border-gray-800 z-10 shadow-xl hidden sm:flex">
                <span className="text-xs text-gray-300">{t('blog.up_to', 'UP TO')}</span>
                <span className="text-[#FFCC00] font-bold text-xl leading-none">56%</span>
                <span className="text-xs text-gray-300">{t('blog.off', 'OFF')}</span>
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-3/5">
                <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop" alt="Promo" className="w-full h-full object-cover opacity-60 mask-image-gradient" />
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-xl font-semibold text-logoc mb-6">{t('blog.leave_comment', 'Leave a Comment')}</h2>
              <form onSubmit={handleCommentSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1.5">{t('blog.full_name', 'Full Name')}</label>
                    <input
                      type="text"
                      placeholder="Zakir Hossen"
                      value={commentData.fullName}
                      onChange={(e) => setCommentData({ ...commentData, fullName: e.target.value })}
                      className="border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-[#00B207] text-sm text-gray-800 transition"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1.5">{t('blog.email', 'Email')}</label>
                    <input
                      type="email"
                      placeholder="zakirsoft.20@gmail.com"
                      value={commentData.email}
                      onChange={(e) => setCommentData({ ...commentData, email: e.target.value })}
                      className="border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-[#00B207] text-sm text-gray-800 transition"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1.5">{t('blog.message', 'Message')}</label>
                  <textarea
                    rows="5"
                    placeholder={t('blog.write_comment', 'Write your comment here...')}
                    value={commentData.message}
                    onChange={(e) => setCommentData({ ...commentData, message: e.target.value })}
                    className="border border-gray-200 rounded-md px-4 py-3 outline-none focus:border-[#00B207] text-sm text-gray-800 resize-none transition"
                  ></textarea>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    checked={commentData.saveInfo}
                    onChange={(e) => setCommentData({ ...commentData, saveInfo: e.target.checked })}
                    className="w-4 h-4 text-[#00B207] border-gray-300 rounded focus:ring-[#00B207] cursor-pointer"
                  />
                  <label htmlFor="saveInfo" className="text-sm text-gray-500 cursor-pointer">
                    {t('blog.save_info', 'Save my name, email, and website in this browser for the next time I comment.')}
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={commentMutation.isPending}
                  className="bg-[#00B207] hover:bg-[#009206] text-white px-8 py-3 rounded-full font-semibold transition mt-2 cursor-pointer disabled:opacity-60"
                >
                  {commentMutation.isPending ? t('blog.posting', 'Posting...') : t('blog.post_comments', 'Post Comments')}
                </button>
              </form>
            </div>

            {comments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-logoc mb-6">{t('blog.comments', 'Comments')}</h2>
                <div className="space-y-6 mb-8">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center text-gray-500 shrink-0 uppercase">
                        {comment.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900">{comment.fullName}</h4>
                          <span className="text-xs text-gray-400">• {formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-[110] lg:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar Drawer */}
          <aside className={`fixed inset-y-0 left-0 z-[120] w-[280px] sm:w-[320px] bg-white h-[100dvh] overflow-y-auto px-5 py-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-[20px] font-semibold text-logoc">{t('blog.sidebar', 'Sidebar')}</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>
            {renderSidebar()}
          </aside>

          {/* Desktop Sidebar */}
          <aside className="w-full lg:w-[310px] shrink-0 hidden lg:block">
            {renderSidebar()}
          </aside>

        </div>
      </Container>

      <style dangerouslySetInnerHTML={{
        __html: `
        .mask-image-gradient {
          -webkit-mask-image: linear-gradient(to right, transparent, black);
          mask-image: linear-gradient(to right, transparent, black);
        }
      `}} />
    </>
  );
};

export default SingleBlog;
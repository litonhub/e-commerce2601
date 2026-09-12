import React from "react";
import { FaArrowRight, FaRegCommentAlt, FaRegUser } from "react-icons/fa";
import { FiTag } from "react-icons/fi";
import Container from "./layouts/Container";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getBlogs } from "../services/blogService";

const getLangText = (field, lang) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
};

const LatestNews = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "bn" ? "bn" : "en";

  // Fetching the 3 latest blog posts
  const { data: blogsRes, isLoading } = useQuery({
    queryKey: ["latestNews"],
    queryFn: async () => {
      return await getBlogs({ limit: 3, sort: "Latest" });
    },
    staleTime: 5 * 60 * 1000,
  });

  const news = blogsRes?.data || [];

  const getCardDate = (isoDate) => {
    const d = new Date(isoDate);
    return {
      day: d.getDate(),
      month: d.toLocaleString(lang === "bn" ? "bn-BD" : "en-US", { month: "short" }).toUpperCase(),
    };
  };

  if (isLoading) {
    return (
      <section className="py-5 lg:py-15">
        <Container>
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Container>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-5 lg:py-15">
      <Container>
        <h2 className="text-center font-pop text-[24px] sm:text-[28px] lg:text-hsize font-semibold leading-[120%] text-[#1A1A1A] mb-5 lg:mb-8">
          {t("blog.latest_news", "Latest News")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 px-4 md:px-6 lg:px-0">
          {news.map((item) => {
            const dateInfo = getCardDate(item.createdAt);
            const postTitle = getLangText(item.title, lang);
            const catName = getLangText(item.category?.name || item.category, lang) || "General";

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/blog/${item.slug}`)}
                className="group rounded-lg lg:rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/400x300"}
                    alt={postTitle}
                    className="w-full h-56 sm:h-64 lg:h-81 object-cover group-hover:scale-110 duration-500"
                  />

                  {/* Date */}
                  <div className="absolute left-3 bottom-3 lg:left-6 lg:bottom-6 w-12 h-12 lg:w-14.5 lg:h-14.5 rounded bg-white flex flex-col justify-center items-center shadow">
                    <h3 className="font-pop text-[16px] lg:text-[20px] font-medium leading-[150%] text-[#1A1A1A]">
                      {dateInfo.day}
                    </h3>

                    <span className="font-pop text-[10px] lg:text-[12px] font-medium leading-[100%] text-gryd uppercase tracking-[3%]">
                      {dateInfo.month}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-6 flex flex-col flex-1">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-[#4d4d4d] text-[12px] lg:defaultfs mb-3">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <FiTag className="text-[#B3B3B3] text-[16px] lg:text-[20px]" />
                      <span className="truncate max-w-20 sm:max-w-none">{catName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <FaRegUser className="text-[#B3B3B3] text-[14px] lg:text-[18px]" />
                      <span className="truncate max-w-20 sm:max-w-none">
                        {t("blog.by", "By")} {item.author?.name || "Admin"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <FaRegCommentAlt className="text-[#B3B3B3] text-[14px] lg:text-[18px]" />
                      {item.commentCount || 0} {t("blog.comments", "Comments")}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-pop text-[15px] sm:text-[16px] lg:text-[18px] font-medium leading-[140%] lg:leading-[150%] text-[#1A1A1A] group-hover:text-[#2C742F] duration-300 line-clamp-2">
                    {postTitle}
                  </h3>

                  {/* Button */}
                  <button className="mt-auto pt-4 lg:pt-6 flex items-center gap-2 font-semibold text-[13px] lg:text-[16px] text-primary hover:gap-3 duration-300">
                    {t("blog.read_more", "Read More")}
                    <FaArrowRight className="text-[12px] lg:text-[16px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default LatestNews;
import { useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Container from "./layouts/Container";
import "../css/ClientTestimonial.css";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "../services/reviewService";

const ClientTestimonial = () => {
  const { t, i18n } = useTranslation();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const lang = i18n.language === "bn" ? "bn" : "en";

  // Fetch Real Testimonials (4 & 5 star reviews)
  const { data: testimonialsRes, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response = await getTestimonials();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const testimonials = testimonialsRes?.data || [];

  if (isLoading) {
    return (
      <section className="py-8 lg:py-15 bg-[#EDF2EE]">
        <Container>
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-[#00B207] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Container>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; 
  }

  return (
    <section className="py-8 lg:py-15 bg-[#EDF2EE]">
      <Container>
        <div className="flex justify-between items-end lg:items-center mb-6 lg:mb-14 px-4 md:px-6 lg:px-0">
          <div>
            <h2 className="font-pop font-semibold text-[18px] sm:text-[24px] lg:text-hsize leading-[120%] text-[#1A1A1A]">
              {t('testimonials.title', 'Client Testimonial')}
            </h2>
            <div className="w-10 h-0.5 lg:w-18 lg:h-1 bg-[#00B207] rounded-full mt-2 lg:mt-4"></div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <button
              ref={prevRef}
              className="w-8 h-8 lg:w-11 lg:h-11 rounded-full border border-[#E6E6E6] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#00B207] hover:text-white hover:border-[#00B207] duration-300 cursor-pointer shadow-sm lg:shadow-none"
            >
              <FaArrowLeft className="text-[12px] lg:text-base" />
            </button>

            <button
              ref={nextRef}
              className="w-8 h-8 lg:w-11 lg:h-11 rounded-full border border-[#E6E6E6] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#00B207] hover:text-white hover:border-[#00B207] duration-300 cursor-pointer shadow-sm lg:shadow-none"
            >
              <FaArrowRight className="text-[12px] lg:text-base" />
            </button>
          </div>
        </div>

        <div className="px-4 md:px-6 lg:px-0">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className="pb-10 lg:pb-0"
          >
            {testimonials.map((item) => {
              const productName = typeof item.product?.title === 'object' 
                ? (item.product.title[lang] || item.product.title.en) 
                : (item.product?.title || "Product");

              const userName = item.user?.name || "Customer";
              const userImage = item.user?.avatar?.url || item.user?.avatar || `https://ui-avatars.com/api/?name=${userName}&background=E6F7E6&color=00B207&bold=true`;

              return (
                <SwiperSlide key={item._id} className="pt-2 pb-2 !h-auto flex">
                  {/* [FIXED]: h-full ক্লাসটি যুক্ত করা হয়েছে যাতে কার্ডটি স্লাইডের পুরো জায়গা নিয়ে নেয় */}
                  <div className="bg-white w-full h-full rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] lg:shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-5 lg:p-6 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] lg:hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col justify-between">
                    
                    <div>
                      <FaQuoteLeft className="text-[#84D187] text-[24px] lg:text-[34px]" />
                      <p className="mt-3 lg:mt-4 text-[13px] lg:defaultfs text-gryd leading-[150%] lg:leading-[1.6] line-clamp-4">
                        {item.comment}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 lg:mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2.5 lg:gap-3">
                        <img
                          src={userImage}
                          alt={userName}
                          className="w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover border border-gray-100 shrink-0"
                        />
                        <div>
                          <h4 className="font-pop text-[14px] lg:text-[16px] font-medium text-[#1A1A1A] leading-[130%] lg:leading-[150%]">
                            {userName}
                          </h4>
                          <p className="text-[11px] lg:text-[13px] text-grynine leading-[130%] lg:leading-normal max-w-[120px] truncate">
                            {productName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 lg:gap-1 shrink-0">
                        {[...Array(item.rating)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-[#FF8A00] text-[12px] lg:text-base"
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default ClientTestimonial;
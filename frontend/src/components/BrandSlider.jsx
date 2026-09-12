import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "../css/BrandSlider.css";
import Container from "./layouts/Container";

import Steps from "../assets/svg/steps.svg?react";
import Mango from "../assets/svg/mango.svg?react";
import Food from "../assets/svg/fooduk.svg?react";
import Bookoff from "../assets/svg/bookoff.svg?react";
import GSeries from "../assets/svg/gseries.svg?react";
import GoodFood from "../assets/svg/foods.svg?react";

const brands = [
  Steps,
  Mango,
  GoodFood,
  Food,
  Bookoff,
  GSeries,
];

const BrandSlider = () => {
  return (
    <section className="py-6 lg:py-15">
      <Container>
        <div className="px-4 md:px-6 lg:px-0">
          <Swiper
            className="marquee-swiper"
            modules={[Autoplay]}
            loop={true}
            speed={4000}
            allowTouchMove={false}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 3, // Increased from 2 to 3 for mobile to look more like a continuous marquee
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 40,
              },
            }}
          >
            {[...brands, ...brands, ...brands].map((Logo, index) => (
              <SwiperSlide key={index}>
                <div className="brand-item group flex h-10 lg:h-15 items-center justify-center">
                  <Logo className="text-[#CCCCCC] transform scale-75 lg:scale-100 transition-all duration-300 group-hover:text-primary group-hover:scale-[0.85] lg:group-hover:scale-105" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default BrandSlider;
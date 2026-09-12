import { useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa"; 
import bgImage from "../assets/images/videobanner.png";
import Container from "./layouts/Container";
import { useTranslation } from "react-i18next"; 

const VideoBanner = ({
  title = "We're the Best Organic Farm in the World",
  videoId = "cP5dihjUUNc",
}) => {
  const { t } = useTranslation(); 
  const [open, setOpen] = useState(false);

  return (
    <>
      <Container className="py-5 lg:py-15">
        <section
          className="relative h-62.5 sm:h-75 lg:h-100 overflow-hidden bg-cover bg-center rounded-xl lg:rounded-none shadow-sm lg:shadow-none"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[rgba(0,44,2,0.7)]"></div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-4 lg:px-5">
            <h2 className="font-pop text-white text-[20px] sm:text-[28px] lg:text-[36px] font-semibold text-center max-w-[280px] sm:max-w-[400px] lg:max-w-104 leading-[140%] lg:leading-[120%]">
              {t('video_banner.title', title)}
            </h2>

            <button
              onClick={() => setOpen(true)}
              className="mt-6 lg:mt-10 w-14 h-14 lg:w-18 lg:h-18 rounded-full border-2 border-white flex justify-center items-center text-white hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer shadow-lg lg:shadow-none"
            >
              <FaPlay className="ml-1 text-[16px] lg:text-xl" />
            </button>
          </div>
        </section>
      </Container>

      {/* Video Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4 lg:px-5 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Optimized for both Mobile (icon with bg) and Desktop (simple text) */}
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-12 right-0 lg:-top-12 lg:right-0 w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center bg-gray-800 lg:bg-transparent rounded-full text-white text-xl lg:text-4xl hover:text-red-500 transition-colors z-[130] cursor-pointer"
            >
              <FaTimes className="lg:hidden text-sm" />
              <span className="hidden lg:block">×</span>
            </button>

            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VideoBanner;
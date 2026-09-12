import { FaInstagram } from "react-icons/fa6";
import Img1 from "../assets/images/instaone.png";
import Img2 from "../assets/images/instatwo.png";
import Img3 from "../assets/images/instathree.png";
import Img4 from "../assets/images/instafour.png";
import Img5 from "../assets/images/instafive.png";
import Img6 from "../assets/images/instasix.png";
import Container from "./layouts/Container";
import { useTranslation } from "react-i18next"; 

const instagramImages = [
  Img1, Img2, Img3, Img4, Img5, Img6,
];

const InstagramGallery = () => {
  const { t } = useTranslation(); 

  return (
    <section className="pb-8 lg:pb-15">
      <Container>

        <h2 className="mb-4 lg:mb-8 text-center text-[24px] lg:text-hsize font-pop font-semibold leading-[120%] text-logoc px-4">
          {t('instagram.title', 'Follow us on Instagram')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-6 px-4 md:px-6 lg:px-0">
          {instagramImages.map((image, index) => (
            <a
              key={index}
              href="https://www.instagram.com/arfin.sipon"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-[8px] lg:rounded-[10px]"
            >

              <div className="aspect-square overflow-hidden rounded-[8px] lg:rounded-[10px]">
                <img
                  src={image}
                  alt={`Instagram ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              {/* Overlay: Permanent subtle dark on mobile, Hover full-green on desktop */}
              <div className="absolute inset-0 flex items-center justify-center rounded-[8px] lg:rounded-[10px] bg-black/15 lg:bg-[#2D6A4F]/0 transition-all duration-500 lg:group-hover:bg-[#2D6A4F]/70">
                
                <FaInstagram
                  className="text-white text-[24px] lg:text-[34px] opacity-90 lg:opacity-0 transition-all duration-500 lg:group-hover:opacity-100 lg:translate-y-3 lg:group-hover:translate-y-0 lg:scale-75 lg:group-hover:scale-100"
                />

              </div>
            </a>
          ))}
        </div>

      </Container>
    </section>
  );
};

export default InstagramGallery;
import CountUpCard from "./common/CountUpCard";
import BgImage from "../assets/images/counterbg.png";
import LeftLeaf from "../assets/images/counterbgol.png";
import RightIcon from "../assets/images/counterbgol.png";
import Container from "./layouts/Container";
import { useTranslation } from "react-i18next"; 

const StatsSection = () => {
  const { t } = useTranslation(); 

  const stats = [
    {
      id: 1,
      end: 37,
      suffix: "+",
      title: t('stats.years', "Years of Hard Work"),
    },
    {
      id: 2,
      end: 500,
      suffix: "k+",
      title: t('stats.customers', "Happy Customer"),
    },
    {
      id: 3,
      end: 28,
      suffix: "",
      title: t('stats.team', "Qualified Team Member"),
    },
    {
      id: 4,
      end: 750,
      suffix: "k+",
      title: t('stats.orders', "Monthly Orders"),
    },
  ];

  return (
    <section className="relative py-10 lg:py-20 bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}>
      
      {/* Overlay & Decorative Images moved outside Container for proper full-width coverage */}
      <div className="absolute inset-0 bg-[rgba(0,16,9,0.5)]"></div>

      <img src={LeftLeaf} alt="Left Leaf" className="absolute left-0 top-2 lg:top-5 w-20 lg:w-40 opacity-60 lg:opacity-100" />
      <img src={RightIcon} alt="Right Icon" className="absolute right-2 lg:right-5 bottom-10 lg:bottom-20 w-10 lg:w-16 opacity-30 lg:opacity-40" />

      {/* Content wrapper with relative z-index to stay above overlay */}
      <div className="relative z-10">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4 md:px-6 lg:px-0">
            {stats.map((item) => (
              <CountUpCard
                key={item.id}
                end={item.end}
                suffix={item.suffix}
                title={item.title}
                duration={3}
                cardClass="bg-[rgba(255,255,255,0.07)] rounded-[8px] lg:rounded-lg py-6 sm:py-8 lg:py-10 px-2 lg:px-0 flex flex-col justify-center items-center text-center backdrop-blur-sm lg:backdrop-blur-none"
                numberClass="text-primary text-[32px] sm:text-[40px] lg:text-[56px] font-pop font-medium lg:font-light leading-[120%]"
                titleClass="text-white text-[11px] sm:text-[14px] lg:text-[18px] font-pop font-normal leading-[130%] lg:leading-[150%] mt-1 lg:mt-0"
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default StatsSection;
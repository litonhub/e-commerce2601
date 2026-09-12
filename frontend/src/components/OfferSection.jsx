import Countdown from "react-countdown";
import { FaArrowRight } from "react-icons/fa";
import Container from "./layouts/Container";
import Offerbo from "../assets/images/offerbannerone.png";
import Offerbt from "../assets/images/offerbtwo.png";
import Offerbth from "../assets/images/offerebthree.png";
import { useTranslation } from "react-i18next"; 
// --- [FIXED]: Imported useNavigate for routing ---
import { useNavigate } from 'react-router';

const OfferSection = () => {
    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const endDate = new Date("2026-12-31T23:59:59");

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <h3 className="text-lg lg:text-xl font-bold text-white">{t('offers.ended', 'Offer Ended')}</h3>;
        }

        return (
            <div className="mt-2">
                {/* Number Row */}
                <div className="flex justify-center items-center gap-2 lg:gap-3">
                    <h2 className="font-pop font-normal text-[18px] sm:text-[20px] lg:text-[24px] leading-[150%] text-white">
                        {String(days).padStart(2, "0")}
                    </h2>

                    <span className="font-pop font-normal text-[18px] sm:text-[20px] lg:text-[24px] leading-none text-[rgba(255,255,255,0.6)]">
                        :
                    </span>

                    <h2 className="font-pop font-normal text-[18px] sm:text-[20px] lg:text-[24px] leading-[150%] text-white">
                        {String(hours).padStart(2, "0")}
                    </h2>

                    <span className="font-pop font-normal text-[18px] sm:text-[20px] lg:text-[24px] leading-none text-[rgba(255,255,255,0.6)]">
                        :
                    </span>

                    <h2 className="font-pop font-normal text-[18px] sm:text-[20px] lg:text-[24px] leading-[150%] text-white">
                        {String(minutes).padStart(2, "0")}
                    </h2>

                    <span className="font-pop font-normal text-[18px] sm:text-[20px] lg:text-[24px] leading-none text-[rgba(255,255,255,0.6)]">
                        :
                    </span>

                    <h2 className="font-pop font-normal text-[18px] sm:text-[20px] lg:text-[24px] leading-[150%] text-white">
                        {String(seconds).padStart(2, "0")}
                    </h2>
                </div>

                {/* Label Row */}
                <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 mt-1 lg:mt-2">
                    <p className="w-6 sm:w-7.5 text-center font-pop font-normal text-[9px] lg:text-[12px] leading-[100%] tracking-[3%] text-[rgba(255,255,255,0.8)] uppercase">
                        {t('offers.days', 'DAYS')}
                    </p>

                    <p className="w-6 sm:w-7.5 text-center font-pop font-normal text-[9px] lg:text-[12px] leading-[100%] tracking-[3%] text-[rgba(255,255,255,0.8)] uppercase">
                        {t('offers.hours', 'HOURS')}
                    </p>

                    <p className="w-6 sm:w-7.5 text-center font-pop font-normal text-[9px] lg:text-[12px] leading-[100%] tracking-[3%] text-[rgba(255,255,255,0.8)] uppercase">
                        {t('offers.mins', 'MINS')}
                    </p>

                    <p className="w-6 sm:w-7.5 text-center font-pop font-normal text-[9px] lg:text-[12px] leading-[100%] tracking-[3%] text-[rgba(255,255,255,0.8)] uppercase">
                        {t('offers.secs', 'SECS')}
                    </p>
                </div>
            </div>
        );
    };

    // --- [FIXED]: Added 'link' property to each offer for routing ---
    const offers = [
        {
            id: 1,
            image: Offerbo,
            top: t('offers.offer1_top', 'BEST DEALS'),
            title: t('offers.offer1_title', 'Sale of the Month'),
            subtitle: "",
            timer: true,
            text: "text-white",
            overlay: "bg-black/10",
            link: "/shop?isDiscounted=true"
        },
        {
            id: 2,
            image: Offerbt,
            top: t('offers.offer2_top', '85% FAT FREE'),
            title: t('offers.offer2_title', 'Low-Fat Meat'),
            subtitle: (
                <>
                    {t('offers.started_at', 'Started at')}{" "}
                    <span className="text-[16px] lg:text-[20px] font-pop font-semibold leading-[150%] text-[#FF8A00]">$79.99</span>
                </>
            ),
            timer: false,
            text: "text-white",
            overlay: "bg-black/30",
            link: `/shop?category=${encodeURIComponent('chicken & meat')}`
        },
        {
            id: 3,
            image: Offerbth,
            top: t('offers.offer3_top', 'SUMMER SALE'),
            title: t('offers.offer3_title', '100% Fresh Fruit'),
            subtitle: (
                <>
                    {t('offers.up_to', 'Up to')}{" "}
                    <span className="bg-logoc text-[#FCC900] font-pop text-[14px] lg:text-[18px] font-semibold leading-[150%] px-2 lg:px-3 py-1 lg:py-1.5 rounded-[3px] lg:rounded-[5px]">
                        {t('offers.offer3_discount', '64% OFF')}
                    </span>
                </>
            ),
            timer: false,
            text: "text-black",
            overlay: "bg-black/0",
            link: `/shop?category=${encodeURIComponent('fresh fruit')}&isDiscounted=true`
        },
    ];

    return (
        <section className="py-8 lg:py-15">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 md:px-6 lg:px-0">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="relative h-[260px] sm:h-[300px] lg:h-134 rounded-[8px] lg:rounded-lg overflow-hidden bg-cover bg-center shadow-sm"
                            style={{
                                backgroundImage: `url(${offer.image})`,
                            }}
                        >
                            <div className={`absolute inset-0 ${offer.overlay}`}></div>

                            <div
                                className={`absolute inset-0 z-10 flex flex-col items-center pt-6 lg:pt-8.75 px-4 lg:px-6 ${offer.text}`}
                            >
                                <p className="text-[11px] lg:text-sm font-pop font-medium leading-[100%] uppercase tracking-[3%]">
                                    {offer.top}
                                </p>

                                <h2 className="text-[26px] sm:text-[32px] lg:text-[40px] font-semibold font-pop leading-[120%] text-center mt-2 lg:mt-4">
                                    {offer.title}
                                </h2>

                                {offer.subtitle && (
                                    <p className="text-[14px] lg:text-[18px] font-normal font-pop leading-[150%] mt-2 lg:mt-3.25 text-center">
                                        {offer.subtitle}
                                    </p>
                                )}

                                {offer.timer && (
                                    <div className="scale-90 lg:scale-100 origin-top mt-1 lg:mt-0">
                                        <Countdown date={endDate} renderer={renderer} />
                                    </div>
                                )}

                                {/* --- [FIXED]: Added onClick with the offer's unique link --- */}
                                <button onClick={() => navigate(offer.link)} className="mt-4 lg:mt-7.25 bg-white text-primary font-semibold text-[12px] lg:text-[14px] leading-[120%] px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-full lg:rounded-[43px] flex items-center gap-2 lg:gap-3 hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer shadow-sm">
                                    {t('offers.shop_now', 'Shop Now')}
                                    <FaArrowRight className="text-[10px] lg:text-[14px]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default OfferSection;
import React from 'react'
import Container from './layouts/Container'
import BannerBig from '../assets/images/BannerBig.webp'
import BannerRSone from '../assets/images/BannerRSone.webp'
import BannerRStwo from '../assets/images/BannerRStwo.webp'
import BannerBigTwo from '../assets/images/BannerBigTwo.webp'
import BannerBigThree from '../assets/images/BannerBigThree.webp'
import { FaArrowRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import 'swiper/css/pagination';
import "swiper/css/effect-fade";
import Beans from '../assets/svg/Beans'
import Radish from '../assets/svg/Radish'
import Onion from '../assets/svg/Onion'
import Chili from '../assets/svg/Chili'
import Mashroom from '../assets/svg/Mashroom'
import BannerThreeBg from '../assets/svg/BannerThreeBg'
import BannerThreeBgg from '../assets/svg/BannerThreeBgg'
import BannerThreeBggg from '../assets/svg/BannerThreeBggg'
import BannerBigBgggg from '../assets/svg/BannerBigBgggg'
import { useTranslation } from "react-i18next";
// --- [FIXED]: Imported useNavigate for routing ---
import { useNavigate } from 'react-router';

const Banner = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Container>
            {/* Desktop: flex-row, justify-between, py-6. Mobile: flex-col, py-4 */}
            <div className="flex flex-col lg:flex-row justify-between gap-3 sm:gap-4 lg:gap-0 py-4 lg:py-6">

                {/* --- MAIN BANNER --- */}
                <Swiper
                    modules={[EffectFade, Autoplay, Pagination]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    speed={1200}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={true}
                    className="w-full lg:w-218 h-[180px] sm:h-[300px] lg:h-150 ml-0! overflow-hidden rounded-[8px] lg:rounded-[10px] z-0 lg:z-auto"
                >
                    <SwiperSlide>
                        <div className='w-full lg:w-218 h-full relative'>
                            <img src={BannerBig} alt="Banner img" className='w-full h-full object-cover lg:object-fill rounded-[8px] lg:rounded-[10px]' />
                            <div className="bg-[linear-gradient(77deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_100%)] w-full h-full absolute top-0 left-0 rounded-[8px] lg:rounded-[10px]">
                                <div className="max-w-[68%] sm:max-w-[60%] lg:max-w-146 absolute top-1/2 -translate-y-1/2 left-5 sm:left-10 lg:left-15">
                                    <h1 className='font-pop font-semibold text-[20px] sm:text-3xl lg:text-5xl text-white leading-[120%]'>{t('banner.slider1_title', 'Fresh & Healthy Organic Food')}</h1>
                                    <div className='py-2 sm:py-5 lg:py-7 pl-2.5 sm:pl-3.5 lg:pl-3.5 relative after:w-0.5 after:h-8 sm:after:h-14 lg:after:h-16.25 after:bg-[#84D187] after:content-[""] after:absolute after:top-1/2 after:-translate-y-1/2 lg:after:translate-y-0 lg:after:top-8 after:left-0'>
                                        <div className="flex flex-wrap gap-x-1 sm:gap-x-2 lg:gap-x-2 items-center">
                                            <h3 className='font-pop font-medium text-[12px] sm:text-[18px] lg:text-[20px] text-white leading-[150%]'>{t('banner.sale_up_to', 'Sale up to ')}</h3>
                                            <span className='bg-[#FF8A00] py-0.5 lg:py-1 px-1.5 sm:px-2 lg:px-3 font-pop font-semibold text-[12px] sm:text-[18px] lg:text-[20px] text-white leading-[150%] rounded-[4px] lg:rounded-[5px]'>{t('banner.off_30', '30% OFF')}</span>
                                        </div>
                                        <p className='text-[10px] sm:text-sm lg:defaultfs text-white/80 pt-1 lg:pt-2'>{t('banner.free_shipping', 'Free shipping on all your order.')}</p>
                                    </div>
                                    {/* --- [FIXED]: Added onClick navigation to discounted items --- */}
                                    <div onClick={() => navigate('/shop?isDiscounted=true')} className="inline-flex items-center gap-x-2 lg:gap-x-4 bg-white py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-10 rounded-full lg:rounded-[53px] cursor-pointer mt-2 lg:mt-0 hover:opacity-90 transition-opacity">
                                        <button className='font-pop font-semibold text-[11px] sm:text-sm lg:text-base text-primary leading-[120%] cursor-pointer'>{t('banner.shop_now', 'Shop now')}</button>
                                        <FaArrowRight className='text-[10px] sm:text-sm lg:text-base text-primary' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='bg-[#DAE5DA] w-full lg:w-218 h-full lg:h-150 rounded-[8px] lg:rounded-[10px] relative overflow-hidden lg:overflow-visible'>
                            <div className="absolute inset-0 lg:inset-auto lg:top-1/2 lg:-translate-y-1/2 lg:left-15 flex items-center justify-between lg:justify-start px-5 sm:px-10 lg:px-0 z-10 lg:z-auto">
                                <div className="max-w-[55%] sm:max-w-[50%] lg:max-w-none">
                                    <h1 className='font-pop font-semibold text-[16px] sm:text-2xl lg:text-hsize text-logoc leading-[120%]'>{t('banner.slider2_title', 'Fresh & Healthy Organic Vegetable')}</h1>
                                    <div className='py-2 sm:py-5 lg:py-7 pl-2.5 sm:pl-3.5 lg:pl-3.5 relative after:w-0.5 after:h-8 sm:after:h-14 lg:after:h-16.25 after:bg-[#84D187] after:content-[""] after:absolute after:top-1/2 after:-translate-y-1/2 lg:after:translate-y-0 lg:after:top-8 after:left-0'>
                                        <div className="flex flex-wrap gap-x-1 sm:gap-x-2 lg:gap-x-2 items-center">
                                            <h3 className='font-pop font-medium text-[11px] sm:text-[16px] lg:text-[20px] text-logoc leading-[150%]'>{t('banner.sale_up_to', 'Sale up to ')}</h3>
                                            <span className='bg-[#FF8A00] py-0.5 lg:py-1 px-1.5 sm:px-2 lg:px-3 font-pop font-semibold text-[11px] sm:text-[16px] lg:text-[20px] text-white leading-[150%] rounded-[4px] lg:rounded-[5px]'>{t('banner.off_50', '50% OFF')}</span>
                                        </div>
                                        <p className='text-[9px] sm:text-sm lg:defaultfs text-gry pt-1 lg:pt-2'>{t('banner.free_shipping', 'Free shipping on all your order.')}</p>
                                    </div>
                                    {/* --- [FIXED]: Added onClick navigation to specific category & discounted items --- */}
                                    <div onClick={() => navigate('/shop?category=fresh vegetables&isDiscounted=true')} className="inline-flex items-center gap-x-2 lg:gap-x-4 bg-primary py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-10 rounded-full lg:rounded-[53px] cursor-pointer mt-2 lg:mt-0 hover:bg-[#009206] transition-colors">
                                        <button className='font-pop font-semibold text-[11px] sm:text-sm lg:text-base text-white leading-[120%] cursor-pointer'>{t('banner.shop_now', 'Shop now')}</button>
                                        <FaArrowRight className='text-[10px] sm:text-sm lg:text-base text-white' />
                                    </div>
                                </div>
                                <img src={BannerBigTwo} alt="Banner img" className='w-[45%] lg:w-[60%] object-contain lg:object-fill' />
                            </div>

                            {/* Hidden on Mobile for clean UI, preserved on lg */}
                            <div className='hidden lg:block absolute bottom-0 left-1'>
                                <Beans className='opacity-50' />
                            </div>
                            <div className='hidden lg:block absolute -bottom-4 right-0'>
                                <Radish className='opacity-50' />
                            </div>
                            <div className='hidden lg:block absolute top-22 right-90'>
                                <Onion className='opacity-50' />
                            </div>
                            <div className='hidden lg:block absolute top-0 left-2'>
                                <Chili className='opacity-50' />
                            </div>
                            <div className='hidden lg:block absolute top-0 right-0'>
                                <Mashroom className='opacity-50' />
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='bg-[#FFF4E6] w-full lg:w-218 h-full lg:h-150 rounded-[8px] lg:rounded-[10px] relative overflow-hidden lg:overflow-visible'>
                            <div className="flex flex-col justify-center text-center h-full lg:h-auto z-10 lg:z-auto relative lg:static">
                                <div className='pt-4 lg:pt-10 lg:max-w-120 mx-auto'>
                                    <h1 className='font-pop font-semibold text-[20px] sm:text-3xl lg:text-[40px] text-primary leading-[120%]'>{t('banner.slider3_title', 'Fresh & Healthy Organic Fruits')}</h1>
                                    <p className='text-[10px] sm:text-sm lg:defaultfs text-gry pt-1 lg:pt-2 pb-0.5 lg:pb-5'>{t('banner.free_shipping', 'Free shipping on all your order.')}</p>
                                </div>
                                <div className='relative w-full flex justify-center lg:block'>
                                    <img src={BannerBigThree} alt="Banner img" className='w-[35%] sm:w-[40%] lg:w-[50%] mx-auto lg:object-contain' />
                                    <div className='bg-[#FF8A00] w-10 h-10 lg:w-15 lg:h-15 rounded-full absolute top-0 sm:top-2 lg:top-5 right-[15%] lg:right-75 flex items-center justify-center shadow-lg lg:shadow-none'>
                                        <div className="flex flex-col">
                                            <span className='font-pop font-semibold text-[12px] sm:text-[16px] lg:text-[20px] text-white leading-[100%]'>{t('banner.slider3_number', '30%')}</span>
                                            <span className='font-pop font-normal text-[8px] lg:text-sm text-white leading-[100%]'>{t('banner.off', 'OFF')}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* --- [FIXED]: Added onClick navigation to specific category & discounted items --- */}
                                <div onClick={() => navigate('/shop?category=fresh fruit&isDiscounted=true')} className="flex w-fit mx-auto items-center gap-x-2 lg:gap-x-4 bg-primary py-1.75 sm:py-3 lg:py-4 px-3.5 sm:px-8 lg:px-10 rounded-full lg:rounded-[53px] cursor-pointer mt-0.5 lg:mt-0 mb-3 lg:mb-0 hover:bg-[#009206] transition-colors">
                                    <button className='font-pop font-semibold text-[10px] sm:text-sm lg:text-base text-white leading-[120%] cursor-pointer'>{t('banner.shop_now', 'Shop now')}</button>
                                    <FaArrowRight className='text-[9px] sm:text-sm lg:text-base text-white' />
                                </div>
                            </div>

                            {/* Hidden on Mobile for clean UI, preserved on lg */}
                            <div className='hidden lg:block absolute top-0 -right-16'>
                                <BannerThreeBg className='opacity-50' />
                            </div>
                            <div className='hidden lg:block absolute top-0 -left-22'>
                                <BannerThreeBgg className='opacity-50' />
                            </div>
                            <div className='hidden lg:block absolute bottom-0 -right-21'>
                                <BannerThreeBggg className='opacity-50' />
                            </div>
                            <div className='hidden lg:block absolute bottom-0 -left-32'>
                                <BannerBigBgggg className='opacity-50' />
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

                {/* --- SUB BANNERS --- */}
                <div className='w-full lg:w-105.75'>
                    {/* Desktop: vertical space-y-6. Mobile: grid-cols-2 gap-3 */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:flex-col lg:space-y-6 lg:gap-0 h-full">

                        <Swiper
                            direction="horizontal"
                            breakpoints={{ 1024: { direction: "vertical" } }}
                            slidesPerView={1}
                            spaceBetween={0}
                            loop={true}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{ clickable: true }}
                            modules={[Pagination, Autoplay]}
                            className="w-full lg:w-auto h-[120px] sm:h-[180px] lg:h-72 overflow-hidden rounded-[8px] lg:rounded-[10px] slider"
                        >
                            <SwiperSlide>
                                <div className='w-full h-full relative'>
                                    <img src={BannerRSone} alt="Banner img" className='w-full h-full object-cover lg:object-fill rounded-[8px] lg:rounded-[10px]' />
                                    <div className='absolute top-3 sm:top-5 lg:top-8 left-4 lg:left-8'>
                                        <h3 className='font-pop font-medium text-[9px] sm:text-xs lg:text-sm text-logoc tracking-[1px] lg:tracking-[3px] uppercase lg:normal-case'>{t('banner.rs1_subtitle', 'SUMMER SALE')}</h3>
                                        <h2 className='font-pop font-semibold text-[14px] sm:text-[20px] lg:text-[28px] text-logoc pt-0.5 lg:pt-2 pb-1 lg:pb-3'>{t('banner.rs1_title', '75% OFF')}</h2>
                                        <p className='font-pop text-[9px] sm:text-[12px] lg:text-sm text-gry hidden sm:block lg:block'>{t('banner.rs1_desc', 'Only Fruit & Vegetable')}</p>
                                        {/* --- [FIXED]: Added onClick navigation to discounted items --- */}
                                        <div onClick={() => navigate('/shop?isDiscounted=true')} className="flex items-center gap-x-1.5 lg:gap-x-3 pt-2 lg:pt-6 cursor-pointer hover:opacity-80 transition-opacity">
                                            <button className='font-pop font-semibold text-[9px] sm:text-[12px] lg:text-base text-primary'>{t('banner.shop_now', 'Shop now')}</button>
                                            <FaArrowRight className='text-[9px] sm:text-[12px] lg:text-base text-primary' />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='w-full h-full relative'>
                                    <img src={BannerRStwo} alt="Banner img" className='w-full h-full object-cover lg:object-fill rounded-[8px] lg:rounded-[10px]' />
                                    <div className="bg-[rgba(0,38,3,0.8)] absolute top-0 right-0 w-full h-full rounded-[8px] lg:rounded-[10px] flex items-center justify-center text-center px-2 lg:px-0">
                                        <div className="w-full max-w-[95%] lg:max-w-85 ">
                                            <h3 className='font-pop font-medium text-[8px] sm:text-[11px] lg:text-sm text-white leading-[100%] tracking-[1px] lg:tracking-[3px] uppercase lg:normal-case'>{t('banner.rs2_subtitle', 'BEST DEAL')}</h3>
                                            <h2 className='font-pop font-semibold text-[12px] sm:text-[18px] lg:text-hsize text-white leading-[120%] pt-1 lg:pt-3 pb-2 lg:pb-8'>{t('banner.rs2_title', 'Special Products Deal of the Month')}</h2>
                                            {/* --- [FIXED]: Added onClick navigation to specific tag --- */}
                                            <div onClick={() => navigate('/shop?tag=deal-of-the-month')} className="flex items-center gap-x-1.5 lg:gap-x-3 cursor-pointer justify-center hover:opacity-80 transition-opacity">
                                                <button className='font-pop font-semibold text-[9px] sm:text-[12px] lg:text-base text-primary leading-[120%] cursor-pointer'>{t('banner.shop_now', 'Shop now')}</button>
                                                <FaArrowRight className='text-[9px] sm:text-[12px] lg:text-base text-primary' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>

                        <Swiper
                            direction="horizontal"
                            breakpoints={{ 1024: { direction: "vertical" } }}
                            slidesPerView={1}
                            spaceBetween={0}
                            loop={true}
                            autoplay={{
                                delay: 3500,
                                reverseDirection: true,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{ clickable: true }}
                            modules={[Pagination, Autoplay]}
                            className="w-full lg:w-auto h-[120px] sm:h-[180px] lg:h-72 overflow-hidden rounded-[8px] lg:rounded-[10px] slidertwo"
                        >
                            <SwiperSlide>
                                <div className='w-full h-full relative'>
                                    <img src={BannerRStwo} alt="Banner img" className='w-full h-full object-cover lg:object-fill rounded-[8px] lg:rounded-[10px]' />
                                    <div className="bg-[rgba(0,38,3,0.8)] absolute top-0 right-0 w-full h-full rounded-[8px] lg:rounded-[10px] flex items-center justify-center text-center px-2 lg:px-0">
                                        <div className="w-full max-w-[95%] lg:max-w-85 ">
                                            <h3 className='font-pop font-medium text-[8px] sm:text-[11px] lg:text-sm text-white leading-[100%] tracking-[1px] lg:tracking-[3px] uppercase lg:normal-case'>{t('banner.rs2_subtitle', 'BEST DEAL')}</h3>
                                            <h2 className='font-pop font-semibold text-[12px] sm:text-[18px] lg:text-hsize text-white leading-[120%] pt-1 lg:pt-3 pb-2 lg:pb-8'>{t('banner.rs2_title', 'Special Products Deal of the Month')}</h2>
                                            {/* --- [FIXED]: Added onClick navigation to specific tag --- */}
                                            <div onClick={() => navigate('/shop?tag=deal-of-the-month')} className="flex items-center gap-x-1.5 lg:gap-x-3 cursor-pointer justify-center hover:opacity-80 transition-opacity">
                                                <button className='font-pop font-semibold text-[9px] sm:text-[12px] lg:text-base text-primary leading-[120%] cursor-pointer'>{t('banner.shop_now', 'Shop now')}</button>
                                                <FaArrowRight className='text-[9px] sm:text-[12px] lg:text-base text-primary' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>

                            <SwiperSlide>
                                <div className='w-full h-full relative'>
                                    <img src={BannerRSone} alt="Banner img" className='w-full h-full object-cover lg:object-fill rounded-[8px] lg:rounded-[10px]' />
                                    <div className='absolute top-3 sm:top-5 lg:top-8 left-4 lg:left-8'>
                                        <h3 className='font-pop font-medium text-[9px] sm:text-xs lg:text-sm text-logoc tracking-[1px] lg:tracking-[3px] uppercase lg:normal-case'>{t('banner.rs1_subtitle', 'SUMMER SALE')}</h3>
                                        <h2 className='font-pop font-semibold text-[14px] sm:text-[20px] lg:text-[28px] text-logoc pt-0.5 lg:pt-2 pb-1 lg:pb-3'>{t('banner.rs1_title', '75% OFF')}</h2>
                                        <p className='font-pop text-[9px] sm:text-[12px] lg:text-sm text-gry hidden sm:block lg:block'>{t('banner.rs1_desc', 'Only Fruit & Vegetable')}</p>
                                        {/* --- [FIXED]: Added onClick navigation to discounted items --- */}
                                        <div onClick={() => navigate('/shop?isDiscounted=true')} className="flex items-center gap-x-1.5 lg:gap-x-3 pt-2 lg:pt-6 cursor-pointer hover:opacity-80 transition-opacity">
                                            <button className='font-pop font-semibold text-[9px] sm:text-[12px] lg:text-base text-primary'>{t('banner.shop_now', 'Shop now')}</button>
                                            <FaArrowRight className='text-[9px] sm:text-[12px] lg:text-base text-primary' />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Banner;
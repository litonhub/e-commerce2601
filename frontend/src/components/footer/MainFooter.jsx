import React from 'react'
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Container from '../layouts/Container';
import footerlogo from '../../assets/images/footerlogo.png'
import ApplePay from '../../assets/images/applepay.png'
import Visa from '../../assets/images/visa.png'
import Discover from '../../assets/images/Discover.png'
import Mastercard from '../../assets/images/Mastercard.png'
import SecureP from '../../assets/images/securep.png'
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const MainFooter = () => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('footer.col1.title'),
      links: [
        t('footer.col1.link1'),
        t('footer.col1.link2'),
        t('footer.col1.link3'),
        t('footer.col1.link4')
      ],
    },
    {
      title: t('footer.col2.title'),
      links: [
        t('footer.col2.link1'),
        t('footer.col2.link2'),
        t('footer.col2.link3'),
        t('footer.col2.link4')
      ],
    },
    {
      title: t('footer.col3.title'),
      links: [
        t('footer.col3.link1'),
        t('footer.col3.link2'),
        t('footer.col3.link3'),
        t('footer.col3.link4')
      ],
    },
  ];

  return (
    <div className="bg-logoc">
      <Container>
        <footer>
          <div className="py-8 lg:py-15 flex flex-col lg:flex-row justify-between gap-y-6 lg:gap-y-0 px-4 md:px-6 lg:px-0">
            
            {/* 1. Brand Area */}
            <div className="w-full lg:max-w-95 flex flex-col items-start text-left">
              <img src={footerlogo} alt="footerlogo" className="w-32 lg:w-auto mb-1 lg:mb-0" />
              <p className='font-pop font-normal text-[12px] lg:text-sm text-gryd leading-[150%] py-3 lg:py-4 mr-0 lg:mr-9'>
                {t('footer.description')}
              </p>
              
              <div className="flex flex-row items-center flex-nowrap w-full whitespace-nowrap overflow-hidden">
                <div className="flex items-center gap-x-2 lg:gap-x-3 font-pop leading-[150%] relative">
                  <Link to='tel:+8801701054694' className="text-white font-medium text-[12px] lg:text-sm">{t('footer.phone_number')}</Link>
                  <span className="hidden lg:block absolute left-0 -bottom-1 w-[41%] h-0.5 bg-primary"></span>
                  <span className='text-[12px] lg:text-[16px] font-normal text-gryd'>{t('footer.or')}</span>
                  <Link to='mailto:liton01766@gmail.com' className="text-white font-medium text-[12px] lg:text-sm hover:text-primary transition-colors">{t('footer.email')}</Link>
                  <span className="hidden lg:block absolute right-0 -bottom-1 w-[49%] h-0.5 bg-primary"></span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row justify-between w-full lg:w-auto lg:gap-x-19.5">
              {columns.map((col, i) => (
                <div key={i} className="text-left">
                  <h4 className="font-pop text-white text-[14px] lg:text-[16px] leading-[130%] lg:leading-[150%] mb-3 lg:mb-5 font-medium relative inline-block">
                    {col.title}
                    <span className="absolute left-0 -bottom-1 w-4 lg:w-6 h-0.5 bg-primary"></span>
                  </h4>

                  <ul className="space-y-2 lg:space-y-3">
                    {col.links.map((link, idx) => (
                      <li key={idx} className="text-[10px] sm:text-[12px] lg:defaultfs text-grynine hover:text-white cursor-pointer transition-colors leading-[130%] lg:leading-[150%] pr-1 lg:pr-0">
                        {link}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* 3. App Downloads */}
            <div className="flex flex-col items-start text-left pt-2 lg:pt-0 w-full lg:w-auto">
              <h4 className="text-white font-pop text-[14px] lg:text-[20px] leading-[150%] mb-4 lg:mb-7.5 font-medium relative inline-block">
                {t('footer.download_app_title')}
                <span className="absolute left-0 -bottom-1 w-4 lg:w-6 h-0.5 bg-primary"></span>
              </h4>

              <div className="flex flex-row justify-start gap-2 lg:gap-x-2 w-full">
                <div className="flex items-center gap-1.5 bg-subb p-2 lg:p-2.5 rounded-md lg:rounded-sm cursor-pointer hover:bg-gray-700 transition flex-1 max-w-[150px] lg:w-auto">
                  <FaApple className="size-5 sm:size-6 lg:size-7 text-white shrink-0" />
                  <div className="text-pop text-left">
                    <p className='font-normal text-[8px] sm:text-[9px] lg:text-xs text-[#B3B3B3] leading-[130%]'>{t('footer.download_on')}</p>
                    <p className="text-white text-[10px] sm:text-[12px] lg:text-[16px] font-medium leading-[150%] truncate">{t('footer.app_store')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-subb p-2 lg:p-2.5 rounded-md lg:rounded-sm cursor-pointer hover:bg-gray-700 transition flex-1 max-w-[150px] lg:w-auto">
                  <FaGooglePlay className="size-4 sm:size-5 lg:size-6 text-white shrink-0" />
                  <div className="text-pop text-left">
                    <p className='font-normal text-[8px] sm:text-[9px] lg:text-xs text-[#B3B3B3] leading-[130%]'>{t('footer.download_on')}</p>
                    <p className="text-white text-[10px] sm:text-[12px] lg:text-[16px] font-medium leading-[150%] truncate">{t('footer.google_play')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-subb py-6 mb-4 lg:mb-0 flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-y-4 lg:gap-y-0 px-4 md:px-6 lg:px-0">
            <p className="text-[11px] sm:text-[13px] lg:defaultfs text-gryd text-center lg:text-left mt-2 lg:mt-0">
              {t('footer.copyright')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-x-3">
              <img src={ApplePay} alt="ApplePay" className="h-7 lg:h-auto object-contain" />
              <img src={Visa} alt="Visa" className="h-7 lg:h-auto object-contain" />
              <img src={Discover} alt="Discover" className="h-7 lg:h-auto object-contain" />
              <img src={Mastercard} alt="Mastercard" className="h-7 lg:h-auto object-contain" />
              <img src={SecureP} alt="Secure Payment" className="h-7 lg:h-auto object-contain" />
            </div>
          </div>
        </footer>
      </Container>
    </div>
  )
}

export default MainFooter;
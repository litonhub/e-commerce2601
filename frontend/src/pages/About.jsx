import React, { useState } from 'react'
import PageBanner from '../components/common/PageBanner';
import Container from '../components/layouts/Container';
import Aboutone from '../assets/images/aboutone.webp'
import Abouttwo from '../assets/images/abouttwo.jpg'
import {
  FaArrowRight,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaFacebookF,
  FaHeadphonesAlt,
  FaInstagram,
  FaLeaf,
  FaPinterestP,
  FaRegStar,
  FaShoppingBag,
  FaTruck,
  FaTwitter,
} from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa6';

import deliveryImage from '../assets/images/aboutthree.webp';
import Teammone from '../assets/images/teammone.webp';
import Teammtwo from '../assets/images/teammtwo.webp';
import Teammthree from '../assets/images/teammthree.webp';
import Teamfour from '../assets/images/teamfour.webp';
import ClientTestimonial from '../components/ClientTestimonial';
import BrandSlider from '../components/BrandSlider';

const teamMembers = [
  {
    name: 'Jenny Wilson',
    role: 'Ceo & Founder',
    image: Teammone,
    facebook: '#',
    twitter: '#',
    pinterest: '#',
    instagram: '#',
  },
  {
    name: 'Jane Cooper',
    role: 'Worker',
    image: Teammtwo,
    facebook: '#',
    twitter: '#',
    pinterest: '#',
    instagram: '#',
  },
  {
    name: 'Cody Fisher',
    role: 'Security Guard',
    image: Teammthree,
    facebook: '#',
    twitter: '#',
    pinterest: '#',
    instagram: '#',
  },
  {
    name: 'Robert Fox',
    role: 'Senior Farmer Manager',
    image: Teamfour,
    facebook: '#',
    twitter: '#',
    pinterest: '#',
    instagram: '#',
  },
  {
    name: 'Jenny Wilson',
    role: 'Ceo & Founder',
    image: '/images/team-5.png',
    facebook: '#',
    twitter: '#',
    pinterest: '#',
    instagram: '#',
  },
  {
    name: 'Jane Cooper',
    role: 'Worker',
    image: '/images/team-6.png',
    facebook: '#',
    twitter: '#',
    pinterest: '#',
    instagram: '#',
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleMembers = teamMembers.slice(activeIndex, activeIndex + 4).length === 4
    ? teamMembers.slice(activeIndex, activeIndex + 4)
    : [...teamMembers.slice(activeIndex), ...teamMembers.slice(0, 4 - teamMembers.slice(activeIndex).length)];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <PageBanner
        items={[
          "About",
        ]}
      />

      <Container>
        {/* First Section */}
        <div className="py-12 lg:py-20 px-4 md:px-6 lg:px-0">
          <div className='flex flex-col lg:flex-row justify-between items-center gap-10'>
            <div className="w-full lg:w-151 text-center lg:text-left">
              <h1 className='font-pop font-semibold text-[32px] md:text-[40px] lg:text-[56px] text-logoc leading-[120%] pb-4 lg:pb-8'>
                100% Trusted Organic Food Store
              </h1>
              <p className='font-pop font-normal text-[15px] lg:text-[18px] text-gry leading-[150%] text-justify lg:text-left'>
                Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.
              </p>
            </div>
            <div className="w-full lg:w-179">
              <img src={Aboutone} alt="About Img" className='rounded-lg w-full h-auto object-cover' />
            </div>
          </div>
        </div>

        {/* Second Section */}
        <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-x-5 px-4 md:px-6 lg:px-0 pb-12 lg:pb-20'>
          <img src={Abouttwo} alt="About Img" className='rounded-lg lg:rounded-l-lg lg:rounded-r-none w-full lg:w-1/2 h-auto object-cover' />

          <div className="w-full lg:w-auto">
            <div className='w-full lg:w-142.5 text-center lg:text-left'>
              <h1 className='font-pop font-semibold text-[32px] md:text-[40px] lg:text-[56px] text-logoc leading-[120%] pb-4 lg:pb-8'>
                100% Trusted Organic Food Store
              </h1>
              <p className='font-pop font-normal text-[14px] lg:text-[16px] text-gryd leading-[150%] text-justify lg:text-left'>
                Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi. Nulla eu eros consequat tortor tincidunt feugiat.
              </p>
            </div>

            {/* Features Grid */}
            <div className="flex flex-col sm:flex-row items-start lg:items-center gap-6 lg:gap-x-6 pt-8 lg:pt-6">
              <div className="flex flex-col gap-y-6 w-full sm:w-1/2">
                <div className="flex items-center gap-x-4">
                  <div className="bg-[rgba(0,178,6,0.1)] text-[#00B207] w-14 h-14 lg:w-18 lg:h-18 rounded-full flex justify-center items-center shrink-0">
                    <FaLeaf className="text-[28px]" />
                  </div>
                  <div>
                    <h2 className='font-pop font-medium text-[16px] lg:text-[18px] text-logoc leading-[150%] pb-1 lg:pb-2'>100% Organic food</h2>
                    <p className='text-[13px] lg:defaultfs text-gryd'>100% healthy & Fresh food.</p>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="bg-[rgba(0,178,6,0.1)] text-[#00B207] w-14 h-14 lg:w-18 lg:h-18 rounded-full flex justify-center items-center shrink-0">
                    <FaRegStar className="text-[28px]" />
                  </div>
                  <div>
                    <h2 className='font-pop font-medium text-[16px] lg:text-[18px] text-logoc leading-[150%] pb-1 lg:pb-2'>Customer Feedback</h2>
                    <p className='text-[13px] lg:defaultfs text-gryd'>Our happy customer</p>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="bg-[rgba(0,178,6,0.1)] text-[#00B207] w-14 h-14 lg:w-18 lg:h-18 rounded-full flex justify-center items-center shrink-0">
                    <FaTruck className="text-[28px]" />
                  </div>
                  <div>
                    <h2 className='font-pop font-medium text-[16px] lg:text-[18px] text-logoc leading-[150%] pb-1 lg:pb-2'>Free Shipping</h2>
                    <p className='text-[13px] lg:defaultfs text-gryd'>Free shipping with discount</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-6 w-full sm:w-1/2">
                <div className="flex items-center gap-x-4">
                  <div className="bg-[rgba(0,178,6,0.1)] text-[#00B207] w-14 h-14 lg:w-18 lg:h-18 rounded-full flex justify-center items-center shrink-0">
                    <FaHeadphonesAlt className="text-[28px]" />
                  </div>
                  <div>
                    <h2 className='font-pop font-medium text-[16px] lg:text-[18px] text-logoc leading-[150%] pb-1 lg:pb-2'>Great Support 24/7</h2>
                    <p className='text-[13px] lg:defaultfs text-gryd'>Instant access to Contact</p>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="bg-[rgba(0,178,6,0.1)] text-[#00B207] w-14 h-14 lg:w-18 lg:h-18 rounded-full flex justify-center items-center shrink-0">
                    <FaShoppingBag className="text-[28px]" />
                  </div>
                  <div>
                    <h2 className='font-pop font-medium text-[16px] lg:text-[18px] text-logoc leading-[150%] pb-1 lg:pb-2'>100% Sucure Payment</h2>
                    <p className='text-[13px] lg:defaultfs text-gryd'>We ensure your money is save</p>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <div className="bg-[rgba(0,178,6,0.1)] text-[#00B207] w-14 h-14 lg:w-18 lg:h-18 rounded-full flex justify-center items-center shrink-0">
                    <FaBoxOpen className="text-[28px]" />
                  </div>
                  <div>
                    <h2 className='font-pop font-medium text-[16px] lg:text-[18px] text-logoc leading-[150%] pb-1 lg:pb-2'>Money-Back Guarantee</h2>
                    <p className='text-[13px] lg:defaultfs text-gryd'>30 Days Money-Back Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Section */}
        <div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 min-h-[430px]">
            <div className="w-full lg:w-[552px] text-center lg:text-left pb-2">
              <h2 className="font-pop font-semibold text-[32px] md:text-[42px] lg:text-[48px] text-logoc leading-[120%] pb-4 lg:pb-5">
                We Delivered, You Enjoy Your Order.
              </h2>
              <p className="font-pop font-normal text-[14px] lg:text-[16px] text-gryd leading-[150%] pb-5 lg:pb-6">
                Ut suscipit egestas suscipit. Sed posuere pellentesque nunc, ultrices consectetur velit dapibus eu. Mauris sollicitudin dignissim diam, ac mattis eros accumsan rhoncus. Curabitur auctor bibendum nunc eget elementum.
              </p>

              <ul className="flex flex-col gap-y-3 pb-7 lg:pb-8 text-left">
                <li className="flex items-center gap-x-2.5 font-pop text-[14px] lg:text-[15px] text-gryd leading-[150%]">
                  <span className="w-[18px] h-[18px] rounded-full bg-[rgba(0,178,6,0.1)] text-[#00B207] flex items-center justify-center shrink-0">
                    <FaCheck className="text-[10px]" />
                  </span>
                  <span>Sed in metus pellentesque.</span>
                </li>
                <li className="flex items-center gap-x-2.5 font-pop text-[14px] lg:text-[15px] text-gryd leading-[150%]">
                  <span className="w-[18px] h-[18px] rounded-full bg-[rgba(0,178,6,0.1)] text-[#00B207] flex items-center justify-center shrink-0">
                    <FaCheck className="text-[10px]" />
                  </span>
                  <span>Fusce et ex commodo, aliquam nulla efficitur, tempus lorem.</span>
                </li>
                <li className="flex items-center gap-x-2.5 font-pop text-[14px] lg:text-[15px] text-gryd leading-[150%]">
                  <span className="w-[18px] h-[18px] rounded-full bg-[rgba(0,178,6,0.1)] text-[#00B207] flex items-center justify-center shrink-0">
                    <FaCheck className="text-[10px]" />
                  </span>
                  <span>Maecenas ut nunc fringilla erat varius.</span>
                </li>
              </ul>

              <a href="#" className="inline-flex items-center justify-center gap-x-3 bg-primary bg-[#00B207] hover:bg-[#2C742F] text-white font-pop font-semibold text-[14px] leading-[120%] rounded-full px-10 py-4 transition-all duration-300">
                Shop Now
                <FaArrowRight className="text-[14px]" />
              </a>
            </div>

            <div className="relative w-full lg:w-[606px] h-[895px] sm:h-[430px] flex items-end justify-center">
              <img
                src={deliveryImage}
                alt="Delivery person"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Fourth Section */}
      <section className="bg-[#F8F8F8] py-12 lg:py-20">
        <Container>
          <div className="px-4 md:px-6 lg:px-0">
            <div className="text-center max-w-[720px] mx-auto pb-8 lg:pb-10">
              <h2 className="font-pop font-semibold text-[32px] md:text-[40px] lg:text-[48px] text-logoc leading-[120%] pb-3">
                Our Awesome Team
              </h2>
              <p className="font-pop font-normal text-[14px] lg:text-[16px] text-gryd leading-[150%]">
                Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi.
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous team member"
                className="absolute left-0 lg:-left-12 top-1/2 z-20 -translate-y-1/2 w-10 h-10 rounded-full border border-[#E6E6E6] bg-white text-[#666666] hover:bg-primary hover:bg-[#00B207] hover:text-white hover:border-transparent shadow-sm flex items-center justify-center transition-all duration-300"
              >
                <FaChevronLeft className="text-[16px]" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-x-6 px-10 lg:px-0">
                {visibleMembers.map((member, index) => (
                  <div
                    key={`${member.name}-${member.role}-${activeIndex}-${index}`}
                    className="group bg-white rounded-lg overflow-hidden border border-[#E6E6E6] hover:shadow-[0_20px_48px_rgba(0,0,0,0.10)] transition-all duration-300"
                  >
                    <div className="relative h-[280px] sm:h-[250px] lg:h-[280px] bg-[#F2F2F2] overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center gap-x-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <a href={member.facebook} aria-label="Facebook" className="w-10 h-10 rounded-full  text-white hover:bg-primary hover:bg-[#00B207] hover:text-white flex items-center justify-center transition-all duration-300">
                          <FaFacebookF className="text-[16px]" />
                        </a>
                        <a href={member.twitter} aria-label="Twitter" className="w-10 h-10 rounded-full text-white hover:bg-primary hover:bg-[#00B207] hover:text-white flex items-center justify-center transition-all duration-300">
                          <FaTwitter className="text-[16px]" />
                        </a>
                        <a href={member.pinterest} aria-label="Pinterest" className="w-10 h-10 rounded-full text-white hover:bg-primary hover:bg-[#00B207] hover:text-white flex items-center justify-center transition-all duration-300">
                          <FaPinterestP className="text-[16px]" />
                        </a>
                        <a href={member.instagram} aria-label="Instagram" className="w-10 h-10 rounded-full text-white hover:bg-primary hover:bg-[#00B207] hover:text-white flex items-center justify-center transition-all duration-300">
                          <FaInstagram className="text-[16px]" />
                        </a>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <h3 className="font-pop font-medium text-[18px] text-logoc leading-[150%] pb-1">
                        {member.name}
                      </h3>
                      <p className="font-pop font-normal text-[14px] text-gryd leading-[150%]">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next team member"
                className="absolute right-0 lg:-right-12 top-1/2 z-20 -translate-y-1/2 w-10 h-10 rounded-full border border-[#E6E6E6] bg-white text-[#666666] hover:bg-primary hover:bg-[#00B207] hover:text-white hover:border-transparent shadow-sm flex items-center justify-center transition-all duration-300"
              >
                <FaChevronRight className="text-[16px]" />
              </button>
            </div>
          </div>
        </Container>
      </section>
            <ClientTestimonial />
            <div className="bg-white">
              <BrandSlider />
            </div>
    </div>
  )
}

export default About;

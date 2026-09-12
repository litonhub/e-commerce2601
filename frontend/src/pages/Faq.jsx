import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import Container from '../components/layouts/Container';
import Faqimg from '../assets/images/faqimg.png';
import PageBanner from '../components/common/PageBanner';
import { useTranslation } from 'react-i18next';

const Faq = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(1);

const faqData = [
    {
      id: 1,
      question: t('faq.q1', "How do I place an order?"),
      answer: t('faq.a1', "You can easily place an order by browsing our products, adding your desired items to the shopping cart, and proceeding to the checkout page.")
    },
    {
      id: 2,
      question: t('faq.q2', "Are your products 100% organic?"),
      answer: t('faq.a2', "Yes! We source our fresh fruits, vegetables, and other daily necessities directly from verified organic farms to ensure the best quality.")
    },
    {
      id: 3,
      question: t('faq.q3', "What is your return and refund policy?"),
      answer: t('faq.a3', "We offer a 7-day return policy for non-perishable items. For fresh items, please complain within 24 hours of delivery if you find any issues.")
    },
    {
      id: 4,
      question: t('faq.q4', "How long does delivery take?"),
      answer: t('faq.a4', "Standard delivery takes 1-2 business days within the city. You can also choose express delivery for same-day arrival depending on your location.")
    },
    {
      id: 5,
      question: t('faq.q5', "What payment methods do you accept?"),
      answer: t('faq.a5', "We accept various payment methods including Credit/Debit Cards, Mobile Banking (bKash, Nagad), and Cash on Delivery (COD) for your convenience.")
    }
  ];

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
    <PageBanner items={[
        { label: t('faq.faq_title', 'Faq'), path: "/faq" }
      ]} />
    
    <section className="bg-white font-pop overflow-hidden pt-10 lg:pt-0">
      <Container>

        <div className="flex flex-col lg:flex-row items-end lg:gap-18.25 justify-between">
          <div className="w-full lg:w-148 shrink-0 pb-12 lg:pb-26.5 lg:pt-47 flex flex-col">
            {/* --- [FIXED]: Translated the main heading --- */}
            <h2 className="text-hsize lg:text-[42px] font-semibold text-logoc leading-[1.2] mb-10">
              {t('faq.welcome_1', "Welcome, Let's Talk")}<br />{t('faq.welcome_2', "About Our Ecobazar")}
            </h2>

            <div className="flex flex-col gap-4">
              {faqData.map((item) => {
                const isActive = openId === item.id;

                return (
                  <div 
                    key={item.id} 
                    className={`rounded-lg overflow-hidden transition-all duration-300 ${
                      isActive ? 'bg-white border border-[#00B207]' : 'bg-[#F2F2F2] border border-transparent'
                    }`}
                  >
                    <button 
                      onClick={() => toggleFaq(item.id)}
                      className={`w-full flex items-center justify-between px-6 py-4.5 cursor-pointer outline-none transition-colors duration-300 ${
                        isActive ? 'border-b border-[#00B207]' : 'border-b border-transparent'
                      }`}
                    >
                      <h3 
                        className={`text-[16px] font-medium text-left transition-colors duration-300 ${
                          isActive ? 'text-[#00B207]' : 'text-logoc'
                        }`}
                      >
                        {item.question}
                      </h3>
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isActive ? 'bg-[#f2f2f2] text-logoc' : 'bg-white text-logoc'
                        }`}
                      >
                        {isActive ? <FiMinus size={16} /> : <FiPlus size={16} />}
                      </div>
                    </button>

                    <div 
                      className={`grid transition-all duration-300 ease-in-out ${
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 pt-4 text-gry text-[14px] leading-[1.7]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-185.25 flex justify-center lg:justify-end items-end">
            <img 
              src={Faqimg} 
              alt={t('faq.img_alt', 'Farmer holding vegetables')} 
              className="w-full lg:w-185.25 h-auto lg:h-202 object-contain object-bottom block"
              style={{ marginBottom: '-1px' }}
            />
          </div>

        </div>
      </Container>
    </section>
    </>
  );
};

export default Faq;
import React, { useState } from 'react';
import PageBanner from '../components/common/PageBanner';
import Container from '../components/layouts/Container';
import { Link } from 'react-router';
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { submitContactMessage } from "../services/siteService";

const Contact = () => {
  const { t } = useTranslation();

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hello: '',
    subject: ''
  });

  // --- API Mutation ---
  const mutation = useMutation({
    mutationFn: (data) => submitContactMessage(data),
    onSuccess: (res) => {
      toast.success(res.data?.message || t('contact.success_msg', 'Message sent successfully!'));
      setFormData({ name: '', email: '', hello: '', subject: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t('contact.error_msg', 'Failed to send message.'));
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject) {
      toast.error(t('contact.validation_error', 'Please fill in all required fields.'));
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div>
      <PageBanner
        items={[
          t('contact.banner', "Contact"),
        ]}
      />

      <Container>
        {/* Flex-col on mobile/tablet, lg:flex-row on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 py-10 lg:py-20 px-4 md:px-6 lg:px-0">
          
          {/* Contact Info Box: w-full on mobile, original lg:w-78 on desktop */}
          <div className='w-full lg:w-78 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,38,3,0.08)] border border-[#f2f2f2] px-6 py-5 shrink-0'>
            <div className='text-center border-b border-b-brdr pb-4 lg:pb-0'>
              <svg className='mx-auto' width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.1562 46.2188H39.8438" stroke="#2C742F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M25.5 27.0938C27.1908 27.0938 28.8123 26.4221 30.0078 25.2266C31.2033 24.031 31.875 22.4095 31.875 20.7188C31.875 19.028 31.2033 17.4065 30.0078 16.2109C28.8123 15.0154 27.1908 14.3438 25.5 14.3438C23.8092 14.3438 22.1877 15.0154 20.9922 16.2109C19.7966 17.4065 19.125 19.028 19.125 20.7188C19.125 22.4095 19.7966 24.031 20.9922 25.2266C22.1877 26.4221 23.8092 27.0938 25.5 27.0938V27.0938Z" stroke="#2C742F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M41.4375 20.7188C41.4375 35.0625 25.5 46.2188 25.5 46.2188C25.5 46.2188 9.5625 35.0625 9.5625 20.7188C9.5625 16.4919 11.2416 12.4381 14.2305 9.44924C17.2193 6.46037 21.2731 4.78125 25.5 4.78125C29.7269 4.78125 33.7807 6.46037 36.7695 9.44924C39.7584 12.4381 41.4375 16.4919 41.4375 20.7188V20.7188Z" stroke="#2C742F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className='font-pop font-normal text-[14px] lg:text-base text-subb leading-[170%] pt-3 pb-4 lg:pt-4 lg:pb-6'>{t('contact.address', '2715 Ash Dr. San Jose, South Dakota 83475')}</p>
            </div>

            <div className='text-center border-b border-b-brdr pt-4 lg:pt-6'>
              <svg className='mx-auto' width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48.45 5.9502H2.55C1.14172 5.9502 0 7.09182 0 8.5002V42.5002C0 43.9084 1.14162 45.0502 2.55 45.0502H48.45C49.8583 45.0502 51 43.9085 51 42.5002V8.5002C51 7.09192 49.8584 5.9502 48.45 5.9502ZM49.3 42.5003C49.3 42.9697 48.9195 43.3502 48.45 43.3502H2.55C2.08054 43.3502 1.70003 42.9697 1.70003 42.5003V8.5002C1.70003 8.03074 2.08054 7.65023 2.55 7.65023H48.45C48.9195 7.65023 49.3 8.03074 49.3 8.5002V42.5003Z" fill="#2C742F" />
                <path d="M46.8239 9.35387C46.5993 9.33424 46.3761 9.40467 46.2035 9.5497L26.5939 26.0226C25.9614 26.5542 25.0384 26.5542 24.4059 26.0226L4.79654 9.5496C4.56395 9.35437 4.2448 9.29799 3.95942 9.40178C3.67404 9.50557 3.46566 9.7538 3.41286 10.0529C3.36007 10.3521 3.47084 10.6566 3.70342 10.8518L23.3129 27.3239C24.5768 28.388 26.4231 28.388 27.6871 27.3239L47.2965 10.8519C47.4692 10.707 47.5772 10.4994 47.5968 10.2748C47.6164 10.0501 47.546 9.82691 47.401 9.65429C47.2561 9.48147 47.0485 9.37349 46.8239 9.35387Z" fill="#2C742F" />
                <path d="M16.3483 27.206C16.0474 27.1388 15.7338 27.2398 15.5286 27.4699L3.62856 40.2199C3.41321 40.4405 3.33412 40.7604 3.42197 41.0559C3.50983 41.3514 3.75079 41.5761 4.05161 41.6433C4.35253 41.7104 4.6661 41.6094 4.87129 41.3793L16.7713 28.6293C16.9867 28.4088 17.0658 28.0888 16.9779 27.7934C16.8901 27.4979 16.6492 27.2731 16.3483 27.206Z" fill="#2C742F" />
                <path d="M35.4714 27.4699C35.2663 27.2398 34.9526 27.1388 34.6517 27.206C34.3508 27.2731 34.1099 27.4979 34.0221 27.7934C33.9342 28.0889 34.0133 28.4088 34.2287 28.6293L46.1287 41.3793C46.4514 41.7098 46.979 41.7221 47.3167 41.407C47.6545 41.0918 47.6788 40.5647 47.3714 40.2198L35.4714 27.4699Z" fill="#2C742F" />
              </svg>

              <div className="flex flex-col pt-3 pb-4 lg:pt-4 lg:pb-6">
                <Link to='mailto:liton01766@gmail.com' className='font-pop font-normal text-[14px] lg:text-base text-subb leading-[170%] break-all'>liton01766@gmail.com</Link>
                <Link to='mailto:litonmia.dev.bd@gmail.com' className='font-pop font-normal text-[14px] lg:text-base text-subb leading-[170%] break-all'>litonmia.dev.bd@gmail.com</Link>
              </div>
            </div>

            <div className='text-center pt-4 lg:pt-6'>
              <svg className='mx-auto' width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.4829 7.24219C34.4249 8.03345 37.1074 9.58385 39.2616 11.7381C41.4159 13.8923 42.9663 16.5748 43.7575 19.5168" stroke="#2C742F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M29.6865 13.9502C31.4513 14.425 33.0604 15.3551 34.3527 16.6474C35.645 17.9396 36.5751 19.5488 37.0499 21.3136" stroke="#2C742F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.9625 25.6416C18.7621 29.322 21.7449 32.292 25.433 34.0757C25.7031 34.2036 26.0018 34.2589 26.2998 34.2361C26.5977 34.2133 26.8846 34.1131 27.132 33.9456L32.5639 30.3255C32.8038 30.1653 33.0799 30.0674 33.3671 30.0408C33.6544 30.0141 33.9437 30.0595 34.209 30.1728L44.3699 34.5287C44.715 34.6753 45.0032 34.9301 45.191 35.2546C45.3788 35.5792 45.4561 35.956 45.4112 36.3283C45.0895 38.8411 43.8631 41.1506 41.9616 42.8244C40.06 44.4983 37.6135 45.4217 35.0802 45.4219C27.2558 45.4219 19.7518 42.3136 14.2191 36.7809C8.68637 31.2482 5.57813 23.7442 5.57812 15.9198C5.57836 13.3866 6.50185 10.9404 8.17571 9.03914C9.84957 7.13784 12.159 5.91181 14.6717 5.59057C15.044 5.54568 15.4208 5.62294 15.7454 5.81074C16.0699 5.99853 16.3247 6.28669 16.4713 6.63182L20.8307 16.8014C20.9428 17.0641 20.9883 17.3505 20.9632 17.6351C20.9381 17.9196 20.8431 18.1936 20.6867 18.4327L17.077 23.9478C16.9132 24.1962 16.8165 24.4828 16.7964 24.7796C16.7764 25.0765 16.8336 25.3734 16.9625 25.6416V25.6416Z" stroke="#2C742F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="flex flex-col pt-3 pb-4 lg:pt-4 lg:pb-6">
                <Link to='tel:+8801701054694' className='font-pop font-normal text-[14px] lg:text-base text-subb leading-[170%]'>{t('contact.phone_number', '(+880) 1701054694')}</Link>
                <Link to='mailto:litonmia.dev.bd@gmail.com' className='font-pop font-normal text-[14px] lg:text-base text-subb leading-[170%] break-all'>litonmia.dev.bd@gmail.com</Link>
              </div>
            </div>
          </div>

          {/* Form Box: w-full on mobile, original lg:w-246 on desktop */}
          <div className='w-full lg:w-246 bg-white rounded-lg shadow-[0_4px_10px_rgba(0,38,3,0.08)] border border-[#f2f2f2] p-5 sm:p-8 lg:p-12.5'>
            <form onSubmit={handleSubmit}>
              <div className="w-full lg:w-121.5">
                <h1 className='font-pop font-semibold text-[20px] lg:text-2xl text-logoc leading-[150%] pb-2'>
                  {t('contact.say_hello', 'Just Say Hello!')}
                </h1>
                <p className='text-[13px] lg:defaultfs text-gryd leading-[150%]'>
                  {t('contact.desc', 'Do you fancy saying hi to me or you want to get started with your project and you need my help? Feel free to contact me.')}
                </p>
              </div>

              {/* Name & Email Inputs: Stacked on mobile, side-by-side on desktop */}
              <div className="flex flex-col sm:flex-row gap-4 w-full pb-4 pt-5 lg:pt-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.name_placeholder', 'Name')}
                  className='w-full border border-brdr rounded-md font-pop font-normal text-sm lg:text-base text-black placeholder:text-gry leading-[130%] py-3.5 ps-4 outline-none focus:border-primary'
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.email_placeholder', 'Email')}
                  className='w-full border border-brdr rounded-md font-pop font-normal text-sm lg:text-base text-black placeholder:text-gry leading-[130%] py-3.5 ps-4 outline-none focus:border-primary'
                />
              </div>

              <input
                type="text"
                name="hello"
                value={formData.hello}
                onChange={handleChange}
                placeholder={t('contact.hello_placeholder', 'Hello')}
                className='w-full border border-brdr rounded-md font-pop font-normal text-sm lg:text-base text-black placeholder:text-gry leading-[130%] py-3.5 ps-4 outline-none focus:border-primary mb-4'
              />

              <div className="pb-6">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('contact.subject_placeholder', 'Subject')}
                  className='w-full border border-brdr rounded-md font-pop font-normal text-sm lg:text-base text-black placeholder:text-gry leading-[130%] pt-3.5 pb-15.75 ps-4 outline-none focus:border-primary'
                />
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full sm:w-auto bg-primary text-white text-[15px] lg:text-[16px] font-semibold font-pop leading-[120%] px-10 py-4 rounded-[46px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#246326] transition-colors"
              >
                {mutation.isPending ? t('contact.sending_btn', 'Sending...') : t('contact.send_btn', 'Send Message')}
              </button>
            </form>
          </div>

        </div>
      </Container>

      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3652.1579073294183!2d90.37993967602279!3d23.741747789107155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sCreative%20IT%20Institute%2C!5e0!3m2!1sen!2sbd!4v1779474297859!5m2!1sen!2sbd"
          width="100%"
          height="300"
          className="lg:h-100"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
}

export default Contact;
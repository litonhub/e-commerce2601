import React, { useState, useEffect } from 'react'
import Container from '../layouts/Container'
import { CiLocationOn } from "react-icons/ci";
import Dropdown from '../common/Dropdown';
import { Link } from 'react-router';
import { useAuth } from "../../context/AuthContext";
import { logout as logoutRequest } from "../../services/authService";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { useCurrency } from "../../context/CurrencyContext";

const TopBar = () => {

  const { user, setUser } = useAuth();
  const { t, i18n } = useTranslation();

  const { currency, handleCurrencyChange } = useCurrency();

  const [language, setLanguage] = useState(() => {
    if (i18n.language === "bn") return "Bng";
    if (i18n.language === "fr") return "Fra";
    return "Eng";
  });

  const handleLanguageChange = (selectedLang) => {
    setLanguage(selectedLang);

    if (selectedLang === "Eng") i18n.changeLanguage("en");
    else if (selectedLang === "Bng") i18n.changeLanguage("bn");
    else if (selectedLang === "Fra") i18n.changeLanguage("fr");
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logout successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className='bg-gray-50 lg:bg-transparent border-b border-solid border-gray-200 lg:border-brdr'>
      <Container>
    
        <div className='flex justify-between items-center font-pop font-normal text-[11px] lg:text-sm leading-[130%] text-gry py-2 lg:py-3'>
          
          <div className='hidden lg:flex items-center gap-2'>
            <CiLocationOn />
            {t('topbar.store_location')}
          </div>
          
          <div className='flex items-center justify-between w-full lg:w-auto lg:justify-end gap-x-4 lg:gap-x-10'>
            <div className='flex items-center gap-x-2 sm:gap-x-3 lg:gap-x-5'>
              <Dropdown
                options={["Eng", "Bng", "Fra"]}
                value={language}
                onChange={handleLanguageChange}
              />
              <Dropdown
                options={["USD", "BDT", "EUR"]}
                value={currency || "BDT"}
                onChange={handleCurrencyChange}
              />
            </div>

            <div className='relative flex items-center after:hidden lg:after:block after:w-px after:h-3.75 after:bg-brdr after:content-[""] after:absolute after:top-1/2 after:-translate-y-1/2 after:-left-5'>
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition duration-300"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://i.pravatar.cc/40?img=12"
                    }
                    alt={user?.name}
                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border border-gray-200 lg:border-brdr shadow-sm lg:shadow-none"
                  />

                  <span className="font-medium hidden sm:block lg:block">
                    {user?.name?.split(" ")[0] || user?.firstName}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className='cursor-pointer font-medium lg:font-normal hover:text-primary transition duration-300'
                >
                  {t('topbar.sign_in_up')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default TopBar;
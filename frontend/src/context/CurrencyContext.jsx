import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CurrencyContext = createContext();

// Frontend-only: this used to fetch a live USD/BDT rate from the real
// backend on every page load. There's no backend right now, so we use
// a fixed rate instead (this was already the fallback value the app
// used whenever that request failed). Replace with a real fetch again
// once a currency endpoint exists.
const DUMMY_USD_TO_BDT_RATE = 120;

export const CurrencyProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'BDT'); 
  const [exchangeRate] = useState(DUMMY_USD_TO_BDT_RATE); 

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const formatPrice = (priceInDB) => {
    if (!priceInDB) {
      // জিরো (0) ভ্যালুর ক্ষেত্রেও ডাইনামিক ভাষা সাপোর্ট 
      const zeroFormatter = new Intl.NumberFormat(i18n.language === 'bn' ? 'bn-BD' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(0);
      return currency === 'USD' ? `$${zeroFormatter}` : `৳${zeroFormatter}`;
    }

    let finalAmount = priceInDB;

    // যদি USD সিলেক্ট করা থাকে, তাহলে ভাগ করে কনভার্ট করবে
    if (currency === 'USD') {
      finalAmount = priceInDB / exchangeRate;
    }

    // বর্তমান ভাষা অনুযায়ী Locale সেট করা (বাংলা হলে 'bn-BD', না হলে 'en-US')
    const locale = i18n.language === 'bn' ? 'bn-BD' : 'en-US';

    // Intl.NumberFormat দিয়ে সংখ্যাটিকে লোকাল ভাষায় ফরম্যাট করা
    const formattedAmount = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(finalAmount);
    
    // কারেন্সি সিম্বল যুক্ত করে রিটার্ন করা
    return currency === 'USD' ? `$${formattedAmount}` : `৳${formattedAmount}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, handleCurrencyChange, formatPrice, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
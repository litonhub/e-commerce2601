import { motion } from "framer-motion";
import { useState } from "react";
import Faaah from '../assets/sounds/faaah.mp3'
import Babu from '../assets/gif/bubu.gif'
import Banner from "../components/Banner";
import StoreBenefits from "../components/StoreBenefits";
import PopularCategories from "../components/PopularCategories";
import PopularProducts from "../components/PopularProducts";
import OfferSection from "../components/OfferSection";
import HotDeals from "../components/HotDeals";
import StatsSection from "../components/StatsSection";
import VideoBanner from "../components/VideoBanner";
import BestSeller from "../components/BestSeller";
import LatestNews from "../components/LatestNews";
import ClientTestimonial from "../components/ClientTestimonial";
import BrandSlider from "../components/BrandSlider";
import InstagramGallery from "../components/InstagramGallery";

const Home = () => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(true);

    const audio = new Audio(Faaah);
    audio.play();
  };

  return (
    <>
      <Banner />
      <StoreBenefits />
      <PopularCategories />
      <PopularProducts />
      <OfferSection />
      <StatsSection />
      <HotDeals />
      <VideoBanner />
      <BestSeller />
      <LatestNews />
      <ClientTestimonial />
      <BrandSlider />
      <InstagramGallery />
    </>
  )
}

export default Home;

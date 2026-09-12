import React, { useState, useEffect } from "react";
import TopBar from "../header/TopBar";
import { Outlet, useLocation } from "react-router";
import MainHeader from "../header/MainHeader";
import Navbar from "../header/Navbar";
import FooterNewsletter from "../footer/FooterNewsletter";
import MainFooter from "../footer/MainFooter";
import NewsletterModal from "../NewsletterModal";

const MainLayouts = () => {

  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();


  useEffect(() => {

    if (location.pathname === "/") {
      const hidePermanent = localStorage.getItem("hideModal");
      const hideSession = sessionStorage.getItem("sessionModalShown");

      if (hidePermanent !== "true" && hideSession !== "true") {
        const timer = setTimeout(() => {
          setOpen(true);
          sessionStorage.setItem("sessionModalShown", "true");
        }, 1000);

        return () => clearTimeout(timer);
      }
    } else {

      setOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 45);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">

      <TopBar />

      <div
        className={`w-full bg-white z-25 sticky top-0 transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""
          }`}
      >
        <MainHeader />
        <Navbar />
      </div>

      {location.pathname === "/" && (
        <NewsletterModal
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}

      <main className="grow">
        <Outlet />
      </main>

      <FooterNewsletter />
      <MainFooter />
    </div>
  )
}

export default MainLayouts;
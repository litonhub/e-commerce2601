import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import Container from "./layouts/Container";
import { getCategories } from "../api/categoryApi";
import { useTranslation } from 'react-i18next'; 

const PopularCategories = () => {
  const { t, i18n } = useTranslation(); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const res = await getCategories({ popular: true, limit: 12 });
        setCategories(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch popular categories:", error);
        setLoading(false);
      }
    };
    fetchPopularCategories();
  }, []);

  const handleCategoryClick = (category) => {
    const categorySlug = typeof category.name === 'object' ? category.name.en : category.name;
    navigate(`/shop?category=${encodeURIComponent(categorySlug.toLowerCase())}`);
  };

  if (loading) return <div className="py-8 lg:py-15 text-center">{t('popular_categories.loading')}</div>; 

  return (
    <section className="pt-5 pb-8 lg:py-15">
      <Container>
        {/* Header Section: Ensured to stay on 1 line on mobile by reducing font sizes */}
        <div className="flex justify-between items-center mb-4 lg:mb-8 px-4 md:px-6 lg:px-0">
          <h2 className="font-pop font-semibold text-[20px] lg:text-hsize text-logoc leading-[120%] truncate pr-2">
            {t('popular_categories.title')} 
          </h2>

          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center gap-1 lg:gap-2 font-pop text-primary font-medium text-[14px] lg:text-[16px] leading-[150%] cursor-pointer shrink-0 hover:underline"
          >
            {t('popular_categories.view_all')} 
            <FaArrowRight className="size-3.25 lg:size-3.75" />
          </button>
        </div>

        {/* Grid Section: 3 columns on mobile, gap reduced to fit beautifully. Desktop untouched. */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 lg:gap-6 px-4 md:px-6 lg:px-0">
          {categories.map((item) => (
            <div
              key={item._id}
              onClick={() => handleCategoryClick(item)} 
              className="group border border-brdrtwo rounded-[5px] px-2 py-3 lg:px-5 lg:pt-4 lg:pb-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#2C742F] hover:shadow-[0_0_12px_0_rgba(32,181,38,0.32)] bg-white"
            >
              <img
                src={item.image?.url}
                alt={typeof item.name === 'object' ? item.name.en : item.name}
                className="h-14 sm:h-20 lg:h-32.5 object-contain transition-transform duration-300 group-hover:scale-105"
              />

              <h3 className="mt-2 lg:mt-4 font-pop font-medium text-[10px] sm:text-[12px] lg:text-[18px] text-logoc leading-[120%] lg:leading-[150%] text-center transition-colors duration-300 group-hover:text-[#2C742F] line-clamp-2 lg:line-clamp-none">
                {typeof item.name === 'object' 
                  ? (item.name[i18n.language] || item.name.en) 
                  : item.name}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PopularCategories;
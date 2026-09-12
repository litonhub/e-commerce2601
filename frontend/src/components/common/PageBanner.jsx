import { GoHome } from "react-icons/go";
import { FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router";
import Navimg from "../../assets/images/navigation-img.png";
import Container from "../layouts/Container";

const PageBanner = ({ items }) => {
    return (
        <div className="relative w-full">
            <img src={Navimg} alt="navigation-img" className="w-full h-16 sm:h-24 lg:h-30 object-cover" />

            <div className="absolute inset-0">
                <Container className='h-full'>
                    <div className="h-full flex items-center px-4 md:px-6 lg:px-0">
                        <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 lg:gap-x-3">
                            <Link to="/" aria-label="Home" className="shrink-0">
                                <GoHome className="size-4 lg:size-5 text-gryd hover:text-primary transition-colors" />
                            </Link>

                            {items.map((item, index) => {
                                const isLast = index === items.length - 1;
                                const label = typeof item === "string" ? item : item.label;
                                const path = typeof item === "string" ? null : item.path;

                                const textClass = isLast
                                    ? "text-primary text-[12px] sm:text-[14px] lg:text-base font-normal leading-[150%] line-clamp-1"
                                    : "text-grynine text-[12px] sm:text-[14px] lg:text-base font-normal leading-[150%] line-clamp-1";

                                return (
                                    <div key={index} className="flex items-center gap-x-1.5 sm:gap-x-2 lg:gap-x-3">
                                        <FaChevronRight className="size-2 lg:size-2.5 text-grynine shrink-0" />
                                        {path && !isLast ? (
                                            <Link to={path} className={`${textClass} hover:underline underline-offset-2`}>
                                                {label}
                                            </Link>
                                        ) : (
                                            <h5 className={textClass}>{label}</h5>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default PageBanner;
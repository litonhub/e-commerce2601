import React, { useState, useRef } from "react";
import { FaAngleDown } from "react-icons/fa6";

const DropdownHover = ({
    options = [],
    value,
    onChange = () => { },
    placeholder = "Select",
    className = "",
    dropdownClass = "",
    renderTrigger,
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (item) => {
        onChange(item);
        setOpen(false);
    };

    return (
        <div
            ref={dropdownRef}
            className={`relative ${className}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div className="cursor-pointer">
                {renderTrigger ? (
                    renderTrigger(open, value)
                ) : (
                    <div className="flex items-center gap-1.5">
                        {value || placeholder}
                        <FaAngleDown
                            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                    </div>
                )}
            </div>

            <div
                className={`absolute left-0 top-full mt-5.5 min-w-49 bg-white shadow-lg border border-brdr z-50 origin-top transition-all duration-300 ${
                    open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                } ${dropdownClass}`}
            >
                <div className="absolute -top-6 left-0 w-full h-6 cursor-pointer" aria-hidden="true"></div>
                <ul>
                    {options.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(item)}
                            className="group flex items-center gap-2 px-4 py-3.5 text-logoc text-sm cursor-pointer hover:bg-primary hover:text-white transition"
                        >
                            {item.icon && (
                                <span className="text-primary group-hover:text-white text-base">
                                    {item.icon}
                                </span>
                            )}
                            <span>{item.label || item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DropdownHover;
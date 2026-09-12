import React, { useState, useRef } from "react";
import { FaAngleDown } from "react-icons/fa6";
import useOutsideClick from "../../hooks/useOutsideClick";

const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select",
  className = "",
  dropdownClass = "",
  renderItem,
  renderTrigger,
  footer,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setOpen(false));

  const handleSelect = (item) => {
    onChange(item);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {renderTrigger ? (
          renderTrigger(open, value)
        ) : (
          <div className="flex items-center gap-1.5">
            {value || placeholder}
            <FaAngleDown
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        )}
      </div>
      <div
        className={`absolute top-5 left-0 z-50 bg-white shadow-lg origin-top transition-all duration-300
        ${open ? "opacity-100 scale-y-100 cursor-default" : "opacity-0 scale-y-0"}
        ${dropdownClass}`}
      >
        <ul>
          {options.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item)}>
              {renderItem ? (
                renderItem(item)
              ) : (
                <div className="px-3 py-1 hover:bg-primary hover:text-white">
                  {item}
                </div>
              )}
            </li>
          ))}
        </ul>
        {footer && (
          <div className="border-t border-brdr">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
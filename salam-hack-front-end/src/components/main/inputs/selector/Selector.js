import React, { useState, useEffect, useRef } from "react";
import "./selector.css";

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";


export default function Selector({
  options = [],
  selectedOption = { value: "", label: "" },
  onSelect = () => {},
}) {
  let optionsRef = useRef();
  const [itemsVisibility, setItemsVisibility] = useState(false);
  const [_selectedOption, setSelectedOption] = useState(selectedOption);

  useEffect(() => {
    let handler = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setItemsVisibility(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div className="selector-component" ref={optionsRef}>
      <div
        className="item-selected"
        onClick={() => {
          setItemsVisibility(!itemsVisibility);
        }}
      >
        <p className="selected-title">{_selectedOption?.label ? _selectedOption.label : 'لا يتوفر اي خيارات'}</p>
        {itemsVisibility ? (
          <MdKeyboardArrowUp className="icon" />
        ) : (
          <MdKeyboardArrowDown className="icon" />
        )}
      </div>

      <div className={`items ${itemsVisibility ? "visible" : ""}`}>
        {options.map((option) => (
          <p
            key={option.value}
            className={`selector-item ${
              option.value === _selectedOption?.value
                ? "selector-item-selected"
                : ""
            }`}
            onClick={() => {
              setItemsVisibility(false);
              onSelect(option);
              setSelectedOption(option);
            }}
          >
            {option.label}
          </p>
        ))}
      </div>
    </div>
  );
}

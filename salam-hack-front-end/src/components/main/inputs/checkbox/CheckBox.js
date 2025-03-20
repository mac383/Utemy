import React from "react";
import "./checkBox.css";

export default function CheckBox({ title, checked, onChangeHandler }) {
  const onChange = (e) => {
    let newValue = e.target.checked;
    onChangeHandler(newValue);
  };

  return (
    <div className="checkbox-component">
      <input
        id="checkbox-input"
        className="checkbox-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />

      <label htmlFor="checkbox-input" className="checkbox-title">
        {title}
      </label>
    </div>
  );
}

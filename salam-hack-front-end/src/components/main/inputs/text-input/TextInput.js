import React from "react";
import "./textInput.css";
import { useState } from "react";

export default function TextInput({
  title,
  value,
  onChangeHandler,
  validateInput,
  onEnter,
  required = true,
  dir = "rtl",
}) {
  const [error, setError] = useState("");

  const onChange = (e) => {
    let newValue = e.target.value;

    if (validateInput(newValue)) {
      setError("");
    } else {
      setError(title + " غير صالح.");
    }

    onChangeHandler(newValue);
  };

  const handleEnterDown = (e) => {
    if (e.key === "Enter" && onEnter) onEnter();
  };

  return (
    <div className="text-input-component">
      <div className="input-box">
        <input
          id={title}
          className={`input ${dir}`}
          type="text"
          value={value}
          required={required}
          onChange={onChange}
          autoCapitalize="none"
          onKeyDown={handleEnterDown}
          autoComplete="off"
        />
        <span className="input-title">{title}</span>
      </div>
      <span className={`error-label ${error ? "visible" : ""}`}>{error}</span>
    </div>
  );
}

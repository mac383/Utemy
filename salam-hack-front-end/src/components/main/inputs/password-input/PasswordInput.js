import React from "react";
import "./passwordInput.css";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function PasswordInput({
  title,
  value,
  onChangeHandler,
  validateInput,
  onEnter,
}) {
  const [error, setError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const passwordId = Math.floor(Math.random() * (1 - 1000 + 1)) + 1;

  const onChange = (e) => {
    let newValue = e.target.value;

    if (validateInput(newValue)) {
      setError("");
    } else {
      if (newValue.length < 8)
        setError("كلمة المرور غير صحيحة (الحد الادنئ 8 احرف).");
      else if (newValue.length > 25)
        setError("كلمة المرور غير صحيحة (الحد الاقصئ 25 حرفاً).");
    }

    onChangeHandler(newValue);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleEnterDown = (e) => {
    if (e.key === "Enter" && onEnter) onEnter();
  };

  return (
    <div className="password-input-component">
      <div className="password-main-container">
        <div className="input-box">
          <input
            id={passwordId}
            className={`input`}
            type={isPasswordVisible ? "text" : "password"}
            value={value}
            required
            onChange={onChange}
            onKeyDown={handleEnterDown}
          />
          <span className="input-title">{title}</span>
        </div>
        <span
          className="toggle-password-visibility"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <MdVisibilityOff className="password-icon" />
          ) : (
            <MdVisibility className="password-icon" />
          )}
        </span>
      </div>
      <span className={`error-label ${error ? "visible" : ""}`}>{error}</span>
    </div>
  );
}

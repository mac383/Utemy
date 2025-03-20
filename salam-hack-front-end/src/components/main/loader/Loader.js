import React from "react";
import "./loader.css";

const Loader = ({ 
  isLoading = false, 
  text = "جاري التحميل...",
  variant = "pulse" // spinner, pulse, dots, circles
}) => {
  if (!isLoading) return null;

  const renderLoader = () => {
    switch(variant) {
      case "pulse":
        return (
          <div className="pulse-loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case "dots":
        return (
          <div className="dots-loader">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      case "circles":
        return (
          <div className="circles-loader">
            <div className="circle-group">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <div className="circle-group" style={{ transform: "rotate(45deg)" }}>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </div>
        );
      case "spinner":
      default:
        return (
          <div className="advanced-spinner">
            <svg className="circular" viewBox="25 25 50 50">
              <circle
                className="path-main"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                strokeWidth="4"
                strokeMiterlimit="10"
              />
            </svg>
            <svg className="orbital" viewBox="25 25 50 50">
              <circle
                className="path-orbital"
                cx="50"
                cy="50"
                r="16"
                fill="none"
                strokeWidth="2"
                strokeMiterlimit="10"
              />
            </svg>
            <div className="spinner-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`fullscreen-loader-overlay ${isLoading ? "visible" : ""}`}>
      <div className="fullscreen-loader-content">
        {renderLoader()}
        {text && <div className="loader-text">{text}</div>}
      </div>
    </div>
  );
};

export default Loader;
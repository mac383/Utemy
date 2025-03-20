import React from "react";
import "./button.css";

export default function Button({
  children,
  type = "button", // 'button', 'submit', 'reset'
  variant = "primary", // 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline', 'link', 'glass'
  size = "medium", // 'small', 'medium', 'large'
  rounded = false, // true, false
  elevated = true, // إضافة ظل: true, false
  loading = false, // حالة التحميل: true, false
  icon = null, // أيقونة يمكن تمريرها للزر
  iconPosition = "end", // 'start', 'end'
  disabled = false, // تعطيل الزر: true, false
  fullWidth = false, // عرض كامل: true, false
  onClick,
  className = "", // كلاسات CSS إضافية: string
  ...props // خصائص HTML أخرى مثل: id, name, data-attributes, aria-attributes
}) {
  // تكوين الكلاسات الأساسية للزر
  const buttonClasses = [
    "button",
    `button-${variant}`,
    `button-${size}`,
    rounded ? "button-rounded" : "",
    elevated ? "button-elevated" : "",
    loading ? "button-loading" : "",
    fullWidth ? "button-full-width" : "",
    disabled || loading ? "button-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="button-spinner"></span>}

      {icon && iconPosition === "start" && (
        <span className="button-icon button-icon-start">{icon}</span>
      )}

      {children && <span className="button-text">{children}</span>}

      {icon && iconPosition === "end" && (
        <span className="button-icon button-icon-end">{icon}</span>
      )}
    </button>
  );
}

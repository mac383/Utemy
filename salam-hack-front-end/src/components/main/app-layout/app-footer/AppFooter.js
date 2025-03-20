import React from "react";
import "./appFooter.css";
import { NavLink } from "react-router-dom";

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-section">
            <NavLink to="/" className="footer-logo">
              Utemy
            </NavLink>
            <p className="footer-description">
              تعلم بشكل أكثر ذكاءً! منصة تتيح لك إدارة دوراتك على اليوتيوب، تتبع
              تقدمك، وإضافة ملاحظاتك وملفاتك في مكان واحد.
            </p>
          </div>

          <div className="footer-links-section">
            <div className="footer-links-column">
              <h4 className="footer-column-title">روابط مهمة</h4>
              <nav className="footer-nav">
                <NavLink to="/faq" className="footer-link">
                  الاسئلة الشائعة
                </NavLink>
                <NavLink to="/privacy-policy" className="footer-link">
                  سياسة الخصوصية
                </NavLink>
                <NavLink to="/terms-of-use" className="footer-link">
                  شروط الاستخدام
                </NavLink>
                <NavLink to="/intellectual-property" className="footer-link">
                  حقوق الملكية الفكرية
                </NavLink>
              </nav>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-column-title">خدماتنا</h4>
              <nav className="footer-nav">
                <NavLink to="/service-1" className="footer-link">
                  الخدمة الأولى
                </NavLink>
                <NavLink to="/service-2" className="footer-link">
                  الخدمة الثانية
                </NavLink>
                <NavLink to="/service-3" className="footer-link">
                  الخدمة الثالثة
                </NavLink>
                <NavLink to="/service-4" className="footer-link">
                  الخدمة الرابعة
                </NavLink>
              </nav>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-column-title">تواصل معنا</h4>
              <div className="footer-contact-info">
                <p className="contact-item">
                  البريد الإلكتروني: info@utemy.com
                </p>
                <p className="contact-item">الهاتف: 9647763599662+</p>
                <p className="contact-item">العنوان: موصل، العراق</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} جميع الحقوق محفوظة
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import "./notFoundPage.css";
import Button from "../../components/main/inputs/button/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="eyes-container">
        <div className="eye right">
          <div className="pupil"></div>
        </div>
        <div className="eye left">
          <div className="pupil"></div>
        </div>
      </div>
      <h1 className="title">404 - الصفحة غير موجودة</h1>
      <p className="message">
        عذرًا، لم نتمكن من العثور على الصفحة التي كنت تبحث عنها. ربما تم نقلها
        أو حذفها.
        <br />
        يمكنك العودة إلى الصفحة الرئيسية أو التوجه إلى قسم آخر للحصول على
        المساعدة.
      </p>

      <Button variant="info" size="large" onClick={() => navigate(-1)}>
        رجوع
      </Button>
    </div>
  );
}

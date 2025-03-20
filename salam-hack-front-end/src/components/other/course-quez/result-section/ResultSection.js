import React from "react";
import "./resultSection.css";

export default function ResultSection({ results }) {
  return (
    <div className="result-container">
      <h2 className="result-title">النتيجة النهائية</h2>
      <div className="result-details">
        <p className="result-item">
          الاختيار من متعدد: <span>{results?.multipleChoice}/10</span>
        </p>
        <p className="result-item">
          الصح والخطأ: <span>{results?.trueFalse}/10</span>
        </p>
        <p className="result-item">
          النص المفتوح: <span>{results?.openText}/10</span>
        </p>
        <p className="result-total">
          المجموع الكلي: <span>{results?.total}/30</span>
        </p>
      </div>
    </div>
  );
}

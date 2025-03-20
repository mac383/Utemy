import React, { useState } from "react";
import "./multipleChoiceSection.css";

export default function MultipleChoiceSection({ questions, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // رسالة الخطأ

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
    setErrorMessage(""); // إخفاء رسالة الخطأ عند اختيار إجابة
  };

  const calculateScore = () => {
    let score = 0;
    questions?.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleNext = () => {
    // التحقق من وجود إجابة للسؤال الحالي
    if (answers[questions[currentQuestion].id] === undefined) {
      setErrorMessage("يجب اختيار إجابة قبل الانتقال إلى السؤال التالي.");
      return;
    }

    // الانتقال إلى السؤال التالي أو إنهاء الاختبار
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(calculateScore());
    }
  };

  // إضافة فحص إذا كانت الأسئلة غير موجودة أو فارغة
  if (!questions || questions.length === 0) {
    return <div className="loading-state">جاري تحميل الأسئلة...</div>;
  }

  return (
    <div className="multiple-choice-container">
      <h2 className="multiple-choice-title">الاختيار من متعدد</h2>
      <div className="question-container">
        <h3 className="question-text">{questions[currentQuestion]?.question}</h3>
        <div className="options-container">
          {questions[currentQuestion]?.options?.map((option, index) => (
            <label
              key={index}
              className={`option-label ${
                answers[questions[currentQuestion].id] === index ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name={`question-${questions[currentQuestion].id}`}
                checked={answers[questions[currentQuestion].id] === index}
                onChange={() =>
                  handleAnswer(questions[currentQuestion].id, index)
                }
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="next-button" onClick={handleNext}>
        {currentQuestion < questions.length - 1 ? "التالي" : "إنهاء"}
      </button>
    </div>
  );
}
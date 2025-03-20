import React, { useState } from "react";
import "./trueFalseSection.css";

export default function TrueFalseSection({ questions, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // رسالة الخطأ

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setErrorMessage(""); // إخفاء رسالة الخطأ عند اختيار إجابة
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.isTrue) {
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

  return (
    <div className="true-false-container">
      <h2 className="true-false-title">الصح والخطأ</h2>
      <div className="question-container">
        <h3 className="question-text">{questions[currentQuestion].question}</h3>
        <div className="options-container">
          <label
            className={`option-label ${
              answers[questions[currentQuestion].id] === true ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name={`question-${questions[currentQuestion].id}`}
              checked={answers[questions[currentQuestion].id] === true}
              onChange={() => handleAnswer(questions[currentQuestion].id, true)}
            />
            <span className="option-text">صح</span>
          </label>
          <label
            className={`option-label ${
              answers[questions[currentQuestion].id] === false ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name={`question-${questions[currentQuestion].id}`}
              checked={answers[questions[currentQuestion].id] === false}
              onChange={() => handleAnswer(questions[currentQuestion].id, false)}
            />
            <span className="option-text">خطأ</span>
          </label>
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="next-button" onClick={handleNext}>
        {currentQuestion < questions.length - 1 ? "التالي" : "إنهاء"}
      </button>
    </div>
  );
}
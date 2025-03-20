import React, { useState, useContext } from "react";
import { appContext } from "../../../../global/contexts/appContext";
import "./openTextSection.css";
import { getGptResponse } from "../../../../pages/lessonQuiz/lessonQuizLogic";

export default function OpenTextSection({ questions, onComplete }) {
  const { setLoader, setNotificationData } = useContext(appContext);

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setErrorMessage("");
  };

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]?.trim()) {
      setErrorMessage("يجب إدخال إجابة قبل الانتقال إلى السؤال التالي.");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      evaluateAnswersWithAI(answers);
    }
  };

  const evaluateAnswersWithAI = async (answers) => {
    const answersWithQuestions = questions.map((question) => ({
      question: question.question,
      answer: answers[question.id] || "لم يتم الإجابة",
    }));

    const prompt = `
  يرجى تصحيح الإجابات التالية وفقًا للتعليمات التالية:
  1. كل سؤال له درجتين فقط.
  2. قم بإرجاع الدرجة النهائية فقط (عدد صحيح) دون أي إضافات أو تفسيرات.
  
  الإجابات:
  ${answersWithQuestions
    .map(
      (item, index) =>
        `السؤال ${index + 1}: ${item.question}\nالإجابة: ${item.answer}`
    )
    .join("\n\n")}
  `;

    const aiResponse = await getGptResponse(
      prompt,
      setLoader,
      setNotificationData
    );

    const score = extractScoreFromAIResponse(aiResponse);

    console.log(score);

    onComplete(score);
  };

  const extractScoreFromAIResponse = (aiResponse) => {
    const scoreMatch = aiResponse.match(/\d+/);
    if (scoreMatch) {
      return parseInt(scoreMatch[0], 10);
    }
    return 0;
  };

  return (
    <div className="open-text-container">
      <h2 className="open-text-title">النص المفتوح</h2>
      <div className="question-container">
        <h3 className="question-text">{questions[currentQuestion].question}</h3>
        <textarea
          className="answer-textarea"
          value={answers[questions[currentQuestion].id] || ""}
          onChange={(e) =>
            handleAnswer(questions[currentQuestion].id, e.target.value)
          }
          placeholder="اكتب إجابتك هنا..."
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="next-button" onClick={handleNext}>
        {currentQuestion < questions.length - 1 ? "التالي" : "إنهاء"}
      </button>
    </div>
  );
}

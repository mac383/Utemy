import React, { useEffect, useState, useContext } from "react";
import "./courseQuiz.css";
import { appContext } from "../../global/contexts/appContext";
import { getPageDetails } from "../../global/utils/functions";
import MultipleChoiceSection from "../../components/other/course-quez/multiple-choiceSection/MultipleChoiceSection";
import TrueFalseSection from "../../components/other/course-quez/trueFalse-section/TrueFalseSection";
import OpenTextSection from "../../components/other/course-quez/open-text-section/OpenTextSection";
import ResultSection from "../../components/other/course-quez/result-section/ResultSection";
import { getExamData } from "./courseQuizLogic";

export default function CourseQuiz() {
  const { setLoader, setNotificationData } = useContext(appContext);
  const [pageDetails, setPageDetails] = useState(getPageDetails()?.courseExam);
  const [examData, setExamData] = useState(null);
  const [currentStage, setCurrentStage] = useState("multipleChoice"); // مراحل: multipleChoice, trueFalse, openText, result
  const [results, setResults] = useState({
    multipleChoice: 0,
    trueFalse: 0,
    openText: 0,
    total: 0,
  });

  // تحميل بيانات الامتحان
  useEffect(() => {
    const fetchExamData = async () => {
      const data = await getExamData(
        pageDetails?.courseTitle,
        setLoader,
        setNotificationData
      );
      setExamData(data);
    };
    fetchExamData();
  }, [pageDetails?.courseTitle]);

  // الانتقال إلى المرحلة التالية
  const goToNextStage = () => {
    if (currentStage === "multipleChoice") {
      setCurrentStage("trueFalse");
    } else if (currentStage === "trueFalse") {
      setCurrentStage("openText");
    } else if (currentStage === "openText") {
      setCurrentStage("result");
    }
  };

  // تحديث النتائج
  const updateResults = (stage, score) => {
    setResults((prev) => ({
      ...prev,
      [stage]: score,
      total: prev.total + score,
    }));
  };

  return (
    <div className="course-quiz-container">
      <h1 className="course-quiz-title">{pageDetails?.courseTitle}</h1>

      {!examData ? (
        <div className="loading-state">جاري تحميل بيانات الاختبار...</div>
      ) : (
        <>
          {currentStage === "multipleChoice" &&
          examData?.multipleChoice &&
          examData.multipleChoice.length > 0 ? (
            <MultipleChoiceSection
              questions={examData.multipleChoice}
              onComplete={(score) => {
                updateResults("multipleChoice", score);
                goToNextStage();
              }}
            />
          ) : (
            currentStage === "multipleChoice" && (
              <div className="quiz-section">
                <p className="quiz-section-message">
                  لا توجد أسئلة اختيار متعدد متاحة
                </p>
                <button className="quiz-button" onClick={() => goToNextStage()}>
                  الانتقال للقسم التالي
                </button>
              </div>
            )
          )}

          {currentStage === "trueFalse" &&
          examData?.trueFalse &&
          examData.trueFalse.length > 0 ? (
            <TrueFalseSection
              questions={examData.trueFalse}
              onComplete={(score) => {
                updateResults("trueFalse", score);
                goToNextStage();
              }}
            />
          ) : (
            currentStage === "trueFalse" && (
              <div className="quiz-section">
                <p className="quiz-section-message">
                  لا توجد أسئلة صح/خطأ متاحة
                </p>
                <button className="quiz-button" onClick={() => goToNextStage()}>
                  الانتقال للقسم التالي
                </button>
              </div>
            )
          )}

          {currentStage === "openText" &&
          examData?.openText &&
          examData.openText.length > 0 ? (
            <OpenTextSection
              questions={examData.openText}
              onComplete={async (scorePromise) => {
                const score = await scorePromise; // انتظر تحقق الوعد
                updateResults("openText", score); // قم بتحديث النتائج بالقيمة الفعلية
                goToNextStage();
              }}
            />
          ) : (
            currentStage === "openText" && (
              <div className="quiz-section">
                <p className="quiz-section-message">
                  لا توجد أسئلة إجابات مفتوحة متاحة
                </p>
                <button className="quiz-button" onClick={() => goToNextStage()}>
                  عرض النتائج
                </button>
              </div>
            )
          )}

          {currentStage === "result" && <ResultSection results={results} />}
        </>
      )}
    </div>
  );
}

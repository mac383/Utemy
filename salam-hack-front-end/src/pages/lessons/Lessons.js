import React, { useState, useEffect, useContext } from "react";
import { appContext } from "../../global/contexts/appContext";
import "./lessons.css";
import { getPageDetails, logPageDetails } from "../../global/utils/functions";
import { useNavigate } from "react-router-dom";
import { getPlayListsByID } from "./lessonsLogic";

export default function Lessons() {
  const { setLoader } = useContext(appContext);
  const pageDetails = getPageDetails().selectedCourse;
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLessons = async () => {
      setLessons(await getPlayListsByID(pageDetails?.listId, setLoader));
    };

    fetchLessons();
  }, []);

  const handleLessonClick = (lessonId, lessonTitle) => {
    // Navigate to lesson view page
    logPageDetails("selectedLesson", {
      lessonId: lessonId,
      playlistId: pageDetails?.listId,
      playlistTitle: pageDetails?.playlistTitle,
    });
    navigate(`/lesson/${lessonTitle}`);
  };

  const handleExamClick = () => {
    logPageDetails("courseExam", { courseTitle: pageDetails?.playlistTitle });
    isFullyCompleted && navigate(`/exam`);
  };

  const completedLessons = lessons.filter(
    (lesson) => lesson.isCompleted
  ).length;
  const completionPercentage =
    lessons.length > 0
      ? Math.round((completedLessons / lessons.length) * 100)
      : pageDetails.completionRate;

  const isFullyCompleted = completionPercentage === 100;
  //  completionPercentage === 100;

  return (
    <div className="lessons-container" dir="rtl">
      {/* Course Details Section */}
      <div className="course-details">
        <div className="course-header">
          <div className="course-image">
            <img src={pageDetails.coverURL} alt={pageDetails.playlistTitle} />
          </div>
          <div className="course-info">
            <h1 className="course-title">{pageDetails.playlistTitle}</h1>
            <div className="course-meta">
              <span className="meta-item">
                <i className="icon-lessons"></i>
                {pageDetails.lessonsCount} درس
              </span>
              <a
                href={pageDetails.playlistURL}
                target="_blank"
                rel="noopener noreferrer"
                className="playlist-link"
              >
                مشاهدة على YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-label">
            <span>تقدم الدورة</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Exam Button - Only show if course is completed */}
        <div className="exam-section">
          <button
            className={`exam-button ${isFullyCompleted ? "" : "disabled"}`}
            onClick={handleExamClick}
          >
            الذهاب إلى الامتحان النهائي
          </button>
          <p className="exam-note">
            {isFullyCompleted ? (
              <>
                اختبر معلوماتك مع{" "}
                <span className="ai-text">الذكاء الاصطناعي</span>! لقد أكملت
                جميع الدروس، يمكنك الآن التوجه للامتحان النهائي.
              </>
            ) : (
              <>
                لم تكتمل جميع الدروس بعد. أكمل الدروس أولاً لتتمكن من اختبار
                معلوماتك مع <span className="ai-text">الذكاء الاصطناعي</span>.
              </>
            )}
          </p>
        </div>
      </div>
      {/* Lessons List Section */}
      <div className="lessons-list">
        <h2 className="lessons-section-title">محتوى الدورة</h2>
        <ul className="lesson-items">
          {lessons.map((lesson, index) => (
            <li
              key={lesson.lessonId}
              className={`lesson-item ${lesson.isCompleted ? "completed" : ""}`}
              onClick={() =>
                handleLessonClick(lesson?.lessonId, lesson?.lessonTitle)
              }
            >
              <div className="lesson-number">{index + 1}</div>
              <div className="lesson-content">
                <h3 className="lesson-title">{lesson.lessonTitle}</h3>
                {lesson.lessonNote && (
                  <p className="lesson-note">{lesson.lessonNote}</p>
                )}
              </div>
              <div className="lesson-status">
                {lesson.isCompleted ? (
                  <span className="status-completed">تم الإكمال</span>
                ) : (
                  <span className="status-pending">لم يكتمل</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

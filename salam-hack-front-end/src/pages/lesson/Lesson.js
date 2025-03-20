import React, { useState, useEffect, useContext, useRef } from "react";
import { appContext } from "../../global/contexts/appContext";
import "./lesson.css";
import { useNavigate } from "react-router-dom";
import { getPageDetails, logPageDetails } from "../../global/utils/functions";
import AIStudyHelper from "../../components/other/ai-study-helper/AIStudyHelper";
import {
  getLessonById,
  setAsCompletedLesson,
  setLessonNotes,
  setLessonFile,
} from "./lessonLogic";
import { getPlayListsByID } from "../lessons/lessonsLogic";
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";

export default function Lesson() {
  const navigate = useNavigate();
  const { setLoader, setNotificationData } = useContext(appContext);
  const lessonContentRef = useRef(null);

  const [pageDetails, setPageDetails] = useState({
    lessonId: getPageDetails().selectedLesson?.lessonId,
    playlistId: getPageDetails().selectedLesson?.playlistId,
    playlistTitle: getPageDetails().selectedLesson?.playlistTitle,
  });

  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonNote, setLessonNote] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // تحميل البيانات عند بدء المكون
  useEffect(() => {
    const fetchLessons = async () => {
      const lesson = await getLessonById(pageDetails?.lessonId, setLoader);
      setCurrentLesson(lesson);
      setLessonNote(lesson?.lessonNote || "");
      setFileTitle(lesson?.fileTitle || "");
      setFileURL(lesson?.fileURL || "");

      const allLessons = await getPlayListsByID(pageDetails?.playlistId);
      setLessons(allLessons);
    };
    fetchLessons();
  }, [pageDetails?.lessonId]);

  // اختيار درس آخر
  const selectLesson = (lessonId) => {
    setPageDetails((prev) => ({
      ...prev,
      lessonId,
    }));

    // حفظ الدرس المختار في local storage
    logPageDetails("selectedLesson", {
      lessonId: lessonId,
      playlistId: pageDetails?.playlistId,
      playlistTitle: pageDetails?.playlistTitle,
    });

    // إغلاق الشريط الجانبي في الشاشات الصغيرة
    setSidebarOpen(false);

    // التمرير إلى أعلى المحتوى
    if (lessonContentRef.current) {
      lessonContentRef.current.scrollTop = 0;
    }
  };

  // حفظ الملاحظة
  const saveNote = async () => {
    await setLessonNotes(
      currentLesson?.lessonId,
      lessonNote,
      setLoader,
      setNotificationData
    );
  };

  // حفظ الملف المرفق
  const saveAttachment = async () => {
    await setLessonFile(
      currentLesson?.lessonId,
      fileTitle,
      fileURL,
      setLoader,
      setNotificationData
    );
  };

  // إكمال الدرس والانتقال إلى الدرس التالي
  const completeAndNext = async () => {
    try {
      await setAsCompletedLesson(currentLesson?.lessonId, setLoader);

      // البحث عن الدرس التالي
      const currentIndex = lessons.findIndex(
        (lesson) => lesson.lessonId === currentLesson.lessonId
      );
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        selectLesson(nextLesson.lessonId);
      } else {
        // إذا كان هذا آخر درس في القائمة
        setNotificationData({
          type: "info",
          title: "تم اكمال الدورة",
          details: "مبروك! لقد أكملت جميع الدروس في هذه القائمة",
          visibility: true,
        });
      }
    } catch {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "حدث خطأ أثناء تحديث حالة الدرس",
        visibility: true,
      });
    }
  };

  // التحقق مما إذا كان الدرس مكتملاً
  const isCurrentLessonCompleted = currentLesson?.isCompleted || false;

  // الحصول على رقم الدرس الحالي
  const getCurrentLessonNumber = () => {
    if (!lessons.length || !currentLesson) return "";
    const index = lessons.findIndex(
      (lesson) => lesson.lessonId === currentLesson.lessonId
    );
    return index > -1 ? `(${index + 1}/${lessons.length})` : "";
  };

  // إذا لم يتم تحميل الدرس بعد
  if (!currentLesson) {
    return (
      <div className="lesson-loading">
        <div className="loader"></div>
        <p>جاري تحميل الدرس...</p>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      {/* شريط العنوان */}
      <div className="lesson-header">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="lesson-title">
          {currentLesson.lessonTitle}
          <span className="lesson-number">{getCurrentLessonNumber()}</span>
        </h1>
      </div>

      <div className="lesson-content-wrapper">
        {/* القائمة الجانبية */}
        <div className={`lesson-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>قائمة الدروس</h3>
            <button
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
              aria-label="إغلاق القائمة"
            >
              &times;
            </button>
          </div>
          <ul className="lessons-list">
            {lessons.map((lesson) => (
              <li
                key={lesson.lessonId}
                className={`lesson-item ${
                  lesson.lessonId === currentLesson.lessonId ? "active" : ""
                } ${lesson.isCompleted ? "completed" : ""}`}
                onClick={() => selectLesson(lesson.lessonId)}
              >
                <span className="lesson-status">
                  {lesson.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                </span>
                <span className="lesson-item-title">{lesson.lessonTitle}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* محتوى الدرس الرئيسي */}
        <div className="lesson-content" ref={lessonContentRef}>
          {/* فيديو الدرس */}
          <div className="lesson-video-container">
            <iframe
              className="lesson-video"
              src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
              title={currentLesson.lessonTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          {/* أزرار الإجراءات */}
          <div className="lesson-actions">
            <button
              className={`btn complete-btn ${
                isCurrentLessonCompleted ? "completed" : ""
              }`}
              onClick={completeAndNext}
            >
              {isCurrentLessonCompleted
                ? "تم الإكمال - التالي"
                : "إكمال الدرس والانتقال للتالي"}
            </button>
            <button
              className="btn quiz-btn"
              onClick={() => {
                logPageDetails("lessonQuiz", {
                  lessonTitle: currentLesson?.lessonTitle,
                  playlistTitle: pageDetails?.playlistTitle,
                });
                navigate(`/lessonQuiz`);
              }}
            >
              بدء الاختبار
            </button>
          </div>
          <AIStudyHelper
            lessonTitle={currentLesson?.lessonTitle}
            courseTitle={pageDetails?.playlistTitle}
          />

          {/* قسم الملاحظات */}
          <div className="lesson-notes-section">
            <h3>الملاحظات</h3>
            <textarea
              className="lesson-notes-textarea"
              placeholder="أضف ملاحظاتك هنا..."
              value={lessonNote}
              onChange={(e) => setLessonNote(e.target.value)}
            ></textarea>
            <button className="btn save-note-btn" onClick={saveNote}>
              حفظ الملاحظة
            </button>
          </div>

          {/* قسم المرفقات */}
          <div className="lesson-attachments-section">
            <h3>الملفات المرفقة</h3>

            <div className="attachment-input-group">
              <input
                type="text"
                className="attachment-input"
                placeholder="عنوان الملف"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
              />
              <input
                type="text"
                className="attachment-input"
                placeholder="رابط الملف (PDF)"
                value={fileURL}
                onChange={(e) => setFileURL(e.target.value)}
              />
              <button
                className="btn save-attachment-btn"
                onClick={saveAttachment}
              >
                حفظ المرفق
              </button>
            </div>

            {currentLesson.fileURL && (
              <div className="current-attachment">
                <h4>الملف الحالي:</h4>
                <a
                  href={currentLesson.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="attachment-link"
                >
                  {currentLesson.fileTitle || "ملف مرفق"}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

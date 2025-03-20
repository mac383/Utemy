import React, { useEffect, useState, useContext } from "react";
import { appContext } from "../../global/contexts/appContext";
import "./courses.css";
import { getCoursesByUser, addUserPlaylist } from "./coursesLogic";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logPageDetails } from "../../global/utils/functions";

export default function Courses() {
  const userId = useSelector((state) => state.currentUser?.userId);
  const { setLoader, setNotificationData } = useContext(appContext);
  const [courses, setCourses] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetching = async () => {
      setCourses(await getCoursesByUser(userId, setLoader));
    };

    fetching();
  }, [flag]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [youtubeURL, setYoutubeURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle YouTube URL input change
  const handleYoutubeURLChange = (e) => {
    setYoutubeURL(e.target.value);
    setError("");
  };

  // Function to extract playlist ID from YouTube URL
  const extractPlaylistId = (url) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      return params.get("list");
    } catch (error) {
      return null;
    }
  };

  // Function to validate if URL is a YouTube playlist
  const isValidYoutubePlaylist = (url) => {
    return url.includes("youtube.com/playlist") && extractPlaylistId(url);
  };

  // Add new course based on YouTube URL
  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!youtubeURL.trim()) {
      setError("الرجاء إدخال رابط قائمة التشغيل");
      return;
    }

    if (!isValidYoutubePlaylist(youtubeURL)) {
      setError("الرابط غير صالح. الرجاء التأكد من أنه رابط قائمة تشغيل يوتيوب");
      return;
    }

    try {
      await addUserPlaylist(userId, youtubeURL, setLoader, setNotificationData);

      setYoutubeURL("");
      setShowAddForm(false);
      setFlag(!flag);
    } catch (error) {
      setError("حدث خطأ أثناء إضافة الكورس. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2 className="courses-title">الدورات التعليمية</h2>
        <button
          className="add-course-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "إلغاء" : "إضافة دورة جديدة"}
        </button>
      </div>

      {/* Simplified Add Course Form - at the top of the page */}
      {showAddForm && (
        <div className="add-course-form-container simplified">
          <form
            onSubmit={handleAddCourse}
            className="add-course-form simplified"
          >
            <div className="form-group full-width">
              <label htmlFor="youtubeURL">رابط قائمة التشغيل على يوتيوب</label>
              <div className="input-with-button">
                <input
                  type="url"
                  id="youtubeURL"
                  name="youtubeURL"
                  value={youtubeURL}
                  onChange={handleYoutubeURLChange}
                  placeholder="مثال: https://youtube.com/playlist?list=..."
                  required
                  className="youtube-url-input"
                />
                <button
                  type="submit"
                  className="submit-course-btn inline"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الإضافة..." : "إضافة الدورة"}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
              <p className="form-hint">
                أدخل رابط قائمة التشغيل فقط وسيتم استخراج تفاصيل الدورة تلقائياً
              </p>
            </div>
          </form>
        </div>
      )}
      <div className="courses-grid">
        {courses.map((course, index) => (
          <div
            key={index}
            className={`course-card ${course.isCompleted ? "completed" : ""}`}
          >
            <div className="course-image-container">
              <img
                src={course.coverURL}
                alt={course.playlistTitle}
                className="course-image"
              />
              <div className="course-completion-overlay">
                <div
                  className="course-completion-bar"
                  style={{ width: `${course.completionRate}%` }}
                ></div>
              </div>
              {course.isCompleted && (
                <div className="course-completed-badge">
                  <span>مكتمل</span>
                </div>
              )}
            </div>

            <div className="course-details">
              <h3 className="course-title">{course.playlistTitle}</h3>

              <div className="course-meta">
                <span className="course-progress">
                  <span className="progress-text">
                    {course.completionRate}%
                  </span>
                </span>
                <span className="course-lessons">
                  {course.lessonsCount} درس
                </span>
              </div>

              <div className="course-actions">
                <a
                  href={course.playlistURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-link-btn"
                >
                  المشاهدة علئ يوتيوب
                </a>
                <Link
                  to={`/course/${course?.playlistTitle}`}
                  className="course-link-btn"
                  onClick={() => {
                    logPageDetails("selectedCourse", course);
                  }}
                >
                  متابعة
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

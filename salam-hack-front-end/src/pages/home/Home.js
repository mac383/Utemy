import React, { useState, useEffect, useContext } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import homeImage from "../../images/homeImage.webp";
import { useSelector } from "react-redux";
import getCoursesByKeywords from "./coursesData";
import getChannelsByKeywords from "./channelsData";
import { addUserPlaylist } from "../courses/coursesLogic";
import { appContext } from "../../global/contexts/appContext";
import { Link } from "react-router-dom";
export default function Home() {
  const user = useSelector((state) => state.currentUser);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courses, setCourses] = useState([]);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate();
  const { setNotificationData, setLoader } = useContext(appContext);

  // Sample data from your JSON files

  useEffect(() => {
    setIsLoggedIn(user?.userId ? true : false);
  }, [user]);

  useEffect(() => {
    const userFields = user?.fields?.map((item) => item?.name) ?? [];
    if (!isLoggedIn) {
      setCourses(getCoursesByKeywords(["برمجة", "تصميم", "تسويق"]));
      setChannels(getChannelsByKeywords(["برمجة", "تصميم", "تسويق"]));
    } else {
      setCourses(getCoursesByKeywords(userFields));
      setChannels(getChannelsByKeywords(userFields));
    }
  }, [isLoggedIn]);

  // Your progress stats
  const stats = [
    { id: 1, title: "الدورات المضافة", value: 12, icon: "📘" }, // تغيير أيقونة الدورات المضافة
    { id: 2, title: "الدورات المكتملة", value: 87, icon: "🏆" }, // تغيير أيقونة الدورات المكتملة
    { id: 3, title: "الملفات المضافة", value: 42, icon: "📂" }, // تغيير أيقونة الملفات المضافة
    { id: 4, title: "الملاحظات المضافة", value: 24, icon: "💬" }, // تغيير أيقونة الملاحظات المضافة
  ];

  const levelMapping = {
    easy: "سهل",
    mid: "متوسط",
    hard: "صعب",
  };

  async function handleNewCourse(playlistURL) {
    await addUserPlaylist(
      user?.userId,
      playlistURL,
      setLoader,
      setNotificationData
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>تعلم بطريقة أذكى</h1>
          <p>منصة تعليمية مبنية على الذكاء الاصطناعي لمساعدتك في رحلة التعلم</p>
          <div className="hero-cta">
            {!isLoggedIn && (
              <button
                className="primary-button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                تسجيل الدخول
              </button>
            )}
            <a href="#courses">
              <button className="secondary-button">استكشاف الدورات</button>
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src={homeImage} alt="تعلم البرمجة" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <h3 className="stat-value">{isLoggedIn ? stat.value : "0"}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="section">
        <div className="section-header">
          <h2 className="section-title">دورات مقترحة</h2>
        </div>

        <div className="courses-grid">
          {courses.map((category, categoryIndex) =>
            category?.map((course, courseIndex) => (
              <div
                key={`${categoryIndex}-${courseIndex}`}
                className="course-card"
              >
                <div className="course-thumbnail">
                  <img
                    src={course?.image_url}
                    alt={course?.title}
                    loading="lazy"
                  />
                  <div className="course-overlay">
                    {isLoggedIn ? (
                      <button
                        onClick={async () => {
                          await handleNewCourse(course?.playlist_url);
                        }}
                        className="add-to-library"
                      >
                        <i className="fas fa-plus-circle"></i> إضافة إلى دوراتي
                      </button>
                    ) : (
                      <button
                        className="login-button"
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        <i className="fas fa-sign-in-alt"></i> تسجيل الدخول
                      </button>
                    )}
                  </div>
                </div>
                <div className="course-info">
                  <h3 className="course-title">{course?.title}</h3>
                  <div className="course-meta">
                    <div className="course-meta-item">
                      <i className="fas fa-book"></i>
                      <span>{course?.lessons_count} درس</span>
                    </div>
                    <div className="course-meta-item">
                      <i className="fas fa-signal"></i>
                      <span>{levelMapping[course?.level] || "غير محدد"}</span>
                    </div>
                  </div>
                  <a
                    href={course.playlist_url}
                    className="course-playlist"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-youtube"></i> مشاهدة على يوتيوب
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* My Learning Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">تعلمي الحالي</h2>
          {isLoggedIn && (
            <Link to="/courses" className="view-all">
              عرض الكل
            </Link>
          )}
        </div>

        <div className="my-learning-container">
          {isLoggedIn ? (
            <>
              <div className="current-course">
                <img
                  src={courses[0].imageURL}
                  alt={courses[0].name}
                  className="course-thumbnail"
                />
                <div className="course-info">
                  <h3 className="course-title">{courses[0].name}</h3>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: "45%" }}></div>
                    </div>
                    <span className="progress-text">45% مكتمل</span>
                  </div>
                  <button
                    className="continue-button"
                    onClick={() => {
                      navigate("/courses");
                    }}
                  >
                    استئناف التعلم
                  </button>
                </div>
              </div>

              <div className="learning-stats">
                <div className="stat-box">
                  <h4>7</h4>
                  <p>دروس متبقية</p>
                </div>
                <div className="stat-box">
                  <h4>12</h4>
                  <p>دروس مكتملة</p>
                </div>
                <div className="stat-box">
                  <h4>2.5</h4>
                  <p>ساعات</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-learning-yet">
              <h3>
                لم تباشر بعد{" "}
                <Link to={"/registration"} className="start-learning">
                  ابدأ ألان
                </Link>
              </h3>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Channels */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">قنوات مقترحة</h2>
        </div>

        <div className="channels-grid">
          {channels?.length > 0 ? (
            channels.map((channel) => (
              <a
                href={channel?.channelURL}
                className="channel-card"
                key={channel?.channelURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={channel?.channelImageURL}
                  alt={channel?.name}
                  className="channel-image"
                  loading="lazy"
                />
                <h3 className="channel-name">{channel?.name}</h3>
                <p className="channel-info">قناة تعليمية</p>
                <button className="follow-button">متابعة</button>
              </a>
            ))
          ) : (
            <p className="no-channels">لا توجد قنوات متاحة</p>
          )}
        </div>
      </section>

      {/* Features */}
      <div className="features-container">
        <div className="feature-item">
          <span className="feature-icon">🎬</span>
          <h3 className="feature-title">إضافة قوائم تشغيل من اليوتيوب</h3>
          <p className="feature-description">
            دمج قوائم تشغيل اليوتيوب لتسهيل متابعة الدورات التعليمية
          </p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">🤖</span>
          <h3 className="feature-title">مساعد ذكي</h3>
          <p className="feature-description">
            دعم تعليمي متقدم باستخدام تقنيات الذكاء الاصطناعي مع صفحة دردشة
            تفاعلية
          </p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">📝</span>
          <h3 className="feature-title">إضافة ملاحظات</h3>
          <p className="feature-description">
            تدوين ملاحظات خاصة بكل درس مع إمكانية تنظيمها وتنسيقها
          </p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">📁</span>
          <h3 className="feature-title">إضافة ملفات</h3>
          <p className="feature-description">
            إرفاق ملفات PDF وموارد تعليمية متنوعة لتعزيز المحتوى
          </p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">📊</span>
          <h3 className="feature-title">امتحانات لكل درس</h3>
          <p className="feature-description">
            اختبارات قصيرة بعد كل درس لقياس مدى استيعاب المعلومات
          </p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">🎯</span>
          <h3 className="feature-title">امتحانات شاملة</h3>
          <p className="feature-description">
            تقييم شامل على مستوى كل دورة لتعزيز التعلم وقياس المهارات المكتسبة
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>ابدأ رحلة التعلم الآن</h2>
          <p>قم بإضافة قوائم التشغيل الخاصة بك واستفد من مميزات المنصة</p>
          {isLoggedIn ? (
            <button
              className="primary-button"
              onClick={() => {
                navigate("/courses");
              }}
            >
              إضافة قائمة تشغيل
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={() => {
                navigate("/registration");
              }}
            >
              سجل الان
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

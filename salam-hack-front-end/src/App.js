import React, { useContext, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./global/reducers/currentUserReducer";

// Styles
import "./App.css";
import "./fonts/invoke_fonts.css";

// Contexts
import { useNotification } from "./global/contexts/notificationContext";
import { appContext } from "./global/contexts/appContext";

// Components
import AppLayout from "./components/main/app-layout/app-layout/AppLayout";
import Loader from "./components/main/loader/Loader";
import Modal from "./components/main/modal/Modal";

// Lazy-loaded Pages
const Home = lazy(() => import("./pages/home/Home"));
const Notes = lazy(() => import("./pages/notes/Notes"));
const Files = lazy(() => import("./pages/files/Files"));
const Courses = lazy(() => import("./pages/courses/Courses"));
const Faq = lazy(() => import("./pages/faq/Faq"));
const PrivacyPolicy = lazy(() =>
  import("./pages/privacy-policy/PrivacyPolicy")
);
const TermsOfUse = lazy(() => import("./pages/terms-of-use/TermsOfUse"));
const IntellectualProperty = lazy(() =>
  import("./pages/intellectual-property/IntellectualProperty")
);
const NotFoundPage = lazy(() => import("./pages/not-found-page/NotFoundPage"));
const Registration = lazy(() => import("./pages/registration/Registration"));
const Login = lazy(() => import("./pages/login/Login"));
const Lessons = lazy(() => import("./pages/lessons/Lessons"));
const Lesson = lazy(() => import("./pages/lesson/Lesson"));
const LessonQuiz = lazy(() => import("./pages/lessonQuiz/LessonQuiz"));
const Dhafer = lazy(() => import("./pages/dhafer/dhafer-main/Dhafer"));
const CourseQuiz = lazy(() => import("./pages/courseQuiz/CourseQuiz"));
const UserProfile = lazy(() => import("./pages/user-profile/UserProfile"));

/**
 * Component to handle authenticated routes with fallback behavior
 */
const ProtectedRoute = ({ children, isHomePage = false }) => {
  const { setModal } = useContext(appContext);
  const isLoggedIn = useSelector((state) => Boolean(state.currentUser?.userId));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status
    if (!isLoggedIn) {
      try {
        const user = JSON.parse(sessionStorage.getItem("currentUser"));
        if (user?.userId) {
          dispatch(setCurrentUser(user));
        } else if (!isHomePage) {
          // Show session lost message only for protected pages
          setModal({
            title: "فقدان الجلسة",
            details:
              "لقد فقدت الجلسة الحالية. يرجى تسجيل الدخول مجددًا للوصول إلى هذه الصفحة.",
            visibility: true,
          });
          navigate("/login");
        }
      } catch (error) {
        console.error("Error retrieving user session:", error);
        if (!isHomePage) {
          navigate("/login");
        }
      }
    }
  }, [isLoggedIn, dispatch, navigate, setModal, isHomePage]);

  // Return appropriate content based on authentication and page type
  if (isLoggedIn) {
    return children;
  } else if (isHomePage) {
    return (
      <AppLayout>
        <Home />
      </AppLayout>
    );
  }

  return null;
};

/**
 * Main application component
 */
function App() {
  const location = useLocation();
  const userSettings = useSelector((state) => state.currentUser?.settings);
  const notification = useNotification();
  const { notificationData, modal, setModal, loader } = useContext(appContext);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Handle notifications
  useEffect(() => {
    if (notificationData?.visibility) {
      notification[notificationData.type]({
        message: notificationData.title,
        description: notificationData.details,
      });
    }
  }, [notification, notificationData]);

  // Page loading fallback
  const fallbackLoader = (
    <div className="page-loading">
      <Loader isLoading={true} />
    </div>
  );

  return (
    <div className={`App ${userSettings?.theme || "light"}`}>
      {/* Global UI elements */}
      <Loader isLoading={loader} />
      <Modal modal={modal} setModal={setModal} />

      {/* Route configuration */}
      <Suspense fallback={fallbackLoader}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<p>forget password</p>} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route
            path="/intellectual-property"
            element={<IntellectualProperty />}
          />

          {/* Home Page with special handling */}
          <Route
            path="/"
            element={
              <ProtectedRoute isHomePage={true}>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Courses />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/:courseTitle"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Lessons />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lesson/:lessonTitle"
            element={
              <ProtectedRoute>
                {/* <AppLayout> */}
                <Lesson />
                {/* </AppLayout> */}
              </ProtectedRoute>
            }
          />

          <Route
            path="/lessonQuiz"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LessonQuiz />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CourseQuiz />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                {/* <AppLayout> */}
                <Dhafer />
                {/* </AppLayout> */}
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Notes />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Files />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                {/* <AppLayout> */}
                  <UserProfile />
                {/* </AppLayout> */}
              </ProtectedRoute>
            }
          />

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

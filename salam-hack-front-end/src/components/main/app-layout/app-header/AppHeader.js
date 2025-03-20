import React, { useState } from "react";
import "./appHeader.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  resetCurrentUser,
  setSettings,
} from "../../../../global/reducers/currentUserReducer";
import { Avatar } from "antd";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { Dropdown } from "antd";
import { logThemeToLocalStorage } from "../../../../global/utils/functions";

export default function AppHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.currentUser.userId);
  const userSettings = useSelector((state) => state.currentUser?.settings);
  const userFullName = useSelector((state) => state.currentUser.fullName);
  const userProfileURL = useSelector(
    (state) => state.currentUser.profileImageURL
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const items = [
    {
      key: "1",
      label: "الملف الشخصي",
    },
    {
      key: "2",
      label: "تغيير الثيم",
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "تسجيل الخروج",
    },
  ];

  const handleLogout = () => {
    dispatch(resetCurrentUser());
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        navigate("/my-profile");
        break;
      case "2":
        if (userSettings?.theme === "light") {
          logThemeToLocalStorage("dark");
          dispatch(setSettings({ settings: { theme: "dark" } }));
        } else if (userSettings?.theme === "dark") {
          logThemeToLocalStorage("light");
          dispatch(setSettings({ settings: { theme: "light" } }));
        }
        break;
      case "3":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <span>U</span>temy
          </Link>
        </div>

        {menuOpen ? (
          <IoClose className="menu-toggle" onClick={toggleMenu} />
        ) : (
          <IoMenu className="menu-toggle" onClick={toggleMenu} />
        )}

        <div
          className={`menu-container ${menuOpen ? "open" : ""} ${
            userId ? "" : "end"
          }`}
        >
          <nav className={`nav-menu ${userId ? "" : "hidden"}`}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              الصفحة الرئيسية
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              الدورات
            </NavLink>

            <NavLink
              to="/ai"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              المعلم الذكي
            </NavLink>

            <NavLink
              to="/notes"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              الملاحظات
            </NavLink>
            <NavLink
              to="/files"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              الملفات
            </NavLink>
          </nav>
          <div className={`close-header-nav`}>
            {/* <img src={logo} alt="logo" /> */}
            {userId ? (
              <p>اختر القسم الذي تريد الوصول إليه من القائمة.</p>
            ) : (
              <p>
                للتتمكن من الوصول إلى المحتوى الكامل، يرجى تسجيل الدخول أو إنشاء
                حساب جديد.
              </p>
            )}
          </div>
          <div className={`header-actions ${userId ? "hidden" : ""}`}>
            <Link to={"/login"}>
              <button className="action-button"> تسجيل الدخول</button>
            </Link>
            <Link to={"/registration"}>
              <button className="action-button primary">تسجيل جديد</button>
            </Link>
          </div>
          <div className={`user-avater ${userId ? "" : "hidden"}`}>
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick,
              }}
            >
              <div className="user-avater">
                {userProfileURL ? (
                  <Avatar
                    size={48}
                    src={userProfileURL}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Avatar
                    size={48}
                    icon={<FaUser />}
                    style={{ cursor: "pointer" }}
                  />
                )}
                {userFullName && <h3>{userFullName}</h3>}
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}

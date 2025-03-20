// base
import React, { useState, useContext } from "react";
import "./dhaferMainPage.css";
import { DhaferContext } from "../dhafer-main/dhaferContext";

// components
import Sidebar from "../../../components/other/dhafar/sidebar-components/sidebar/Sidebar";
import WelcomePage from "../../../components/other/dhafar/pages/welcome-page/WelcomePage";
import SettingsPage from "../../../components/other/dhafar/pages/settings-page/SettingsPage";
import ChatPage from "../../../components/other/dhafar/pages/chat-page/ChatPage";

// logic
import { Pages } from "../dhafer-main/dhaferLogic";

// icons
// import { IoIosArrowForward } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
export default function DhaferMainPage() {
  const { state } = useContext(DhaferContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    !window.matchMedia("(max-width: 600px)").matches
  );

  const handleCurrentPage = () => {
    switch (state?.currentPage) {
      case Pages.WELCOME:
        return <WelcomePage />;

      case Pages.MEMORY_SETTINGS:
        return <SettingsPage />;

      case Pages.CONVERSATION:
        return <ChatPage />;

      default:
        return <p>not selected page</p>;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dhafer-main-page">
      <div className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      <div className={"body"}>
        {handleCurrentPage()}

        <div className="toggle-sidebar-btn" onClick={toggleSidebar}>
          <FiMenu
            fontSize={22}
            className={`toggle-sidebar-icon ${isSidebarOpen ? "" : "closed"}`}
          />
        </div>

        <div className={`card-loader ${state?.pageLoader ? "active" : ""}`}>
          <div className="circle-loader"></div>
          <p className="loader-message">جاري المعالجة ...</p>
        </div>
      </div>
    </div>
  );
}

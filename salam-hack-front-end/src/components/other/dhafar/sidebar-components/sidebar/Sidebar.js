import React, { useContext } from "react";
import "./sidebar.css";
import { DhaferContext } from "../../../../../pages/dhafer/dhafer-main/dhaferContext";
import { Link } from "react-router-dom";
import inbookIcon from "../../../../../images/64.png";

// logic
import {
  Pages,
  clearConversationFromSession,
  logConversationIdToSession,
  getConversations,
  newConversation,
} from "../../../../../pages/dhafer/dhafer-main/dhaferLogic";

// icons
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineArrowUpOnSquare } from "react-icons/hi2";

// components
import ConversationCard from "../conversation-card/ConversationCard";

export default function Sidebar({ setIsSidebarOpen }) {
  const { state, actions } = useContext(DhaferContext);

  const handleNewConversation = async () => {
    if (window.matchMedia("(max-width: 600px)").matches)
      setIsSidebarOpen(false);

    const newConversationId = await newConversation(
      state?.user?.userId,
      actions?.setPageLoader
    );

    if (!newConversationId) return;

    actions?.setConversations(
      await getConversations(state?.user?.userId, state?.setPageLoader)
    );
    actions?.setCurrentConversationId(newConversationId);
    actions?.setCurrentPage(Pages.CONVERSATION);
    logConversationIdToSession(newConversationId);
  };

  const handleMemorySettings = () => {
    if (window.matchMedia("(max-width: 600px)").matches)
      setIsSidebarOpen(false);

    actions?.setCurrentPage(Pages.MEMORY_SETTINGS);
    clearConversationFromSession();
    actions?.setCurrentConversationId(null);
  };

  const handleUpgrade = () => {
    if (window.matchMedia("(max-width: 600px)").matches)
      setIsSidebarOpen(false);
  };

  const getSettingsJSX = () => {
    return (
      <div className="sidebar-settings-container">
        <div className="sidebar-btn new-chat" onClick={handleNewConversation}>
          <p>محادثة جديدة</p>
          <FaPlus fontSize={22} />
        </div>
        <div
          className="sidebar-btn memory-settings"
          onClick={handleMemorySettings}
        >
          <p>تخصيص الذاكرة</p>
          <IoSettingsOutline fontSize={22} />
        </div>
        <Link
          to={"/upgrade"}
          className={`sidebar-btn ${state?.isFree ? "" : "hide"}`}
          onClick={handleUpgrade}
        >
          <p className="upgrade-btn">الترقية الان</p>
          <HiOutlineArrowUpOnSquare fontSize={22} />
        </Link>
      </div>
    );
  };

  const getConversationsJSX = () => {
    return state?.conversations?.length > 0 ? (
      state?.conversations
        ?.slice()
        ?.sort((a, b) => b.conversationId - a.conversationId)
        ?.map((conversation) => (
          <ConversationCard
            key={conversation.conversationId}
            conversation={conversation}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        ))
    ) : (
      <p className="no-conversations">ليس لديك محادثات بعد!</p>
    );
  };

  return (
    <div className="sidebar-component">
      <div className="sidebar-header">
        <img src={inbookIcon} alt="inbook-icon" />
        <h2>Utemy</h2>
      </div>
      <div className="sidebar-body">
        {getSettingsJSX()}
        <div className="conversations-container">
          <p className="label">المحادثات</p>
          {getConversationsJSX()}
        </div>
      </div>
    </div>
  );
}

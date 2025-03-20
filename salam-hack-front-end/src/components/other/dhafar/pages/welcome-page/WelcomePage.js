import React, { useContext } from "react";
import "./welcomePage.css";
import { DhaferContext } from "../../../../../pages/dhafer/dhafer-main/dhaferContext";
import {
  Pages,
  logConversationIdToSession,
  newConversation,
  getConversations,
} from "../../../../../pages/dhafer/dhafer-main/dhaferLogic";

export default function WelcomePage() {
  const { state, actions } = useContext(DhaferContext);

  const handleNewConversation = async () => {
    const newConversationId = await newConversation(
      state?.user?.userId,
      actions?.setPageLoader
    );

    if (!newConversationId) return;

    actions?.setConversations(await getConversations(state?.user?.userId));
    actions?.setCurrentConversationId(newConversationId);
    actions?.setCurrentPage(Pages.CONVERSATION);
    logConversationIdToSession(newConversationId);
  };

  return (
    <div className="welcome-page-component">
      <div className="welcome-content">
        <h1 className="welcome-title">ابدأ محادثة جديدة</h1>
        <p className="welcome-subtitle">
          نحن هنا لمساعدتك في رحلتك الدراسية. يمكنك البدء بمحادثة جديدة أو اختيار محادثة سابقة.
        </p>
        <button
          className="new-conversation-btn"
          onClick={handleNewConversation}
        >
          محادثة جديدة
        </button>
      </div>
    </div>
  );
}
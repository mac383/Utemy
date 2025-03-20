import React, { useContext, useState, useEffect, useRef } from "react";
import "./conversationCard.css";
import { DhaferContext } from "../../../../../pages/dhafer/dhafer-main/dhaferContext";

// logic
import {
  Pages,
  // validateConversationTitle,
  formatLastInteraction,
  updateConversationTitle,
  deleteConversation,
  logConversationIdToSession,
  clearConversationFromSession,
} from "../../../../../pages/dhafer/dhafer-main/dhaferLogic";

// components
import TextInput from "../../../../main/inputs/text-input/TextInput";

// icons
import { BsThreeDots } from "react-icons/bs";

export default function ConversationCard({ conversation, setIsSidebarOpen }) {
  const cardRef = useRef(null);
  const optionsRef = useRef(null);
  const { state, actions } = useContext(DhaferContext);
  const [isWriteMode, setIsWriteMode] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState(
    conversation?.title
  );
  const [cardLoader, setCardLoader] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsWriteMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setIsOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdateTitle = async () => {
    if (
      await updateConversationTitle(
        conversation?.conversationId,
        newConversationTitle,
        setCardLoader
      )
    ) {
      conversation.title = newConversationTitle;
      setIsWriteMode(false);
    }
  };

  const handleDelete = async () => {
    if (await deleteConversation(conversation?.conversationId, setCardLoader)) {
      if (state?.currentConversationId === conversation?.conversationId) {
        actions?.setCurrentConversationId(null);
        actions?.setCurrentPage(Pages.WELCOME);
        clearConversationFromSession();
      }
      actions.setConversations(
        state?.conversations.filter(
          (item) => item.conversationId !== conversation?.conversationId
        )
      );
    }
  };

  const toggleOptions = (e) => {
    setIsOptionsOpen(!isOptionsOpen);
    e.stopPropagation();
  };

  const handleOnConversationClick = () => {
    if (window.matchMedia("(max-width: 600px)").matches)
      setIsSidebarOpen(false);

    actions?.setCurrentConversationId(conversation.conversationId);
    actions?.setCurrentPage(Pages.CONVERSATION);
    logConversationIdToSession(conversation.conversationId);
  };

  return (
    <div
      ref={cardRef}
      className={`conversation-card-component ${
        conversation.conversationId === state?.currentConversationId
          ? "active"
          : ""
      }`}
      onClick={handleOnConversationClick}
    >
      <div className="conversation-data">
        {isWriteMode ? (
          <>
            <div className="title-input-container" onClick={(e) => e.stopPropagation()}>
              <TextInput
                title={"العنوان"}
                value={newConversationTitle}
                onChangeHandler={(value) => {
                  setNewConversationTitle(value);
                }}
                validateInput={(title) => {return title.length <= 25}}
                onEnter={handleUpdateTitle}
                required
              />
            </div>
            <p
              className="save-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateTitle();
              }}
            >
              حفظ
            </p>
          </>
        ) : (
          <>
            <p className="title">{conversation.title}</p>
            <p className="date">
              {formatLastInteraction(conversation.lastInteraction)}
            </p>
          </>
        )}
      </div>

      <div
        className="options-container"
        ref={optionsRef}
        onClick={toggleOptions}
      >
        <BsThreeDots fontSize={22} />
        <div className={`options ${isOptionsOpen ? "open" : ""}`}>
          <p
            className="item"
            onClick={(e) => {
              e.stopPropagation();
              setIsWriteMode(true);
              setIsOptionsOpen(false);
            }}
          >
            اعادة التسمية
          </p>
          <p
            className="item danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
              setIsOptionsOpen(false);
            }}
          >
            حذف
          </p>
        </div>
      </div>

      <div className={`card-loader ${cardLoader ? "active" : ""}`}>
        <div className="circle-loader"></div>
        <p className="loader-message">جاري الحفظ...</p>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import "./chatPage.css";
import { DhaferContext } from "../../../../../pages/dhafer/dhafer-main/dhaferContext";

// components
import SystemMessage from "../../messages/system-message/SystemMessage";
import UserMessage from "../../messages/user-message/UserMessage";
import UserInput from "../../user-input/UserInput";

// icons
import { GoMoveToBottom } from "react-icons/go";

export default function ChatPage() {
  const { state } = useContext(DhaferContext);
  const [container, setContainer] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const getMessagesJSX = () => {
    return (
      state?.messages?.length > 0 &&
      state?.messages?.map((message, index) =>
        message.sender === "system" ? (
          <SystemMessage key={index} message={message} />
        ) : (
          <UserMessage key={index} message={message} />
        )
      )
    );
  };

  const scrollToBottom = () => {
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (container) {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      setShowScrollButton(distanceFromBottom > 1000);
    }
  };

  useEffect(() => {
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll); // تنظيف
    }
  }, [container]);

  useEffect(() => {
    scrollToBottom();
  }, [state?.messages]);

  return (
    <div className="chat-page-component">
      <div className="messages-container" ref={setContainer}>
        <SystemMessage
          message={{
            content:
              "مرحباً بك! أنا المساعد الذكي الخاص بك. كيف يمكنني مساعدتك اليوم؟",
          }}
          isInit={true}
        />
        {getMessagesJSX()}
        {showScrollButton && (
          <div className="scroll-icon-container" onClick={scrollToBottom}>
            <GoMoveToBottom fontSize={22} />
          </div>
        )}
      </div>

      <div className="input-container">
        <UserInput />
      </div>

      {!state?.isLimitReached && (
        <p className="note">يتم استخدام الذكاء الاصطناعي, تحقق من وجود الأخطاء.</p>
      )}
    </div>
  );
}

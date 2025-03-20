import React, { useState, useContext } from "react";
import "./userInput.css";
import { DhaferContext } from "../../../../pages/dhafer/dhafer-main/dhaferContext";

// logic
import {
  prepareRequestData,
  getResponseFromDhafar,
  addMessageToState,
} from "../../../../pages/dhafer/dhafer-main/dhaferLogic";

// icons
import { BiLoaderAlt } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { CiWifiOff } from "react-icons/ci";

export default function UserInput() {
  const { state, actions } = useContext(DhaferContext);
  const [inputMessage, setInputMessage] = useState("");

  const handleInputChange = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInputMessage(textarea.value);
  };

  const handleSendMessage = async () => {
    if (!navigator.onLine) {
      return false;
    }
    if (
      state?.responseLoader ||
      inputMessage?.length === 0 ||
      (state?.isFree && state?.remainingRequests === 0)
    )
      return;
    const userRequest = {
      messageId: 0,
      content: inputMessage,
      sender: "user",
    };

    addMessageToState(actions?.setMessages, userRequest);

    const requestData = prepareRequestData(
      state?.messages,
      state?.currentConversationId,
      inputMessage,
      state?.user?.fullName,
      state?.userMemory?.rememberData
    );
    setInputMessage("");

    const response = await getResponseFromDhafar(
      requestData,
      actions?.setResponseLoader
    );

    if (response) {
      const systemResponse = {
        messageId: 0,
        content: response,
        sender: "system",
      };

      addMessageToState(actions?.setMessages, systemResponse);
    }
    // else alert("no");
  };

  const handleOnEnter = async (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      await handleSendMessage();
    }
  };

  return (
    <div className="user-input-component">
      <textarea
        value={inputMessage}
        onChange={handleInputChange}
        placeholder="اكتب رسالتك..."
        className="message-input"
        rows={1}
        onKeyDown={handleOnEnter}
      />
      <div className="input-controls">
        <div className="send-container" onClick={handleSendMessage}>
          {state?.responseLoader ? (
            <BiLoaderAlt fontSize={22} className="send-loader" />
          ) : !navigator.onLine ? (
            <CiWifiOff fontSize={18} />
          ) : (
            <IoSend
              fontSize={18}
              className={`${inputMessage?.length === 0 ? "disable" : ""}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

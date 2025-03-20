import React, { useContext } from "react";
import "./userMessage.css";
import { DhaferContext } from "../../../../../pages/dhafer/dhafer-main/dhaferContext";
import { FaUserAlt } from "react-icons/fa";

export default function UserMessage({ message }) {
  const { state } = useContext(DhaferContext);
  return (
    <div className="user-message-component">
      <div className="img-container">
        {state?.user?.profileImageURL ? (
          <img src={state?.user?.profileImageURL} alt="user-icon" />
        ) : (
          <div className="no-user-image">
            <FaUserAlt fontSize={25} className="user-imaeg" />
          </div>
        )}
      </div>
      <pre className="request-content">{message?.content}</pre>
    </div>
  );
}

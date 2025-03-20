import React, { createContext, useState } from "react";

export const appContext = createContext();

export const AppProvider = ({ children }) => {
  const [notificationData, setNotificationData] = useState({
    type: "info", // success, info, warning, error
    title: "",
    details: "",
    visibility: false,
  });

  const [modal, setModal] = useState({
    title: "",
    details: "",
    visibility: false,
  });

  const [loader, setLoader] = useState(false);
  return (
    <appContext.Provider
      value={{
        notificationData,
        setNotificationData,
        modal,
        setModal,
        loader,
        setLoader,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

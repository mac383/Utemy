import React, { createContext, useContext } from "react";
import { notification, ConfigProvider } from "antd";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  notification.config({
    rtl: true,
    placement: "topRight",
  });

  return (
    <ConfigProvider direction="rtl">
      <NotificationContext.Provider value={api}>
        {contextHolder}
        {children}
      </NotificationContext.Provider>
    </ConfigProvider>
  );
};

export const useNotification = () => useContext(NotificationContext);

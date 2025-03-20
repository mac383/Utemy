import React from "react";
import "./appLayout.css";

// components
import AppHeader from "../app-header/AppHeader";
import AppFooter from "../app-footer/AppFooter";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout-component">
      <div className="app-header-container">
        <AppHeader />
      </div>
      <div className="app-body-container">{children}</div>
      <div className="app-footer-container">
        <AppFooter />
      </div>
    </div>
  );
}
import React from "react";
import "./dhafer.css";
import { DhaferProvider } from "./dhaferContext";
import DhaferMainPage from "../dhafer-main-page/DhaferMainPage";

export default function Dhafer() {
  return (
    <DhaferProvider>
      <div className={`dhafer-page`}>
        <DhaferMainPage />
      </div>
    </DhaferProvider>
  );
}

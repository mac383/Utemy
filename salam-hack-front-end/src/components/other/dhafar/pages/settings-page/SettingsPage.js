import React, { useState, useContext } from "react";
import "./settingsPage.css";
import { appContext } from "../../../../../global/contexts/appContext";
import { DhaferContext } from "../../../../../pages/dhafer/dhafer-main/dhaferContext";

// logic
import { updateUserMemory } from "../../../../../pages/dhafer/dhafer-main/dhaferLogic";

export default function SettingsPage() {
  const { setModal } = useContext(appContext);
  const { state, actions } = useContext(DhaferContext);
  const [memoryInput, setMemoryInput] = useState(
    state?.userMemory?.rememberData
  );
  const handleSave = async () => {
    if (
      await updateUserMemory(
        state?.userMemory?.memoryId,
        memoryInput,
        actions?.setPageLoader,
        setModal
      )
    )
      actions?.setUserMemory((prevMemory) => ({
        ...prevMemory,
        rememberData: memoryInput,
      }));
  };

  return (
    <div className="settings-page-component">
      <h1 className="settings-title">إعدادات الذاكرة</h1>

      <div className="message-container">
        <p className="welcome-message">
          أدخل المعلومات التي ترغب في تذكرها للحصول على تجربة مخصصة تناسب احتياجاتك وتفضيلاتك الدراسية.
        </p>

        <div className="examples">
          <p className="example-title">أمثلة على ما يمكنك إدخاله:</p>
          <p className="example">"أفضّل الإجابات السريعة والمباشرة"</p>
          <p className="example">"أفضل التعلم من خلال الأمثلة العملية"</p>
          <p className="example">"مادتي المفضلة هي الرياضيات"</p>
          <p className="example">"أواجه صعوبة في الفيزياء"</p>
        </div>
      </div>

      <div className="settings-form">
        <div className="form-group">
          <div className="label-container">
            <label htmlFor="memory" className="form-label">
              التفضيلات والاحتياجات
            </label>
            <p className="chars">{memoryInput?.length || 0}/3000</p>
          </div>
          <textarea
            id="memory"
            className="form-input"
            value={memoryInput}
            onChange={(e) => setMemoryInput(e.target.value)}
            placeholder="أدخل التفضيلات والاحتياجات التي تود تذكرها..."
            maxLength={3000}
          />
        </div>

        <button className="save-button" onClick={handleSave}>
          حفظ
        </button>
      </div>
    </div>
  );
}
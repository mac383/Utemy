import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { appContext } from "../../global/contexts/appContext";
import "./files.css";
import {
  getFilesByUserId,
  newFileAsync,
  updateFileAsync,
  deleteFileAsync,
} from "./filesLogic";

export default function Files() {
  const userId = useSelector((state) => state.currentUser?.userId);
  const {
    setNotificationData,
    // setModal,
    setLoader,
  } = useContext(appContext);

  // حالة الملفات
  const [files, setFiles] = useState([]);

  // حالة الملف الحالي للتحرير أو العرض
  const [currentFile, setCurrentFile] = useState({
    fileId: null,
    fileTitle: "",
    fileURL: "",
    LastUpdate: "", // نحتفظ بهذا الحقل للتتبع الداخلي لكن لن نعرضه
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [flag, setFlag] = useState(false);

  // حالة فلتر البحث
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetching = async () => {
      setFiles(await getFilesByUserId(userId, setLoader));
    };
    fetching();
  }, [flag]);

  const openFileView = (file) => {
    setCurrentFile(file);
    setIsEditing(false);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentFile({
      fileId: null,
      fileTitle: "",
      fileURL: "",
      LastUpdate: "",
    });
    setIsAddModalOpen(true);
  };

  const addFile = async () => {
    if (
      currentFile.fileTitle.trim() === "" ||
      currentFile.fileURL.trim() === ""
    ) {
      setNotificationData({
        type: "warning",
        title: "بيانات غير مكتملة",
        details: "الرجاء إدخال عنوان ورابط الملف قبل الحفظ",
        visibility: true,
      });
      return;
    }

    await newFileAsync(
      userId,
      currentFile?.fileTitle,
      currentFile?.fileURL,
      setLoader,
      setNotificationData
    );
    setFlag(!flag);
    setCurrentFile({
      fileId: null,
      fileTitle: "",
      fileURL: "",
      LastUpdate: "",
    });
    setIsAddModalOpen(false);
  };

  // وظيفة تحديث ملف
  const updateFile = async () => {
    if (
      currentFile.fileTitle.trim() === "" ||
      currentFile.fileURL.trim() === ""
    ) {
      setNotificationData({
        type: "warning",
        title: "بيانات غير مكتملة",
        details: "الرجاء إدخال عنوان ورابط الملف قبل تحديثه",
        visibility: true,
      });
      return;
    }

    await updateFileAsync(
      currentFile?.fileId,
      userId,
      currentFile?.fileTitle,
      currentFile?.fileURL,
      setLoader,
      setNotificationData
    );

    setFlag(!flag);
    setIsEditing(false);
    setIsViewModalOpen(false);
  };

  // وظيفة حذف ملف
  const deleteFile = async (id) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا الملف؟")) {
      await deleteFileAsync(id, setLoader, setNotificationData);
      setFlag(!flag);
      setIsViewModalOpen(false);
    }
  };

  // وظيفة تحويل لوضع التحرير
  const enableEditMode = () => {
    setIsEditing(true);
  };

  // وظيفة إلغاء التحرير
  const cancelEdit = () => {
    // إذا كنا في وضع التحرير ولكن لا زلنا نعرض، نعود لوضع العرض فقط
    if (isViewModalOpen) {
      // استرجاع البيانات الأصلية للملف من المصفوفة
      const originalFile = files.find(
        (file) => file.fileId === currentFile.fileId
      );
      setCurrentFile(originalFile);
      setIsEditing(false);
    } else {
      // إذا كنا في نافذة الإضافة، نغلقها
      setIsAddModalOpen(false);
    }
  };

  // وظيفة إغلاق جميع النوافذ المنبثقة
  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsAddModalOpen(false);
    setIsEditing(false);
    setCurrentFile({
      fileId: null,
      fileTitle: "",
      fileURL: "",
      LastUpdate: "",
    });
  };

  // وظيفة فتح الملف في نافذة جديدة
  const openFile = (url, e) => {
    if (e) {
      e.stopPropagation(); // منع انتشار الحدث لكي لا يفتح نافذة عرض الملف
    }
    window.open(url, "_blank");
  };

  // وظيفة استخراج نوع الملف من الرابط
  const getFileType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "Word";
      case "xls":
      case "xlsx":
        return "Excel";
      case "ppt":
      case "pptx":
        return "PowerPoint";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "صورة";
      case "zip":
      case "rar":
        return "ملف مضغوط";
      default:
        return "ملف";
    }
  };

  // وظيفة تحديد لون نوع الملف
  const getFileTypeColorClass = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "file-type-pdf";
      case "doc":
      case "docx":
        return "file-type-word";
      case "xls":
      case "xlsx":
        return "file-type-excel";
      case "ppt":
      case "pptx":
        return "file-type-powerpoint";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "file-type-image";
      case "zip":
      case "rar":
        return "file-type-archive";
      default:
        return "file-type-default";
    }
  };

  // الملفات المفلترة بناء على البحث
  const filteredFiles = files.filter((file) =>
    file.fileTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="files-container">
      <div className="files-header">
        <h1>ملفاتك</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="ابحث في الملفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-add" onClick={openAddModal}>
            إضافة ملف
            <span className="icon">+</span>
          </button>
        </div>
      </div>

      {/* قائمة الملفات */}
      <div className="files-list">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div
              className="file-card"
              key={file.fileId}
              onClick={() => openFileView(file)}
            >
              <div className="file-header">
                <h3>{file.fileTitle}</h3>
              </div>
              <div className="file-content-preview">
                <div
                  className={`file-type ${getFileTypeColorClass(file.fileURL)}`}
                >
                  {getFileType(file.fileURL)}
                </div>
                <div className="file-url">{file.fileURL}</div>
              </div>
              <div className="file-card-actions">
                <button
                  className="btn-open-in-card"
                  onClick={(e) => openFile(file.fileURL, e)}
                >
                  فتح الملف
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-files">
            <p>لا توجد ملفات. أضف ملفًا جديدًا للبدء!</p>
            <button className="btn-add-empty" onClick={openAddModal}>
              إضافة ملف جديد
            </button>
          </div>
        )}
      </div>

      {/* نافذة عرض/تحرير الملف */}
      {isViewModalOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {isEditing ? (
                <input
                  type="text"
                  className="modal-title-input"
                  value={currentFile.fileTitle}
                  onChange={(e) =>
                    setCurrentFile({
                      ...currentFile,
                      fileTitle: e.target.value,
                    })
                  }
                  placeholder="عنوان الملف"
                />
              ) : (
                <h2>{currentFile.fileTitle}</h2>
              )}
              <button className="btn-close" onClick={closeAllModals}>
                ×
              </button>
            </div>

            <div className="modal-content">
              {isEditing ? (
                <div className="modal-edit-content">
                  <div className="form-group">
                    <label>رابط الملف:</label>
                    <input
                      type="text"
                      className="file-url-input"
                      value={currentFile.fileURL}
                      onChange={(e) =>
                        setCurrentFile({
                          ...currentFile,
                          fileURL: e.target.value,
                        })
                      }
                      placeholder="أدخل رابط الملف"
                    />
                  </div>
                </div>
              ) : (
                <div className="file-details">
                  <div
                    className={`file-type-large ${getFileTypeColorClass(
                      currentFile.fileURL
                    )}`}
                  >
                    {getFileType(currentFile.fileURL)}
                  </div>
                  <div className="file-url-display">{currentFile.fileURL}</div>
                  <button
                    className="btn-open-file"
                    onClick={() => openFile(currentFile.fileURL)}
                  >
                    فتح الملف
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                {isEditing ? (
                  <>
                    <button className="btn-update" onClick={updateFile}>
                      حفظ التغييرات
                    </button>
                    <button className="btn-cancel" onClick={cancelEdit}>
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-edit" onClick={enableEditMode}>
                      تحرير
                      <span className="icon">✎</span>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteFile(currentFile.fileId)}
                    >
                      حذف
                      <span className="icon">✖</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة ملف جديد */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <input
                type="text"
                className="modal-title-input"
                value={currentFile.fileTitle}
                onChange={(e) =>
                  setCurrentFile({ ...currentFile, fileTitle: e.target.value })
                }
                placeholder="عنوان الملف الجديد"
              />
              <button className="btn-close" onClick={closeAllModals}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>رابط الملف:</label>
                <input
                  type="text"
                  className="file-url-input"
                  value={currentFile.fileURL}
                  onChange={(e) =>
                    setCurrentFile({ ...currentFile, fileURL: e.target.value })
                  }
                  placeholder="أدخل رابط الملف"
                />
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button className="btn-add" onClick={addFile}>
                  إضافة الملف
                </button>
                <button className="btn-cancel" onClick={closeAllModals}>
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

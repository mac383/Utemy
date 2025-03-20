import React, { useState, useEffect, useContext } from "react";
import { appContext } from "../../global/contexts/appContext";
import "./notes.css";
import { useSelector } from "react-redux";
import {
  getNotesByUserId,
  newNote,
  updateNoteAsync,
  deleteNoteAsync,
} from "./notesLogic";

export default function Notes() {
  const userId = useSelector((state) => state.currentUser?.userId);

  const {
    setNotificationData,
    // setModal,
    setLoader,
  } = useContext(appContext);

  const [notes, setNotes] = useState([]);

  // حالة الملاحظة الحالية للتحرير أو العرض
  const [currentNote, setCurrentNote] = useState({
    noteId: null,
    title: "",
    content: "",
    lastUpdate: "",
  });

  const [flag, setFlag] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // حالة فلتر البحث
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetching = async () => {
      setNotes(await getNotesByUserId(userId, setLoader));
    };

    fetching();
  }, [flag]);

  const openNoteView = (note) => {
    setCurrentNote(note);
    setIsEditing(false);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentNote({ noteId: null, title: "", content: "", lastUpdate: "" });
    setIsAddModalOpen(true);
  };

  const addNote = async () => {
    if (currentNote.title.trim() === "" || currentNote.content.trim() === "") {
      setNotificationData({
        type: "warning",
        title: "بيانات غير مكتملة",
        details: "الرجاء إدخال عنوان وملاحظات قبل الحفظ",
        visibility: true,
      });
      return;
    }

    await newNote(
      userId,
      currentNote?.title,
      currentNote?.content,
      setLoader,
      setNotificationData
    );

    setFlag(!flag);
    setCurrentNote({ noteId: null, title: "", content: "", lastUpdate: "" });
    setIsAddModalOpen(false);
  };

  // وظيفة تحديث ملاحظة
  const updateNote = async () => {
    if (currentNote.title.trim() === "" || currentNote.content.trim() === "") {
      setNotificationData({
        type: "warning",
        title: "بيانات غير مكتملة",
        details: "الرجاء إدخال عنوان ومحتوى للملاحظة قبل تحديثها",
        visibility: true,
      });
      return;
    }

    await updateNoteAsync(
      currentNote?.noteId,
      currentNote?.title,
      currentNote?.content,
      setLoader,
      setNotificationData
    );

    setFlag(!flag);
    setIsEditing(false);
    setIsViewModalOpen(false);
  };

  // وظيفة حذف ملاحظة
  const deleteNote = async (id) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه الملاحظة؟")) {
      await deleteNoteAsync(id, setLoader, setNotificationData);
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
      // استرجاع البيانات الأصلية للملاحظة من المصفوفة
      const originalNote = notes.find(
        (note) => note.noteId === currentNote.noteId
      );
      setCurrentNote(originalNote);
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
    setCurrentNote({ noteId: null, title: "", content: "", lastUpdate: "" });
  };

  // تنسيق التاريخ للعرض
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("ar-SA", options);
  };

  // الملاحظات المفلترة بناء على البحث
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>ملاحظاتك</h1>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="ابحث في الملاحظات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-add" onClick={openAddModal}>
            إضافة ملاحظة
            <span className="icon">+</span>
          </button>
        </div>
      </div>

      {/* قائمة الملاحظات */}
      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              className="note-card"
              key={note.noteId}
              onClick={() => openNoteView(note)}
            >
              <div className="note-header">
                <h3>{note.title}</h3>
              </div>
              <div className="note-content-preview">
                {note.content.length > 120
                  ? note.content.substring(0, 120) + "..."
                  : note.content}
              </div>
              <div className="note-footer">
                <span className="note-date">
                  آخر تحديث: {formatDate(note.lastUpdate)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-notes">
            <p>لا توجد ملاحظات. أضف ملاحظة جديدة للبدء!</p>
            <button className="btn-add-empty" onClick={openAddModal}>
              إضافة ملاحظة جديدة
            </button>
          </div>
        )}
      </div>

      {/* نافذة عرض/تحرير الملاحظة */}
      {isViewModalOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {isEditing ? (
                <input
                  type="text"
                  className="modal-title-input"
                  value={currentNote.title}
                  onChange={(e) =>
                    setCurrentNote({ ...currentNote, title: e.target.value })
                  }
                  placeholder="عنوان الملاحظة"
                />
              ) : (
                <h2>{currentNote.title}</h2>
              )}
              <button className="btn-close" onClick={closeAllModals}>
                ×
              </button>
            </div>

            <div className="modal-content">
              {isEditing ? (
                <textarea
                  className="modal-content-textarea"
                  value={currentNote.content}
                  onChange={(e) =>
                    setCurrentNote({ ...currentNote, content: e.target.value })
                  }
                  placeholder="محتوى الملاحظة"
                  rows="12"
                ></textarea>
              ) : (
                <div className="note-full-content">{currentNote.content}</div>
              )}
            </div>

            <div className="modal-footer">
              <div className="modal-date">
                آخر تحديث: {formatDate(currentNote.lastUpdate)}
              </div>
              <div className="modal-actions">
                {isEditing ? (
                  <>
                    <button className="btn-update" onClick={updateNote}>
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
                      onClick={() => deleteNote(currentNote.noteId)}
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

      {/* نافذة إضافة ملاحظة جديدة */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <input
                type="text"
                className="modal-title-input"
                value={currentNote.title}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, title: e.target.value })
                }
                placeholder="عنوان الملاحظة الجديدة"
              />
              <button className="btn-close" onClick={closeAllModals}>
                ×
              </button>
            </div>

            <div className="modal-content">
              <textarea
                className="modal-content-textarea"
                value={currentNote.content}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, content: e.target.value })
                }
                placeholder="محتوى الملاحظة الجديدة"
                rows="12"
              ></textarea>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button className="btn-add" onClick={addNote}>
                  إضافة الملاحظة
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

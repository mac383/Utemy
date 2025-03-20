import axios from "axios";
import config from "../../global/config";

async function getNotesByUserId(userId, setLoading) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.get(
      `${config.apiBaseUrl}/Notes/GetNotesByUserId`,
      {
        headers: {
          userId: userId,
        },
      }
    );

    return response?.data?.data?.response || [];
  } catch (error) {
    console.error("Error fetching notes by user ID:", error);
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function newNote(
  userId,
  title,
  content,
  setLoading,
  setNotificationData
) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.post(`${config.apiBaseUrl}/Notes/NewNote`, {
      userId: userId,
      content: content,
      title: title,
    });

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تمت إضافة الملاحظة بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "لم يتم إضافة الملاحظة، حاول مرة أخرى.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error adding new note:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدث خطأ أثناء إضافة الملاحظة.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function updateNoteAsync(
  noteId,
  title,
  content,
  setLoading,
  setNotificationData
) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.put(`${config.apiBaseUrl}/Notes/UpdateNote`, {
      noteId: noteId,
      content: content,
      title: title,
    });

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تم تحديث الملاحظة بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "لم يتم تحديث الملاحظة، حاول مرة أخرى.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error updating note:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدث خطأ أثناء تحديث الملاحظة.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function deleteNoteAsync(noteId, setLoading, setNotificationData) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.delete(
      `${config.apiBaseUrl}/Notes/DeleteNote`,
      {
        headers: { noteId: noteId },
      }
    );

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تم حذف الملاحظة بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "لم يتم حذف الملاحظة، حاول مرة أخرى.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدث خطأ أثناء حذف الملاحظة.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

export { getNotesByUserId, newNote, updateNoteAsync, deleteNoteAsync };

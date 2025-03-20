import axios from "axios";
import config from "../../global/config";

async function getLessonById(lessonId, setLoading) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.get(
      `${config.apiBaseUrl}/PlayListLessones/GetLessonByID`,
      {
        headers: {
          lessonId: lessonId,
        },
      }
    );
    return response?.data?.data?.response || null;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function setAsCompletedLesson(lessonId, setLoading) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.patch(
      `${config.apiBaseUrl}/PlayListLessones/SetAsCompletedLesson`,
      {},
      {
        headers: {
          LessonID: lessonId,
        },
      }
    );

    return response?.data || null;
  } catch (error) {
    console.error("Error setting lesson as completed:", error);
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function setLessonNotes(lessonId, note, setLoading, setNotificationData) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.patch(
      `${config.apiBaseUrl}/PlayListLessones/SetNotes`,
      {},
      {
        headers: {
          LessonId: lessonId,
          encodedNote: btoa(unescape(encodeURIComponent(note))), // تشفير النص
        },
      }
    );

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تم حفظ الملاحظة بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "حدث مشكلة اثناء محاولة حفظ الملاحظة, يرجئ المحاولة لاحقاً.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error setting lesson notes:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدث مشكلة اثناء محاولة حفظ الملاحظة, يرجئ المحاولة لاحقاً.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function setLessonFile(
  lessonId,
  fileTitle,
  fileURL,
  setLoading,
  setNotificationData
) {
  try {
    if (setLoading) setLoading(true);

    const timestamp = new Date().getTime();
    const fileName = `lesson_${lessonId}_${timestamp}`;

    const response = await axios.patch(
      `${config.apiBaseUrl}/PlayListLessones/SetFile`,
      {
        lessonId,
        fileTitle,
        fileURL,
        fileName,
      }
    );

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تم حفظ الملف بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "حدثت مشكلة أثناء محاولة حفظ الملف، يرجى المحاولة لاحقاً.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error setting lesson file:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدثت مشكلة أثناء محاولة حفظ الملف، يرجى المحاولة لاحقاً.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

export { getLessonById, setAsCompletedLesson, setLessonNotes, setLessonFile };

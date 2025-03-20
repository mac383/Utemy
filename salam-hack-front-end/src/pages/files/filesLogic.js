import axios from "axios";
import config from "../../global/config";

async function getFilesByUserId(userId, setLoading) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.get(
      `${config.apiBaseUrl}/Files/GetFilesByUserId`,
      {
        headers: {
          userId: userId,
        },
      }
    );

    return response?.data?.data?.response || [];
  } catch (error) {
    console.error("Error fetching files by user ID:", error);
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
}

const generateUniqueFileName = (userId) => {
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}_${userId}`;
  return uniqueFileName;
};

async function newFileAsync(
  userId,
  fileTitle,
  fileURL,
  setLoading,
  setNotificationData
) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.post(`${config.apiBaseUrl}/Files/NewFile`, {
      userId: userId,
      fileName: generateUniqueFileName(userId),
      fileTitle: fileTitle,
      fileURL: fileURL,
    });

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تمت إضافة الملف بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "لم يتم إضافة الملف، حاول مرة أخرى.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error adding new file:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدث خطأ أثناء إضافة الملف.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function updateFileAsync(
  fileId,
  userId,
  fileTitle,
  fileURL,
  setLoading,
  setNotificationData
) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.put(`${config.apiBaseUrl}/Files/UpdateFile`, {
      fileId: fileId,
      userId: userId,
      fileName: generateUniqueFileName(userId),
      fileTitle: fileTitle,
      fileURL: fileURL,
    });

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تم تحديث الملف بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "لم يتم تحديث الملف، حاول مرة أخرى.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error updating file:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدث خطأ أثناء تحديث الملف.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function deleteFileAsync(fileId, setLoading, setNotificationData) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.patch(
      `${config.apiBaseUrl}/Files/DeleteFile`,
      null,
      {
        headers: { fileId: fileId },
      }
    );

    if (response?.data) {
      setNotificationData({
        type: "info",
        title: "تم بنجاح",
        details: "تم حذف الملف بنجاح.",
        visibility: true,
      });
      return true;
    } else {
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "لم يتم حذف الملف، حاول مرة أخرى.",
        visibility: true,
      });
      return null;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    setNotificationData({
      type: "error",
      title: "خطأ",
      details: "حدث خطأ أثناء حذف الملف.",
      visibility: true,
    });
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
}

export { getFilesByUserId, newFileAsync, updateFileAsync, deleteFileAsync };

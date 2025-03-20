import axios from "axios";
import config from "../../global/config";

async function getCoursesByUser(userId, setLoading) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.get(
      `${config.apiBaseUrl}/UserPlaylist/GetByUserID`,
      {
        headers: {
          UserId: userId,
        },
      }
    );

    return response?.data?.data?.resopnse || [];
  } catch (error) {
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
}

async function addUserPlaylist(
  userId,
  playlistURL,
  setLoading,
  setNotificationData
) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.post(
      `${config.apiBaseUrl}/UserPlaylist/NewUserPlaylist`,
      {},
      {
        headers: {
          UserId: userId,
          PlaylistURL: playlistURL,
        },
      }
    );

    if (response?.data?.status) {
      if (setNotificationData) {
        setNotificationData({
          type: "success",
          title: "تمت الإضافة بنجاح",
          details: "تمت إضافة قائمة التشغيل إلى حسابك بنجاح!",
          visibility: true,
        });
      }
      return true;
    } else {
      throw new Error(response?.data?.message || "فشل إضافة قائمة التشغيل.");
    }
  } catch (error) {
    console.error("خطأ في إضافة قائمة التشغيل:", error);

    if (setNotificationData) {
      setNotificationData({
        type: "error",
        title: "خطأ في الإضافة",
        details: "حدث خطأ أثناء إضافة قائمة التشغيل. يرجى المحاولة لاحقًا.",
        visibility: true,
      });
    }

    return false;
  } finally {
    if (setLoading) setLoading(false);
  }
}

export { getCoursesByUser, addUserPlaylist };

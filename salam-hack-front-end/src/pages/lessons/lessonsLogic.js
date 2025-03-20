import axios from "axios";
import config from "../../global/config";

async function getPlayListsByID(playlistId, setLoading) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.get(
      `${config.apiBaseUrl}/PlayListLessones/GetPlayListsByID`,
      {
        headers: {
          PlaylistId: playlistId,
        },
      }
    );
    return response?.data?.data?.response || [];
  } catch (error) {
    console.error("خطأ في جلب بيانات القائمة التشغيلية:", error);
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
}

export { getPlayListsByID };

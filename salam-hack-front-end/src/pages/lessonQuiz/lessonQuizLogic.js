import axios from "axios";
import config from "../../global/config";

async function getGptResponse(prompt, setLoading, setNotificationData) {
  try {
    if (setLoading) setLoading(true);

    const response = await axios.post(
      `${config.apiBaseUrl}/AI/GetResponseFromGptWithPrompt`,
      prompt,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data?.data?.response) {
      return response?.data?.data?.response;
    } else {
      if (setNotificationData)
        setNotificationData({
          type: "error",
          title: "خطأ",
          details: "حدثت مشكلة أثناء تجهيز الاختبار.",
          visibility: true,
        });

      return [];
    }
  } catch (error) {
    console.error("Error getting GPT response:", error);
    if (setNotificationData)
      setNotificationData({
        type: "error",
        title: "خطأ",
        details: "حدثت مشكلة أثناء تجهيز الاختبار.",
        visibility: true,
      });
    return [];
  } finally {
    if (setLoading) setLoading(false);
  }
}

export { getGptResponse };

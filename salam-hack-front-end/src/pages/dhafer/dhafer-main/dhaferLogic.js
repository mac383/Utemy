import axios from "axios";
import config from "../../../global/config";
// import { getValidAccessToken } from "../../../global/utils/tokens/tokens";
// import { checkLength } from "../../../global/utils/validation";
import { encrypt, decrypt } from "../../../global/utils/crypto/offlineCrypto";

const Pages = Object.freeze({
  WELCOME: "welcome-page",
  CONVERSATION: "conversation-page",
  MEMORY_SETTINGS: "memory-settings-page",
});

// ok
// const validateConversationTitle = (title) => {
//   return checkLength(1, 50, title);
// };

// ok
const formatLastInteraction = (dateString) => {
  const lastInteractionDate = new Date(dateString);
  const today = new Date();

  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const year = lastInteractionDate.getFullYear();
  const month = monthNames[lastInteractionDate.getMonth()];
  const day = lastInteractionDate.getDate();

  if (
    lastInteractionDate.getFullYear() === today.getFullYear() &&
    lastInteractionDate.getMonth() === today.getMonth() &&
    lastInteractionDate.getDate() === today.getDate()
  ) {
    return `اليوم`;
  }

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (
    lastInteractionDate.getFullYear() === yesterday.getFullYear() &&
    lastInteractionDate.getMonth() === yesterday.getMonth() &&
    lastInteractionDate.getDate() === yesterday.getDate()
  ) {
    return `أمس`;
  }

  if (lastInteractionDate.getFullYear() === today.getFullYear()) {
    return `${day} ${month}`;
  }

  return `${day} ${month} ${year}`;
};

// ok
function logConversationIdToSession(conversationId) {
  try {
    const data = {
      conversationId,
    };

    const encryptedData = encrypt(JSON.stringify(data));

    if (encryptedData) {
      sessionStorage.setItem("conversation", encryptedData);
    }
  } catch (error) {
    console.error("Error logging data to session:", error);
  }
}

// ok
function getConversationIdFromSession() {
  try {
    const encryptedData = sessionStorage.getItem("conversation");

    if (encryptedData) {
      const decryptedData = decrypt(encryptedData);

      if (decryptedData) {
        return JSON.parse(decryptedData);
      } else return null;
    }

    return null;
  } catch (error) {
    console.error("Error retrieving data from session:", error);
    return null;
  }
}

// ok
function clearConversationFromSession() {
  try {
    sessionStorage.removeItem("conversation");
  } catch (error) {
    console.error("Error clearing data from session:", error);
  }
}

// ok
async function getUserMemory(userId, setLoader) {
  try {
    if (!userId || userId <= 0) return null;

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AIUserMemory/GetUserMemoryByUserId`;

    const headers = {
      // Authorization: `Bearer ${await getValidAccessToken()}`,
      userId: userId,
    };

    const response = await axios.get(url, { headers });

    return response?.data?.data?.response || null;
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error.message);
    return null;
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
async function updateUserMemory(memoryId, memoryData, setLoader, setModel) {
  try {
    if (!memoryId) return false;

    if (!memoryData) memoryData = "";

    // إذا كان هناك token
    // const token = await getValidAccessToken();

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AIUserMemory/UpdateUserMemory`;

    const response = await axios.put(
      url,
      {
        MemoryId: memoryId, // تأكد من تطابق الأسماء مع الـ API
        RememberData: memoryData, // تأكد من تطابق الأسماء مع الـ API
      },
      {
        headers: {
          // إذا كان هناك token
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.data?.status) {
      setModel({
        title: "تم الحفظ بنجاح!",
        details:
          "تم حفظ البيانات التي طلبت من ظفر تذكرها. ستعتمد ظفر على هذه البيانات لتقديم تجربة تعليمية مخصصة ودعم أفضل لمسيرتك الدراسية.",
        visibility: true,
      });
      return true;
    } else {
      setModel({
        title: "فشل الحفظ",
        details:
          "عذرًا، لم نتمكن من حفظ البيانات التي أدخلتها. يرجى التحقق من الاتصال بالإنترنت أو المحاولة مرة أخرى لاحقًا.",
        visibility: true,
      });
      return false;
    }
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error.message);
    setModel({
      title: "حدث خطأ غير متوقع",
      details:
        "واجهنا مشكلة أثناء حفظ البيانات. يرجى إعادة المحاولة. إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني.",
      visibility: true,
    });
    return false;
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
async function newConversation(userId, setLoader = null) {
  try {
    if (!userId) return false;

    // const token = await getValidAccessToken();

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AIConversations/AddNewConversation`;

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          userId: userId,
        },
      }
    );

    if (response?.data?.data?.conversationId) {
      return response?.data?.data?.conversationId;
    } else {
      return false;
    }
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error.message);
    return false;
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
async function updateConversationTitle(
  conversationId,
  title,
  setLoader = null
) {
  try {
    // if (!conversationId || !title || !validateConversationTitle(title))
    //   return false;

    // const token = await getValidAccessToken();

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AIConversations/UpdateConversationTitle`;
    const response = await axios.put(url, JSON.stringify(title), {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        conversationId: conversationId,
      },
    });

    if (response?.data?.data?.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error.message);
    return false;
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
async function getConversations(userId, setLoader) {
  try {
    if (!userId || userId <= 0) return [];

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AIConversations/GetAllConversations`;

    const headers = {
      // Authorization: `Bearer ${await getValidAccessToken()}`,
      userId: userId,
    };

    const response = await axios.get(url, { headers });

    return response?.data?.data?.conversations || [];
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error.message);
    return [];
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
async function deleteConversation(conversationId, setLoader = null) {
  try {
    if (!conversationId) return false;

    // const token = await getValidAccessToken();

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AIConversations/DeleteConversation`;

    const response = await axios.delete(url, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        conversationId: conversationId,
      },
    });

    if (response?.data?.data?.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error.message);
    return false;
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
async function getMessagesByConversation(conversationId, setLoader) {
  try {
    if (!conversationId || conversationId <= 0) return [];

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AIMessages/GetMessagesByConversationId`;
    const headers = {
      // Authorization: `Bearer ${await getValidAccessToken()}`,
      conversationId: conversationId,
    };

    const response = await axios.get(url, { headers });

    return response?.data?.data?.response || [];
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error.message);
    return [];
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
async function getResponseFromDhafar(requestData, setLoader = null) {
  try {
    if (!navigator.onLine) {
      return false;
    }

    if (!requestData || !requestData?.UserInput) {
      return null;
    }

    // const token = await getValidAccessToken();

    if (setLoader) setLoader(true);
    const url = `${config.apiBaseUrl}/AI/GetResponseFromGPT`;

    const response = await axios.post(url, requestData, {
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response?.data?.data) {
      return response.data.data.response;
    } else {
      console.error("فشل الطلب:", response?.data?.message);
      return null;
    }
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الطلب:", error);
    return null;
  } finally {
    if (setLoader) setLoader(false);
  }
}

// ok
const getLastConversations = (messages) => {
  const userMessages = messages
    .filter((msg) => msg.sender === "user")
    .slice(-2);

  const systemMessages = messages
    .filter((msg) => msg.sender === "system")
    .slice(-2);

  const previousConversations = [];

  const maxPairs = Math.min(userMessages.length, systemMessages.length);

  for (let i = 0; i < maxPairs; i++) {
    previousConversations.push({
      Request: userMessages[i].content,
      Response: systemMessages[i].content,
    });
  }

  return previousConversations;
};

// ok
function prepareRequestData(
  messages,
  conversationId,
  userInput,
  userFullName = "",
  memoryData = ""
) {
  const previousConversations = getLastConversations(messages);

  const requestData = {
    ConversationId: conversationId,
    UserInput: userInput,
    UserFullName: userFullName,
    MemoryData: memoryData,
    PreviousConversations: previousConversations,
  };

  return requestData;
}

// ok
const addMessageToState = (setMessages, newMessage) => {
  setMessages((prevMessages) => {
    const maxMessageId = prevMessages.reduce(
      (maxId, message) => Math.max(maxId, message.messageId),
      0
    );

    return [...prevMessages, { ...newMessage, messageId: maxMessageId + 1 }];
  });
};

export {
  Pages,
  // validateConversationTitle,
  formatLastInteraction,
  logConversationIdToSession,
  getConversationIdFromSession,
  clearConversationFromSession,
  newConversation,
  updateConversationTitle,
  getConversations,
  deleteConversation,
  getUserMemory,
  getMessagesByConversation,
  getResponseFromDhafar,
  getLastConversations,
  updateUserMemory,
  prepareRequestData,
  addMessageToState,
};

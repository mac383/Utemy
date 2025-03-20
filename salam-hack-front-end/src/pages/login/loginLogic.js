import config from "../../global/config";
import axios from "axios";

/**
 * تسجيل دخول المستخدم بالبريد الإلكتروني وكلمة المرور
 *
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @param {string} password - كلمة مرور المستخدم
 * @param {boolean} remember - حفظ بيانات الدخول
 * @param {function} setLoading - دالة لتحديث حالة التحميل
 * @param {function} setNotificationData - دالة لعرض الإشعارات
 * @param {function} dispatch - دالة ديسباتش Redux
 * @param {function} setCurrentUser - Action creator لتعيين المستخدم الحالي
 * @returns {Promise<boolean>} نجاح عملية تسجيل الدخول
 */
async function getUserByAuth(
  email,
  password,
  remember,
  setLoading,
  setNotificationData,
  dispatch,
  setCurrentUser,
  navigate
) {
  try {
    // بدء حالة التحميل
    if (setLoading) setLoading(true);

    // الاتصال بالAPI
    const response = await axios.get(`${config.apiBaseUrl}/Users/GetByAuth`, {
      headers: {
        email: email,
        password: password,
      },
    });

    // استخراج بيانات المستخدم
    const userObj = response?.data?.data?.response || null;

    // التحقق من وجود بيانات المستخدم
    if (!userObj) {
      if (setNotificationData) {
        setNotificationData({
          type: "error",
          title: "بيانات غير صحيحة",
          details:
            "اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
          visibility: true,
        });
      }
      return false;
    }

    userObj.fields = await getFieldsByUserId(userObj?.userId);

    // تحويل بيانات المستخدم إلى سلسلة نصية مرة واحدة لتجنب التحويل المتكرر
    const userObjString = JSON.stringify(userObj);

    // تخزين بيانات المستخدم في sessionStorage بشكل متزامن
    sessionStorage.setItem("currentUser", userObjString);

    // تخزين بيانات التذكر قبل تحديث Redux
    if (remember) {
      localStorage.setItem("username", email);
      localStorage.setItem("password", password);
    }

    // تحديث حالة Redux
    dispatch(setCurrentUser(userObj));

    // إضافة تأخير صغير للتأكد من اكتمال تحديث الحالة
    await new Promise((resolve) => setTimeout(resolve, 50));
    navigate("/");
    return true;
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error);

    if (setNotificationData) {
      setNotificationData({
        type: "error",
        title: "بيانات غير صحيحة",
        details:
          "اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
        visibility: true,
      });
    }

    return false;
  } finally {
    // إنهاء حالة التحميل
    if (setLoading) setLoading(false);
  }
}

async function getFieldsByUserId(userId) {
  try {
    const response = await axios.get(
      `${config.apiBaseUrl}/Fields/GetFieldsByUserId`,
      {
        headers: {
          userId: userId,
        },
      }
    );

    return response?.data?.data?.response || [];
  } catch (error) {
    console.error("Error fetching fields by userId:", error);
    return [];
  }
}

export { getUserByAuth };

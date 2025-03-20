import config from "../../global/config";
import axios from "axios";

async function newUserAsync(user, setLoading, setNotificationData, navigate) {
  try {
    if (setLoading) setLoading(true);

    // إعداد بيانات المستخدم لإرسالها إلى الـ API
    const userPayload = {
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      password: user.password,
      profileImageURL: user.profileImageURL || "",
      profileImageName: user.profileImageName || "",
      fileds: user.interests || ["غير ذلك"], // تحويل الاهتمامات إلى الحقل المطلوب
    };

    // إرسال الطلب إلى API
    const response = await axios.post(
      `${config.apiBaseUrl}/Users/NewUser`,
      userPayload
    );

    // التحقق من نجاح العملية
    if (response?.data?.status) {
      if (setNotificationData) {
        setNotificationData({
          type: "success",
          title: "تم إنشاء الحساب بنجاح",
          details: "تم تسجيل المستخدم بنجاح. يمكنك الآن تسجيل الدخول.",
          visibility: true,
        });
      }

      localStorage.setItem("username", user?.email);
      localStorage.setItem("password", user?.password);
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      navigate("/login");
      return true;
    } else {
      throw new Error(response?.data?.message || "فشل إنشاء المستخدم.");
    }
  } catch (error) {
    console.error("خطأ في إنشاء المستخدم:", error);

    if (setNotificationData) {
      setNotificationData({
        type: "error",
        title: "خطأ في إنشاء الحساب",
        details: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة لاحقًا.",
        visibility: true,
      });
    }

    return false;
  } finally {
    if (setLoading) setLoading(false);
  }
}

export default newUserAsync;

export { newUserAsync };

import React, { useState, useContext } from "react";
import { appContext } from "../../global/contexts/appContext";
import {
  Steps,
  Button,
  Form,
  Input,
  Card,
  message,
  Checkbox,
  Row,
  Col,
} from "antd";
import "./registration.css";
import { newUserAsync } from "./registrationLogic";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;
// const { Option } = Select;Select

export default function Registration() {
  const navigate = useNavigate();
  const { setNotificationData, setLoader } = useContext(appContext);
  const [current, setCurrent] = useState(0);
  const [userData, setUserData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    verificationCode: "",
    interests: [],
  });
  const [form] = Form.useForm();

  // مجالات المستخدم الثابتة
  const availableInterests = [
    { id: 1, name: "برمجة" },
    { id: 2, name: "تصميم" },
    { id: 3, name: "تسويق" },
  ];

  // تحديث بيانات المستخدم
  const updateUserData = (values) => {
    setUserData({ ...userData, ...values });
  };

  const next = async () => {
    try {
      if (current === 0) {
        // التحقق من بيانات الخطوة الأولى
        const values = await form.validateFields();
        updateUserData(values);
        // هنا يمكنك إضافة كود لإرسال رمز التحقق إلى البريد الإلكتروني
        message.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      } else if (current === 1) {
        // التحقق من رمز التحقق
        const values = await form.validateFields();
        updateUserData(values);
        message.success("تم التحقق من الرمز بنجاح");
      }
      setCurrent(current + 1);
      form.resetFields();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  // العودة إلى الخطوة السابقة
  const prev = () => {
    setCurrent(current - 1);
    form.resetFields();
  };

  // إرسال النموذج النهائي
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...userData, interests: values.interests };

      newUserAsync(finalData, setLoader, setNotificationData, navigate);

      form.resetFields();
      setCurrent(0);
      setUserData({
        fullName: "",
        userName: "",
        email: "",
        password: "",
        verificationCode: "",
        interests: [],
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  // محتوى الخطوة الأولى: البيانات الشخصية
  const step1Content = (
    <Form
      form={form}
      layout="vertical"
      name="personalInfo"
      initialValues={{
        fullName: userData.fullName,
        userName: userData.userName,
        email: userData.email,
        password: userData.password,
      }}
    >
      <Form.Item
        name="fullName"
        label="الاسم الكامل"
        rules={[
          { required: true, max: 25, message: "الرجاء إدخال الاسم الكامل" },
        ]}
      >
        <Input placeholder="أدخل الاسم الكامل" max={5} />
      </Form.Item>

      <Form.Item
        name="userName"
        label="اسم المستخدم"
        rules={[
          { required: true, max: 25, message: "الرجاء إدخال اسم المستخدم" },
        ]}
      >
        <Input placeholder="أدخل اسم المستخدم" />
      </Form.Item>

      <Form.Item
        name="email"
        label="البريد الإلكتروني"
        rules={[
          {
            required: true,
            max: 150,
            message: "الرجاء إدخال البريد الإلكتروني",
          },
          { type: "email", message: "البريد الإلكتروني غير صحيح" },
        ]}
      >
        <Input placeholder="أدخل البريد الإلكتروني" />
      </Form.Item>

      <Form.Item
        name="password"
        label="كلمة المرور"
        rules={[
          { required: true, max: 25, message: "الرجاء إدخال كلمة المرور" },
          { min: 8, message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف" },
        ]}
      >
        <Input.Password placeholder="أدخل كلمة المرور" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="تأكيد كلمة المرور"
        dependencies={["password"]}
        rules={[
          { required: true, max: 25, message: "الرجاء تأكيد كلمة المرور" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("كلمتا المرور غير متطابقتين"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="أكد كلمة المرور" />
      </Form.Item>
    </Form>
  );

  // محتوى الخطوة الثانية: رمز التحقق
  const step2Content = (
    <Form
      form={form}
      layout="vertical"
      name="verification"
      initialValues={{
        verificationCode: userData.verificationCode,
      }}
    >
      <div className="verification-info">
        <p>تم إرسال رمز التحقق إلى بريدك الإلكتروني {userData.email}</p>
        <p>يرجى إدخال الرمز لتأكيد حسابك</p>
        <p className="info">
          <strong>تنويه:</strong> نظراً لكون النظام في مرحلة التطوير، يرجى
          استخدام
          <strong className="code"> 123456 </strong> كرمز تحقق لإكمال العملية.
        </p>
      </div>

      <Form.Item
        name="verificationCode"
        label="رمز التحقق"
        rules={[
          { required: true, message: "الرجاء إدخال رمز التحقق" },
          { len: 6, message: "رمز التحقق يجب أن يكون 6 أرقام" },
        ]}
      >
        <Input placeholder="أدخل رمز التحقق المكون من 6 أرقام" maxLength={6} />
      </Form.Item>

      <Button
        type="link"
        title="قريباً"
        disabled
        onClick={() => message.info("تم إعادة إرسال الرمز")}
      >
        إعادة إرسال الرمز
      </Button>
    </Form>
  );

  // محتوى الخطوة الثالثة: المجالات
  const step3Content = (
    <Form
      form={form}
      layout="vertical"
      name="interests"
      initialValues={{
        interests: userData.interests,
      }}
    >
      <Form.Item
        name="interests"
        label="اختر مجالاتك"
        rules={[
          { required: true, message: "الرجاء اختيار مجال واحد على الأقل" },
        ]}
      >
        <Checkbox.Group style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            {availableInterests.map((interest) => (
              <Col span={8} key={interest.id}>
                {/* 
                value={interest.name}
                لخزن اسماء المجالات 
                */}
                <Checkbox value={interest.name}>{interest.name}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );

  // تحديد محتوى الخطوة الحالية
  const steps = [
    {
      title: "تسجيل البيانات",
      content: step1Content,
    },
    {
      title: "التحقق",
      content: step2Content,
    },
    {
      title: "المجالات",
      content: step3Content,
    },
  ];

  return (
    <div className="registration-container light">
      <Card className="registration-card">
        <h1 className="registration-title">إنشاء حساب جديد</h1>

        <Steps current={current} className="registration-steps">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div className="steps-content">{steps[current].content}</div>

        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              التالي
            </Button>
          )}

          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit}>
              إنشاء الحساب
            </Button>
          )}

          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              السابق
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

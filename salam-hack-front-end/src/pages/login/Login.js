import React, { useState, useEffect, useContext } from "react";
import { appContext } from "../../global/contexts/appContext";
import { Form, Input, Button, Card, Checkbox, Divider, Tooltip } from "antd";
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { getUserByAuth } from "./loginLogic";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../global/reducers/currentUserReducer";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    setNotificationData,
    // setModal,
    setLoader,
  } = useContext(appContext);

  const [form] = Form.useForm();
  const [hovered, setHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    form.setFieldsValue({
      identifier: localStorage.getItem("username") || "",
      password: localStorage.getItem("password") || "",
    });
  }, []);

  const handleLogin = (values) => {
    getUserByAuth(
      values?.identifier,
      values?.password,
      values?.remember,
      setLoader,
      setNotificationData,
      dispatch,
      setCurrentUser,
      navigate
    );
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const identifierRules = [
    {
      required: true,
      message: "الرجاء إدخال اسم المستخدم أو البريد الإلكتروني!",
    },
    {
      min: 4,
      message: "يجب أن يكون اسم المستخدم أو البريد الإلكتروني على الأقل 4 أحرف",
    },
    {
      max: 150,
      message: "يجب ألا يتجاوز اسم المستخدم أو البريد الإلكتروني 150 حرفاً",
    },
  ];

  const passwordRules = [
    { required: true, message: "الرجاء إدخال كلمة المرور!" },
    { min: 8, message: "يجب أن تكون كلمة المرور على الأقل 8 أحرف" },
    { max: 25, message: "يجب ألا تتجاوز كلمة المرور 25 حرفاً" },
  ];

  // تأثير تحميل متناوب للأزرار
  const loadingEffect = <>تسجيل الدخول</>;

  return (
    <div className="login-container light">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      <Card className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="var(--primary-color)"
              />
              <path
                d="M2 17L12 22L22 17M2 12L12 17L22 12"
                stroke="var(--primary-color)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="login-title">تسجيل الدخول</h1>
          <p className="login-subtitle">
            مرحباً بك! الرجاء إدخال بيانات الدخول للمتابعة
          </p>
        </div>

        <Form
          form={form}
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="identifier"
            label="اسم المستخدم أو البريد الإلكتروني"
            rules={identifierRules}
            validateTrigger={["onChange", "onBlur"]}
            tooltip={{
              title: "أدخل اسم المستخدم أو بريدك الإلكتروني المسجل",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input
              prefix={
                <UserOutlined
                  className={`field-icon ${
                    focusedField === "identifier" ? "field-icon-active" : ""
                  }`}
                />
              }
              placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
              className="login-input"
              dir="rtl"
              size="large"
              spellCheck="false"
              autoComplete="username"
              onFocus={() => handleFocus("identifier")}
              onBlur={handleBlur}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="كلمة المرور"
            rules={passwordRules}
            validateTrigger={["onChange", "onBlur"]}
            tooltip={{
              title: "يجب أن تتكون من 8 أحرف على الأقل",
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input.Password
              prefix={
                <LockOutlined
                  className={`field-icon ${
                    focusedField === "password" ? "field-icon-active" : ""
                  }`}
                />
              }
              placeholder="أدخل كلمة المرور"
              className="login-input"
              dir="rtl"
              size="large"
              autoComplete="current-password"
              onFocus={() => handleFocus("password")}
              onBlur={handleBlur}
            />
          </Form.Item>

          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="remember-me">تذكرني</Checkbox>
            </Form.Item>
            <Button type="link" className="forgot-password">
              نسيت كلمة المرور؟
            </Button>
          </div>

          <Form.Item className="login-buttons">
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={false}
              disabled={false}
            >
              {loadingEffect}
            </Button>
          </Form.Item>

          <div className="login-footer">
            <Divider className="login-divider">أو</Divider>
            <div className="social-login">
              <Tooltip title={hovered ? "قريباً" : ""} placement="top">
                <Button
                  type="default"
                  className={`social-button google-button ${
                    hovered ? "disabled" : ""
                  }`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  تسجيل الدخول باستخدام Google
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.057-1.036-.202-1.626z"
                      fill="#4285F4"
                    />
                  </svg>
                </Button>
              </Tooltip>
            </div>
            <div className="signup-option">
              ليس لديك حساب؟{" "}
              <Link to={"/registration"} className="sign-up">
                تسجيل جديد
              </Link>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}

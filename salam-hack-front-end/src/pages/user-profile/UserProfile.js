import React, { useState } from "react";
import "./userProfile.css";
import { useSelector } from "react-redux";
import {
  Card,
  Avatar,
  Typography,
  Divider,
  Descriptions,
  Tag,
  Tabs,
  Form,
  Input,
  Button,
  Select,
  notification,
  Space,
  Tooltip,
  Row,
  Col
} from "antd";
import { 
  FaUser, 
  FaEdit, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaTags, 
  FaInfoCircle, 
  FaLock, 
  FaSave, 
  FaTrash, 
  FaPlus,
  FaShieldAlt,
  FaIdCard,
  FaHistory
} from "react-icons/fa";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// مكونات فرعية للتنظيم
const ProfileHeader = ({ user, getInitial }) => (
  <div className="profile-header">
    <div className="profile-avatar-container">
      <Avatar
        size={100}
        className="profile-avatar"
        style={{ 
          backgroundColor: "var(--primary-light)", 
          color: "var(--primary-color)",
          fontSize: "40px",
          fontWeight: "bold" 
        }}
      >
        {getInitial(user.fullName)}
      </Avatar>
    </div>
    <div className="profile-basic-info">
      <Title level={2} className="profile-name">
        {user.fullName}
      </Title>
      <Text className="profile-username">@{user.userName}</Text>
      <div className="profile-badges">
        {user.fields.map((field, index) => (
          <Tag color="blue" key={index} className="profile-badge">
            {field.name}
          </Tag>
        ))}
      </div>
    </div>
  </div>
);

const ProfileInfo = ({ user, formatDate }) => (
  <Card bordered={false} className="user-info-card">
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <div className="info-item">
          <div className="info-label">
            <FaIdCard className="info-icon" />
            <span>الاسم الكامل</span>
          </div>
          <div className="info-value">{user.fullName}</div>
        </div>
      </Col>
      <Col xs={24} md={12}>
        <div className="info-item">
          <div className="info-label">
            <FaUser className="info-icon" />
            <span>اسم المستخدم</span>
          </div>
          <div className="info-value">{user.userName}</div>
        </div>
      </Col>
      <Col xs={24} md={12}>
        <div className="info-item">
          <div className="info-label">
            <FaEnvelope className="info-icon" />
            <span>البريد الإلكتروني</span>
          </div>
          <div className="info-value">{user.email}</div>
        </div>
      </Col>
      <Col xs={24} md={12}>
        <div className="info-item">
          <div className="info-label">
            <FaCalendarAlt className="info-icon" />
            <span>تاريخ التسجيل</span>
          </div>
          <div className="info-value">{formatDate(user.registrationDate)}</div>
        </div>
      </Col>
      <Col span={24}>
        <div className="info-item">
          <div className="info-label">
            <FaTags className="info-icon" />
            <span>المجالات</span>
          </div>
          <div className="info-value">
            <Space wrap>
              {user.fields.map((field, index) => (
                <Tag color="blue" key={index} className="field-tag">
                  {field.name}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      </Col>
    </Row>
  </Card>
);

const ProfileEdit = ({ user, form, showComingSoonNotification }) => (
  <Card bordered={false} className="edit-form-card">
    <div className="coming-soon-notice">
      <FaInfoCircle className="notice-icon" />
      <Text type="warning" italic>
        هذه الميزة ستكون متاحة قريبًا. شكرًا لصبرك!
      </Text>
    </div>
    
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        fullName: user.fullName,
        userName: user.userName,
        email: user.email
      }}
      className="edit-form"
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="fullName"
            label="الاسم الكامل"
            rules={[{ required: true, message: 'الرجاء إدخال الاسم الكامل' }]}
          >
            <Input 
              prefix={<FaUser className="input-icon" />} 
              disabled={true}
              className="disabled-input"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            name="userName"
            label="اسم المستخدم"
            rules={[{ required: true, message: 'الرجاء إدخال اسم المستخدم' }]}
          >
            <Input 
              prefix={<FaUser className="input-icon" />} 
              disabled={true}
              className="disabled-input"
            />
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item
            name="email"
            label="البريد الإلكتروني"
            rules={[
              { required: true, message: 'الرجاء إدخال البريد الإلكتروني' },
              { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
            ]}
          >
            <Input 
              prefix={<FaEnvelope className="input-icon" />} 
              disabled={true}
              className="disabled-input"
            />
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item
            name="fields"
            label="المجالات"
          >
            <div className="fields-section">
              <Space wrap>
                {user.fields.map((field, index) => (
                  <Tag color="blue" key={index} className="field-tag">
                    {field.name}
                  </Tag>
                ))}
              </Space>
              <div className="fields-actions">
                <Tooltip title="هذه الميزة ستكون متاحة قريبًا">
                  <Button 
                    type="default" 
                    className="action-button"
                    icon={<FaPlus className="button-icon" />}
                    disabled={true}
                    onClick={showComingSoonNotification}
                  >
                    إضافة مجال
                  </Button>
                </Tooltip>
                <Tooltip title="هذه الميزة ستكون متاحة قريبًا">
                  <Button 
                    danger 
                    className="action-button"
                    icon={<FaTrash className="button-icon" />}
                    disabled={true}
                    onClick={showComingSoonNotification}
                  >
                    حذف مجال
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item>
        <Button 
          type="primary" 
          block
          className="save-button"
          disabled={true}
          onClick={showComingSoonNotification}
          icon={<FaSave className="button-icon" />}
        >
          حفظ التغييرات
        </Button>
      </Form.Item>
    </Form>
  </Card>
);

const SecuritySettings = ({ showComingSoonNotification }) => (
  <Card bordered={false} className="security-card">
    <div className="security-container">
      <div className="security-icon-container">
        <FaShieldAlt className="security-icon" />
      </div>
      <Title level={4} className="security-title">إعدادات الأمان</Title>
      <Paragraph className="security-text">
        هنا يمكنك تغيير كلمة المرور الخاصة بك وتفعيل المصادقة الثنائية وتحديث إعدادات الأمان الأخرى.
      </Paragraph>
      <div className="coming-soon-notice">
        <FaInfoCircle className="notice-icon" />
        <Text type="warning" italic>
          إعدادات الأمان ستكون متاحة قريبًا. شكرًا لصبرك!
        </Text>
      </div>
      <div className="security-actions">
        <Button 
          type="primary" 
          icon={<FaLock className="button-icon" />}
          disabled={true}
          onClick={showComingSoonNotification}
        >
          تغيير كلمة المرور
        </Button>
        <Button
          type="default"
          icon={<FaShieldAlt className="button-icon" />}
          disabled={true}
          onClick={showComingSoonNotification}
        >
          تفعيل المصادقة الثنائية
        </Button>
      </div>
    </div>
  </Card>
);

const ActivityLog = ({ showComingSoonNotification }) => (
  <Card bordered={false} className="activity-card">
    <div className="activity-container">
      <div className="activity-icon-container">
        <FaHistory className="activity-icon" />
      </div>
      <Title level={4} className="activity-title">سجل النشاط</Title>
      <Paragraph className="activity-text">
        هنا يمكنك مراجعة نشاطات حسابك الأخيرة وتسجيلات الدخول وغيرها من الأنشطة.
      </Paragraph>
      <div className="coming-soon-notice">
        <FaInfoCircle className="notice-icon" />
        <Text type="warning" italic>
          سجل النشاط سيكون متاحًا قريبًا. شكرًا لصبرك!
        </Text>
      </div>
    </div>
  </Card>
);

// المكون الرئيسي
export default function UserProfile() {
  const user = useSelector((state) => state.currentUser);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("info");

  // عرض الحرف الأول من اسم المستخدم
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // عرض إشعار ميزة قادمة قريباً
  const showComingSoonNotification = () => {
    notification.info({
      message: "ميزة قادمة قريباً",
      description: "هذه الميزة ستكون متاحة قريبًا. شكرًا لصبرك!",
      placement: "topRight",
      rtl: true
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="rtl user-profile-page">
      <Card
        className="user-profile-container"
        bordered={false}
      >
        <ProfileHeader user={user} getInitial={getInitial} />
        
        <Divider />
        
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          className="profile-tabs"
          centered
        >
          <TabPane 
            tab={
              <span className="tab-item">
                <FaInfoCircle className="tab-icon" />
                <span>معلومات الحساب</span>
              </span>
            } 
            key="info"
          >
            <ProfileInfo user={user} formatDate={formatDate} />
          </TabPane>
          
          <TabPane 
            tab={
              <span className="tab-item">
                <FaEdit className="tab-icon" />
                <span>تعديل البيانات</span>
              </span>
            } 
            key="edit"
          >
            <ProfileEdit 
              user={user} 
              form={form} 
              showComingSoonNotification={showComingSoonNotification} 
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span className="tab-item">
                <FaLock className="tab-icon" />
                <span>الأمان</span>
              </span>
            } 
            key="security"
          >
            <SecuritySettings showComingSoonNotification={showComingSoonNotification} />
          </TabPane>
          
          <TabPane 
            tab={
              <span className="tab-item">
                <FaHistory className="tab-icon" />
                <span>سجل النشاط</span>
              </span>
            } 
            key="activity"
          >
            <ActivityLog showComingSoonNotification={showComingSoonNotification} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
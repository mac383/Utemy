import React, { useState } from "react";
import "./faq.css";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Sample FAQ data
  const faqData = [
    {
      question: "ما هي منصة Utemy؟",
      answer:
        "منصة Utemy هي منصة تعليمية متكاملة تقوم بجلب الدورات من اليوتيوب وعرضها بشكل احترافي. توفر المنصة إمكانية إضافة ملاحظات نصية وملفات PDF لكل درس، مع تتبع الدروس المكتملة.",
    },
    {
      question: "كيف يمكنني تتبع تقدمي في الدورات؟",
      answer:
        "يوفر Utemy نظام تتبع متكامل يسمح لك بمعرفة الدروس التي أكملتها والدروس المتبقية. يمكنك الاطلاع على تقدمك من خلال لوحة التحكم الخاصة بك، والتي تعرض نسبة الإكمال لكل دورة تقوم بدراستها.",
    },
    {
      question: "هل يمكنني إضافة ملاحظات للدروس؟",
      answer:
        "نعم، توفر منصة Utemy خاصية إضافة ملاحظات نصية لكل درس. يمكنك تدوين النقاط المهمة أثناء مشاهدة الدرس والعودة إليها لاحقاً للمراجعة. هذه الميزة تساعدك على تنظيم تعلمك وتحسين استيعابك للمحتوى.",
    },
    {
      question: "هل يمكنني إضافة ملفات PDF للدروس؟",
      answer:
        "بالتأكيد، يمكنك إضافة ملفات PDF لكل درس في المنصة. هذه الميزة مفيدة لإرفاق المراجع والمصادر الإضافية التي تساعدك في فهم محتوى الدرس بشكل أفضل.",
    },
    {
      question: "هل المنصة مجانية؟",
      answer:
        "تقدم منصة Utemy خطة مجانية تتيح لك الوصول إلى عدد محدود من الدورات، بالإضافة إلى خطط مدفوعة توفر ميزات إضافية مثل تنزيل المحتوى للمشاهدة بدون اتصال بالإنترنت، وإمكانية الوصول إلى جميع الدورات المتاحة على المنصة.",
    },
    {
      question: "كيف يمكنني التواصل مع الدعم الفني؟",
      answer:
        "يمكنك التواصل مع فريق الدعم الفني من خلال إرسال رسالة عبر صفحة 'اتصل بنا' أو عبر البريد الإلكتروني support@utemy.com. نحن نسعى للرد على جميع الاستفسارات خلال 24 ساعة.",
    },
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>الأسئلة الشائعة</h1>
        <p>نقدم لك إجابات على أكثر الأسئلة شيوعاً حول منصة Utemy</p>
      </div>

      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              <h3>{faq.question}</h3>
              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            <div
              className={`faq-answer ${activeIndex === index ? "open" : ""}`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-contact">
        <h2>لم تجد إجابة لسؤالك؟</h2>
        <p>يمكنك التواصل معنا مباشرة وسنقوم بالرد عليك في أقرب وقت ممكن</p>
        <p className="contact-item">info@utemy.com</p>
      </div>
    </div>
  );
}

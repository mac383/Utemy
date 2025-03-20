import React, { useState, useEffect } from "react";
import "./aIStudyHelper.css";
import { getGptResponse } from "../../../pages/lessonQuiz/lessonQuizLogic";
// استيراد مكتبات KaTeX
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default function AIStudyHelper({ lessonTitle, courseTitle }) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState(null);
  const [showAIDisclaimer, setShowAIDisclaimer] = useState(true);

  // دالة لتوليد الprompt المحسن
  const generatePrompt = (lessonTitle, courseTitle) => {
    return `قم بتقديم شرح تعليمي شامل ومتميز لموضوع "${lessonTitle}" في مقرر "${
      courseTitle || "غير محدد"
    }" بأسلوب رسمي ومنهجي مع التركيز على الجوانب التطبيقية:
  
  ### الهيكل العام
  1. **مقدمة موضوعية**: تقديم تعريف دقيق للموضوع وبيان أهميته وتطبيقاته العملية
  2. **المفاهيم الأساسية**: عرض المفاهيم الرئيسية بلغة رسمية واضحة مع ربطها بالتطبيقات العملية
  3. **تطبيقات عملية**: تقديم 2-3 أمثلة عملية تفصيلية لكل مفهوم مع شرح الخطوات التطبيقية
  4. **الحالات العملية**: عرض حالات واقعية توضح كيفية تطبيق هذه المفاهيم في سياقات مختلفة
  5. **الممارسات المثلى**: تقديم إرشادات عملية وأفضل الممارسات المتبعة في هذا المجال
  6. **الخلاصة**: تلخيص منظم للنقاط الرئيسية والتطبيقات العملية الأساسية
  
  ### التنسيق والأسلوب
  - استخدم عناوين رئيسية (##) وفرعية (###) بتسلسل منطقي
  - قسم المحتوى إلى فقرات محددة وموضوعية
  - استخدم تعدادات نقطية (•) لتنظيم القوائم والخطوات العملية
  - أدرج جداول لعرض البيانات المقارنة أو المعلومات التطبيقية (باستخدام صيغة Markdown)
  - التزم بأسلوب رسمي ومنهجي كما في المقالات المتخصصة
  
  ### الأمثلة والتوضيحات
  - قدم أمثلة عملية واقعية مع شرح تفصيلي لكل خطوة
  - اشرح الإجراءات العملية بوضوح مع توضيح الأسباب والنتائج
  - أدرج رسوم توضيحية أو تمثيلات بيانية إن أمكن (باستخدام الوصف النصي)
  - اربط بين النظرية والتطبيق بشكل منهجي ومنظم
  
  ### المعادلات والصيغ (إن وجدت)
  - استخدم صيغة KaTeX للمعادلات والرموز:
    * للمعادلات داخل النص: $x^2 + y^2 = z^2$
    * للمعادلات المستقلة: $$E = mc^2$$
  - قدم شرحاً تطبيقياً لكل معادلة توضح استخدامها العملي
  - وضح المتغيرات والثوابت بدقة مع إعطاء أمثلة رقمية
  
  ### الخاتمة
  - قدم ملخصاً شاملاً للنقاط الرئيسية والتطبيقات
  - اقترح مجالات تطبيقية إضافية للمفاهيم المشروحة
  - أضف 3-5 أسئلة تطبيقية مع إجاباتها النموذجية لتقييم الفهم
  
  قدم المحتوى بصيغة Markdown الكاملة، مع استخدام تنسيقات مثل **نص غامق** و *نص مائل* والعناوين المناسبة لإضفاء الطابع الرسمي وتحسين تنظيم المحتوى وسهولة متابعته.`;
  };

  // دالة لمعالجة أخطاء KaTeX
  const processKatexInMarkdown = (text) => {
    let processed = text;

    // إصلاح بعض مشاكل KaTeX الشائعة
    processed = processed.replace(/\\([\(\)\[\]])/g, "\\$1");

    return processed;
  };

  // دالة لطلب الشرح من الذكاء الاصطناعي
  const fetchExplanation = async () => {
    if (!lessonTitle) return;

    try {
      setLoading(true);
      setError(null);
      const prompt = generatePrompt(lessonTitle, courseTitle);
      const response = await getGptResponse(prompt, setLoading);
      setExplanation(processKatexInMarkdown(response));
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الشرح. يرجى المحاولة مرة أخرى.");
      console.error("Error fetching AI explanation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    fetchExplanation();
  };

  // دالة لإخفاء إشعار الذكاء الاصطناعي
  const hideAIDisclaimer = () => {
    setShowAIDisclaimer(false);
  };

  // استدعاء الدالة عند تغيير عنوان الدرس
  useEffect(() => {
    if (lessonTitle) {
      fetchExplanation();
    } else {
      setExplanation("");
    }
  }, [lessonTitle]);

  return (
    <div className="ai-study-helper">
      {showAIDisclaimer && (
        <div className="ai-disclaimer">
          <div className="ai-disclaimer-content">
            <div className="ai-icon">🤖</div>
            <div className="ai-message">
              <p>
                هذا الشرح تم توليده بواسطة الذكاء الاصطناعي وقد يحتاج إلى
                مراجعة. يرجى التحقق من المعلومات المقدمة.
              </p>
            </div>
            <button className="ai-disclaimer-close" onClick={hideAIDisclaimer}>
              ×
            </button>
          </div>
        </div>
      )}

      <div className="ai-study-header">
        <h2>شرح درس: {lessonTitle}</h2>
        {!loading && explanation && (
          <button
            className="reload-button"
            onClick={handleReload}
            title="إعادة توليد الشرح"
          >
            ⟳
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحضير الشرح المفصل...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-button" onClick={handleReload}>
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <div className="explanation-content">
          {explanation ? (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ node, ...props }) => (
                  <h2 className="ai-heading-1" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h3 className="ai-heading-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h4 className="ai-heading-3" {...props} />
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="code-container">
                      <pre className="code-block">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                table: ({ node, ...props }) => (
                  <table className="ai-table" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="ai-list" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="ai-ordered-list" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="ai-blockquote" {...props} />
                ),
              }}
            >
              {explanation}
            </ReactMarkdown>
          ) : (
            <div className="no-content">
              <p>لم يتم العثور على شرح. يرجى المحاولة مرة أخرى.</p>
              <button className="primary-button" onClick={handleReload}>
                توليد الشرح
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

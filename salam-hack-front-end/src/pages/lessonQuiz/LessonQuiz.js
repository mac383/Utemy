import React, { useState, useEffect, useContext } from "react";
import { appContext } from "../../global/contexts/appContext";
import { getPageDetails } from "../../global/utils/functions";
import { getGptResponse } from "./lessonQuizLogic";
import {
  Card,
  Typography,
  Button,
  Radio,
  Space,
  Progress,
  Steps,
  Alert,
  Spin,
  Result,
  Badge,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  RightOutlined,
  ReloadOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const generateAIPrompt = (lessonTitle, playlistTitle) => {
  if (!lessonTitle || !playlistTitle) {
    return "";
  }

  return `أنت مساعد لإنشاء أسئلة اختبار. اتبع التعليمات بدقة:

INSTRUCTIONS:
1. أنشئ 5 أسئلة اختبار متعددة الخيارات عن الدرس "${lessonTitle}" من الدورة التدريبية "${playlistTitle}".
2. لكل سؤال، قدم 4 خيارات بالضبط مع إجابة واحدة صحيحة.
3. قدم الاستجابة بتنسيق JSON صالح فقط، بدون أي نص مقدمة أو شرح إضافي.
4. استخدم التنسيق التالي بالضبط:

[
  {
    "question": "نص السؤال هنا",
    "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
    "correctAnswer": 0,
    "explanation": "شرح مختصر لسبب صحة الإجابة\\n\\nيمكنك استخدام سطور متعددة للشرح بوضوح أكثر.\\n\\nاستخدم \\n للانتقال إلى سطر جديد عند الحاجة."
  },
  {
    "question": "نص السؤال الثاني هنا",
    "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
    "correctAnswer": 2,
    "explanation": "شرح مختصر لسبب صحة الإجابة"
  }
]

هام جداً:
- قيمة correctAnswer يجب أن تكون رقماً صحيحاً بين 0 و 3 يمثل رقم الخيار الصحيح (الفهرس).
- لا تضف أي نص قبل أو بعد الـ JSON.
- لا تستخدم أقواس اقتباس ثلاثية أو علامات markdown.
- تأكد من أن الـ JSON صالح 100% ويمكن تحليله مباشرة.
- تأكد من أن الأسئلة متنوعة وتغطي نقاط مهمة من الدرس.
- استخدم رمز \`\`\` فقط إذا كان السؤال يتضمن كود برمجي.
- في حقل explanation، استخدم \\n للانتقال إلى سطر جديد لتنظيم الشرح بشكل أفضل.
- قدم شرحاً واضحاً ومفصلاً للإجابة الصحيحة، مستخدماً التنسيق المناسب.
- تأكد من أن الأسئلة واضحة ومباشرة وذات صلة مباشرة بمحتوى الدرس.`;
};

// دالة مساعدة لتنظيف بيانات JSON واستخراجها من استجابة AI
const parseAIResponse = (response) => {
  try {
    let jsonStr = response;
    const startIndex = jsonStr.indexOf("[");
    const endIndex = jsonStr.lastIndexOf("]") + 1;

    if (startIndex !== -1 && endIndex !== -1) {
      jsonStr = jsonStr.substring(startIndex, endIndex);
    }

    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "");
    const parsedData = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error("البيانات المستلمة ليست بالتنسيق المتوقع");
    }

    const validQuestions = parsedData.filter(
      (q) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === "number" &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3 &&
        q.explanation
    );

    return validQuestions;
  } catch (error) {
    console.error("خطأ في تحليل استجابة AI:", error);
    return [];
  }
};

export default function LessonQuiz() {
  const { setLoader, setNotificationData } = useContext(appContext);
  const [pageDetails, setPageDetails] = useState({
    lessonTitle: getPageDetails().lessonQuiz?.lessonTitle,
    playlistTitle: getPageDetails().lessonQuiz?.playlistTitle,
  });

  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generatedPrompt = generateAIPrompt(
      pageDetails.lessonTitle,
      pageDetails.playlistTitle
    );
    setPrompt(generatedPrompt);
  }, [pageDetails]);

  const fetchQuestionsFromAI = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await getGptResponse(
        prompt,
        setLoader,
        setNotificationData
      );
      const parsedQuestions = parseAIResponse(response);

      if (parsedQuestions.length === 0) {
        throw new Error("لم يتم استلام أسئلة صالحة من AI");
      }

      setQuestions(parsedQuestions);
    } catch (error) {
      console.error("خطأ في جلب الأسئلة:", error);
      setError("حدث خطأ أثناء تحميل الأسئلة. يرجى المحاولة مرة أخرى.");
      setNotificationData({
        type: "error",
        message: "حدث خطأ في تحميل الأسئلة",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    fetchQuestionsFromAI();
  };

  const handleAnswerSelect = (e) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(e.target.value);
      // تقديم الإجابة مباشرة عند الاختيار
      const selectedValue = e.target.value;
      setIsAnswerSubmitted(true);

      if (selectedValue === questions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    // منع الانتقال إذا لم يتم اختيار إجابة
    if (selectedAnswer === null) {
      return;
    }

    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
    fetchQuestionsFromAI();
  };

  const getResultStatus = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 80)
      return { status: "success", message: "ممتاز! لقد أتقنت هذا الدرس" };
    if (percentage >= 60)
      return { status: "warning", message: "جيد! تحتاج إلى بعض المراجعة" };
    return { status: "error", message: "تحتاج إلى مراجعة الدرس مرة أخرى" };
  };

  return (
    <Card
      className="rtl"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        borderRadius: "12px",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <Typography.Title
        level={3}
        style={{
          textAlign: "center",
          marginBottom: "8px",
          color: "var(--primary-text-color)",
          fontWeight: "700",
        }}
      >
        اختبار الدرس: {pageDetails.lessonTitle}
      </Typography.Title>
      <Typography.Title
        level={5}
        style={{
          textAlign: "center",
          marginBottom: "24px",
          color: "var(--secondary-text-color)",
          fontWeight: "500",
        }}
      >
        {pageDetails.playlistTitle}
      </Typography.Title>

      {questions.length === 0 && !loading && !error && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <Paragraph
            style={{
              fontSize: "16px",
              marginBottom: "24px",
              color: "var(--secondary-text-color)",
            }}
          >
            اختبر معلوماتك حول هذا الدرس من خلال اختبار قصير مكون من 5 أسئلة.
            ستتمكن من معرفة مدى فهمك للمحتوى ونقاط القوة والضعف.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleStartQuiz}
            style={{
              borderRadius: "8px",
              height: "48px",
              fontSize: "16px",
              backgroundColor: "var(--primary-color)",
              borderColor: "var(--primary-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            ابدأ الاختبار
          </Button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 36, color: "var(--primary-color)" }}
                spin
              />
            }
          />
          <Typography.Paragraph
            style={{ marginTop: "16px", color: "var(--secondary-text-color)" }}
          >
            جاري تحضير الأسئلة...
          </Typography.Paragraph>
        </div>
      )}

      {error && !loading && (
        <Result
          status="error"
          title="فشلت عملية تحميل الأسئلة"
          subTitle={error}
          extra={
            <Button
              type="primary"
              onClick={handleStartQuiz}
              icon={<ReloadOutlined />}
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
              }}
            >
              حاول مرة أخرى
            </Button>
          }
        />
      )}

      {questions.length > 0 && !quizCompleted && !loading && (
        <div>
          <Steps
            current={currentQuestionIndex}
            size="small"
            style={{ marginBottom: "24px" }}
            items={questions.map((_, index) => ({
              title: `السؤال ${index + 1}`,
            }))}
            responsive={true}
            progressDot={true}
          />

          <div style={{ margin: "16px 0" }}>
            <Progress
              percent={((currentQuestionIndex + 1) / questions.length) * 100}
              size="small"
              showInfo={false}
              strokeColor="var(--primary-color)"
              trailColor="var(--divider-color)"
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "4px",
                color: "var(--text-light)",
                fontSize: "14px",
              }}
            >
              <span>
                السؤال {currentQuestionIndex + 1} من {questions.length}
              </span>
              <span>
                {Math.round(
                  ((currentQuestionIndex + 1) / questions.length) * 100
                )}
                %
              </span>
            </div>
          </div>

          <Card
            style={{
              marginTop: "16px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              backgroundColor: "var(--card-bg)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <Badge.Ribbon
              text={`السؤال ${currentQuestionIndex + 1}`}
              color="var(--primary-color)"
              style={{
                fontWeight: "500",
                borderRadius: "0 0 4px 4px",
              }}
            >
              <Typography.Title
                level={4}
                style={{
                  marginBottom: "24px",
                  paddingTop: "8px",
                  color: "var(--primary-text-color)",
                  fontWeight: "600",
                  lineHeight: "1.5",
                }}
              >
                {questions[currentQuestionIndex].question}
              </Typography.Title>
            </Badge.Ribbon>

            <Radio.Group
              onChange={handleAnswerSelect}
              value={selectedAnswer}
              style={{
                width: "100%", // تكملة الكود من حيث توقف (بعد style={{ width: "100%")
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "12px",
                        border: `1px solid ${
                          isAnswerSubmitted
                            ? index ===
                              questions[currentQuestionIndex].correctAnswer
                              ? "var(--success-color)"
                              : selectedAnswer === index &&
                                selectedAnswer !==
                                  questions[currentQuestionIndex].correctAnswer
                              ? "var(--error-color)"
                              : "var(--border-color)"
                            : "var(--border-color)"
                        }`,
                        borderRadius: "8px",
                        padding: "0",
                        backgroundColor: isAnswerSubmitted
                          ? index ===
                            questions[currentQuestionIndex].correctAnswer
                            ? "rgba(16, 185, 129, 0.1)"
                            : selectedAnswer === index &&
                              selectedAnswer !==
                                questions[currentQuestionIndex].correctAnswer
                            ? "rgba(239, 68, 68, 0.1)"
                            : "var(--card-bg)"
                          : "var(--card-bg)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Radio
                        value={index}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          lineHeight: "1.6",
                          cursor: isAnswerSubmitted ? "default" : "pointer",
                          pointerEvents: isAnswerSubmitted ? "none" : "auto",
                        }}
                        disabled={isAnswerSubmitted}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              color: "var(--primary-text-color)",
                            }}
                          >
                            {option}
                          </span>
                          {isAnswerSubmitted &&
                            (index ===
                            questions[currentQuestionIndex].correctAnswer ? (
                              <CheckCircleFilled
                                style={{
                                  color: "var(--success-color)",
                                  fontSize: "18px",
                                }}
                              />
                            ) : (
                              selectedAnswer === index && (
                                <CloseCircleFilled
                                  style={{
                                    color: "var(--error-color)",
                                    fontSize: "18px",
                                  }}
                                />
                              )
                            ))}
                        </div>
                      </Radio>
                    </div>
                  )
                )}
              </Space>
            </Radio.Group>

            {isAnswerSubmitted && (
              <Alert
                message={
                  selectedAnswer ===
                  questions[currentQuestionIndex].correctAnswer
                    ? "إجابة صحيحة!"
                    : "إجابة غير صحيحة"
                }
                description={questions[currentQuestionIndex].explanation}
                type={
                  selectedAnswer ===
                  questions[currentQuestionIndex].correctAnswer
                    ? "success"
                    : "error"
                }
                showIcon
                style={{
                  marginTop: "24px",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <Button
                type="primary"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                icon={<RightOutlined />}
                style={{
                  backgroundColor:
                    selectedAnswer === null ? "#ccc" : "var(--primary-color)",
                  borderColor:
                    selectedAnswer === null ? "#ccc" : "var(--primary-color)",
                  opacity: selectedAnswer === null ? 0.7 : 1,
                  cursor: selectedAnswer === null ? "not-allowed" : "pointer",
                  borderRadius: "8px",
                }}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "السؤال التالي"
                  : "إنهاء الاختبار"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {quizCompleted && !loading && (
        <Result
          icon={<TrophyOutlined style={{ color: "var(--primary-color)" }} />}
          title={
            <Title level={3}>
              اكتمل الاختبار! النتيجة: {score}/{questions.length}
            </Title>
          }
          subTitle={
            <div>
              <Paragraph style={{ fontSize: "16px", marginBottom: "16px" }}>
                {getResultStatus().message}
              </Paragraph>
              <Progress
                type="circle"
                percent={Math.round((score / questions.length) * 100)}
                width={120}
                format={(percent) => `${percent}%`}
                status={getResultStatus().status}
                strokeColor={
                  getResultStatus().status === "success"
                    ? "var(--success-color)"
                    : getResultStatus().status === "warning"
                    ? "var(--warning-color)"
                    : "var(--error-color)"
                }
              />
            </div>
          }
          extra={
            <Button
              type="primary"
              onClick={handleRestartQuiz}
              icon={<ReloadOutlined />}
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                borderRadius: "8px",
              }}
            >
              أعد الاختبار
            </Button>
          }
        />
      )}
    </Card>
  );
}

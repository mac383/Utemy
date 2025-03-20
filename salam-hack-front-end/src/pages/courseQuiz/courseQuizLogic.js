import { getGptResponse } from "../lessonQuiz/lessonQuizLogic";

function generateExamPromptFromLessons(courseTitle) {
  return `أنت مساعد لإنشاء اختبار شامل. اتبع التعليمات بدقة:

INSTRUCTIONS:
1. أنشئ اختباراً شاملاً عن الدورة التدريبية "${courseTitle}" يتضمن ثلاثة أنواع من الأسئلة.
2. قدم الاستجابة بتنسيق JSON صالح فقط، بدون أي نص مقدمة أو شرح إضافي.
3. أنشئ بالضبط:
   - 10 أسئلة اختيار من متعدد (4 سهلة، 3 متوسطة، 3 صعبة، كل سؤال به 4 خيارات)
   - 10 أسئلة صح وخطأ (4 سهلة، 3 متوسطة، 3 صعبة)
   - 5 أسئلة نصية مفتوحة (2 سهلة، 2 متوسطة، 1 صعبة)

4. استخدم التنسيق التالي بالضبط لكل نوع من الأسئلة:

{
  "multipleChoice": [
    {
      "id": 1,
      "question": "نص السؤال هنا",
      "options": [
        "الخيار الأول", 
        "الخيار الثاني", 
        "الخيار الثالث", 
        "الخيار الرابع"
      ],
      "correctAnswer": 0
    }
  ],
  "trueFalse": [
    {
      "id": 11,
      "question": "العبارة هنا",
      "isTrue": true
    }
  ],
  "openText": [
    {
      "id": 21,
      "question": "سؤال مفتوح"
    }
  ]
}

هام جداً:
- تأكد من تهريب الرموز الخاصة بشكل صحيح في JSON، مثل استخدام \\\\ بدلاً من \\.
- قيمة correctAnswer يجب أن تكون رقماً صحيحاً بين 0 و 3 يمثل رقم الخيار الصحيح (الفهرس).
- قيمة isTrue يجب أن تكون boolean (true أو false).
- لا تضف أي نص قبل أو بعد الـ JSON.
- لا تستخدم أقواس اقتباس ثلاثية أو علامات markdown.
- تأكد من أن الـ JSON صالح 100% ويمكن تحليله مباشرة.
- تأكد من أن الأسئلة متنوعة وتغطي نقاط مهمة من الدورة.
- لا تقدم إجابة لأسئلة النص المفتوح.
- تأكد من أن الأسئلة واضحة ومباشرة وذات صلة مباشرة بمحتوى الدورة.
- استخدم ترقيم متسلسل للأسئلة: من 1 إلى 10 للاختيار من متعدد، من 11 إلى 20 للصح والخطأ، ومن 21 إلى 25 للنص المفتوح.
- تأكد من أن عدد الأسئلة صحيح تمامًا:
  - 10 أسئلة اختيار من متعدد (4 سهلة، 3 متوسطة، 3 صعبة).
  - 10 أسئلة صح وخطأ (4 سهلة، 3 متوسطة، 3 صعبة).
  - 5 أسئلة نصية مفتوحة (2 سهلة، 2 متوسطة، 1 صعبة).`;
}

const mockApiResponse = {
  multipleChoice: [
    {
      id: 1,
      question: "ما هو نوع البيانات الرئيسي في JavaScript؟",
      options: [
        "النصي (String)",
        "العددي (Number)",
        "المنطقي (Boolean)",
        "الكائني (Object)",
      ],
      correctAnswer: 3,
      explanation:
        "الكائني (Object) هو نوع البيانات الرئيسي في JavaScript لتمثيل البيانات بشكل هيكلي.",
    },
    // {
    //   id: 2,
    //   question: "ما هي الدالة التي تُستخدم لطباعة نص على الشاشة في JavaScript؟",
    //   options: ["log()", "print()", "display()", "alert()"],
    //   correctAnswer: 0,
    //   explanation:
    //     "دالة log() تُستخدم لطباعة نص على الشاشة في JavaScript باستخدام وحدة التحكم.",
    // },
    // {
    //   id: 3,
    //   question: "ما هو نتيجة التعبير typeof 42 في JavaScript؟",
    //   options: ["String", "Number", "Boolean", "Undefined"],
    //   correctAnswer: 1,
    //   explanation:
    //     "التعبير typeof 42 سيُعيد 'Number' لأن 42 هو قيمة عددية في JavaScript.",
    // },
    // {
    //   id: 4,
    //   question: "ما هو استخدام العامل === في JavaScript؟",
    //   options: [
    //     "الجمع بين أعداد",
    //     "المقارنة بين القيم بدون اهتمام بنوع البيانات",
    //     "المقارنة بين القيم مع اهتمام بنوع البيانات",
    //     "العملية الثلاثية",
    //   ],
    //   correctAnswer: 2,
    //   explanation:
    //     "العامل === يُستخدم للمقارنة بين القيم مع اهتمام بنوع البيانات في JavaScript.",
    // },
    // {
    //   id: 5,
    //   question: "ما نتيجة التعبير 10 + '20' في JavaScript؟",
    //   options: ["'1020'", "'30'", "30", "NaN"],
    //   correctAnswer: 0,
    //   explanation:
    //     "عند جمع عدد ونص في JavaScript، يتم دمجهما كنصوص. لذا 10 + '20' سيكون '1020'.",
    // },
    // {
    //   id: 6,
    //   question: "ما هو نتيجة التعبير NaN === NaN في JavaScript؟",
    //   options: ["true", "false", "NaN", "Undefined"],
    //   correctAnswer: 1,
    //   explanation:
    //     "التعبير NaN === NaN سيُعيد false؛ لأن NaN لا يُعادل نفسه في JavaScript.",
    // },
    // {
    //   id: 7,
    //   question: "ما هو تعريف الدالة في JavaScript؟",
    //   options: [
    //     "متغير يحتوي على قيمة",
    //     "كائن يحتوي على خصائص ووظائف",
    //     "سلسلة من الأوامر تنفذ عند الاستدعاء",
    //     "قيمة تُستخدم في العمليات الحسابية",
    //   ],
    //   correctAnswer: 2,
    //   explanation:
    //     "الدالة في JavaScript هي سلسلة من الأوامر التي تنفذ عند الاستدعاء لتنفيذ وظيفة معينة.",
    // },
    // {
    //   id: 8,
    //   question: "ما هي الطريقة الصحيحة لتعريف مصفوفة في JavaScript؟",
    //   options: ["{1, 2, 3}", "[1, 2, 3]", "(1, 2, 3)", "<1, 2, 3>"],
    //   correctAnswer: 1,
    //   explanation:
    //     "المصفوفة في JavaScript تُعرف بواسطة الأقواس المربعة [] مثل [1, 2, 3] لتحتوي على عناصر متعددة.",
    // },
    // {
    //   id: 9,
    //   question: "ما هي الطريقة الصحيحة لتعليق سطر في JavaScript؟",
    //   options: [
    //     "// تعليق السطر",
    //     "<!-- تعليق السطر -->",
    //     "'تعليق السطر",
    //     "**تعليق السطر**",
    //   ],
    //   correctAnswer: 0,
    //   explanation:
    //     "تُستخدم // لتعليق سطر في JavaScript لجعلها تُلاحظ من قبل المبرمجين وتتجاهلها من قبل المتصفح.",
    // },
    // {
    //   id: 10,
    //   question: "ما هي الدالة التي تُستخدم لتحويل نص إلى عدد في JavaScript؟",
    //   options: [
    //     "parseInt()",
    //     "convertToNumber()",
    //     "textToNumber()",
    //     "toInteger()",
    //   ],
    //   correctAnswer: 0,
    //   explanation:
    //     "دالة parseInt() تُستخدم لتحويل نص إلى عدد صحيح في JavaScript.",
    // },
  ],
  trueFalse: [
    {
      id: 11,
      question: "في JavaScript، 0 تُعتبر قيمة خاطئة (Falsy).",
      isTrue: true,
      explanation:
        "صحيح؛ في JavaScript، القيم المعادلة للقيمة البولية false تُعتبر قيم خاطئة (Falsy).",
    },
    // {
    //   id: 12,
    //   question: "في JavaScript، NaN يُعتبر قيمة صحيحة (Truthy).",
    //   isTrue: false,
    //   explanation:
    //     "خاطئ؛ في JavaScript، NaN تُعتبر قيمة خاطئة (Falsy) وليست قيمة صحيحة (Truthy).",
    // },
    // {
    //   id: 13,
    //   question: "في JavaScript، '0' == 0 تُعادل true.",
    //   isTrue: true,
    //   explanation:
    //     "صحيح؛ في JavaScript، عند المقارنة بين '0' كنص و 0 كرقم، تُعادل true بسبب تحويل النص إلى عدد.",
    // },
    // {
    //   id: 14,
    //   question: "في JavaScript، إذا قمت بعملية جمع بين NaN وعدد، سيُعاد NaN.",
    //   isTrue: true,
    //   explanation:
    //     "صحيح؛ في JavaScript، أي عملية رياضية تشمل NaN ستُعاد دائماً كقيمة NaN.",
    // },
    // {
    //   id: 15,
    //   question: "في JavaScript، 'true' تُعادل true.",
    //   isTrue: true,
    //   explanation: "صحيح؛ 'true' كنص تُعادل true كقيمة بولية في JavaScript.",
    // },
    // {
    //   id: 16,
    //   question: "في JavaScript، 'true' تُعادل true.",
    //   isTrue: true,
    //   explanation: "صحيح؛ 'true' كنص تُعادل true كقيمة بولية في JavaScript.",
    // },
    // {
    //   id: 17,
    //   question: "في JavaScript، 'true' تُعادل true.",
    //   isTrue: true,
    //   explanation: "صحيح؛ 'true' كنص تُعادل true كقيمة بولية في JavaScript.",
    // },
    // {
    //   id: 18,
    //   question: "في JavaScript، 'true' تُعادل true.",
    //   isTrue: true,
    //   explanation: "صحيح؛ 'true' كنص تُعادل true كقيمة بولية في JavaScript.",
    // },
    // {
    //   id: 19,
    //   question: "في JavaScript، 'true' تُعادل true.",
    //   isTrue: true,
    //   explanation: "صحيح؛ 'true' كنص تُعادل true كقيمة بولية في JavaScript.",
    // },
    // {
    //   id: 20,
    //   question: "في JavaScript، 'true' تُعادل true.",
    //   isTrue: true,
    //   explanation: "صحيح؛ 'true' كنص تُعادل true كقيمة بولية في JavaScript.",
    // },
  ],
  openText: [
    {
      id: 21,
      question: "اشرح بإيجاز الفرق بين var، let، و const في JavaScript.",
    },
    // {
    //   id: 22,
    //   question: "اشرح بإيجاز الفرق بين var، let، و const في JavaScript.",
    // },
    // {
    //   id: 23,
    //   question: "اشرح بإيجاز الفرق بين var، let، و const في JavaScript.",
    // },
    // {
    //   id: 24,
    //   question: "اشرح بإيجاز الفرق بين var، let، و const في JavaScript.",
    // },
    // {
    //   id: 25,
    //   question: "اشرح بإيجاز الفرق بين var، let، و const في JavaScript.",
    // },
  ],
};

async function getExamData(courseTitle, setLoader, setNotificationData) {
  // return mockApiResponse;
  try {
    const response = await getGptResponse(
      generateExamPromptFromLessons(courseTitle),
      setLoader,
      setNotificationData
    );

    const data = JSON.parse(response);
    return data;
  } catch (error) {
    console.error("فشل في تحويل النص إلى JSON:", error);
    setNotificationData({
      message: "حدث خطأ أثناء تحميل بيانات الاختبار.",
      type: "error",
    });
    return null;
  }
}

export { getExamData };

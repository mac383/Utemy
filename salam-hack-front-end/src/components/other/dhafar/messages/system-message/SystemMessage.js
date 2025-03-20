import React, { useState, useContext } from "react";
import "./systemMessage.css";
import { DhaferContext } from "../../../../../pages/dhafer/dhafer-main/dhaferContext";
import systemIcon from "../../../../../images/aiBot.png";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function SystemMessage({ message, isInit = false }) {
  const { state } = useContext(DhaferContext);
  const [copyText, setCopyText] = useState("نسخ");

  const handleCopy = () => {
    // العثور على آخر رسالة أصغر من الرسالة الحالية
    const smallerMessage = state?.messages?.reduce((maxMsg, currentMsg) => 
      currentMsg.messageId < message.messageId && 
      (!maxMsg || currentMsg.messageId > maxMsg.messageId) 
        ? currentMsg 
        : maxMsg, 
      null
    );
  
    // دالة تنظيف النصوص مع الحفاظ على الأسطر الجديدة
    const cleanContent = (text) => 
      text
        .replace(/[\*\_\~\`\^\$\#\%\&\{\}\[\]\(\)\\\<\>\|\=\+]/g, "") // حذف الرموز الخاصة بالتنسيق
        .split("\n") // تقسيم النص إلى أسطر
        .map(line => line.trim()) // إزالة الفراغات من بداية ونهاية كل سطر
        .filter(line => line.length > 0) // إزالة الأسطر الفارغة
        .join("\n"); // إعادة تجميع النص مع الاحتفاظ بالأسطر الجديدة
  
    // تجهيز النص للنسخ
    const contentToCopy = `${state?.user?.fullName}:
  ${cleanContent(smallerMessage?.content || "لم يتم العثور على الرسالة السابقة")}
  
  ظفر:
  ${cleanContent(message.content || "لم يتم العثور على الرسالة")}`;
  
    // نسخ إلى الحافظة
    navigator.clipboard.writeText(contentToCopy);
  
    // تحديث زر النسخ مؤقتًا
    setCopyText("تم النسخ");
    setTimeout(() => setCopyText("نسخ"), 2000);
  };
  
  const renderFormattedText = (text) => {
    // تعابير منتظمة للعناوين، النص الغامق، والمائل
    text = text
      .replace(/^###\s*(.*)$/gm, "<h4 class='formatted-heading'>$1</h4>")
      .replace(/^##\s*(.*)$/gm, "<h3 class='formatted-heading'>$1</h3>")
      .replace(/^#\s*(.*)$/gm, "<h2 class='formatted-heading'>$1</h2>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/```(.*?)```/gs, "<pre class='code-block'>$1</pre>");

    text = text.replace(/"([^"]+)"/g, '<span class="quoted-text">"$1"</span>');

    // تعابير منتظمة للمعادلات الرياضية
    const inlineMathRegex = /\\\((.*?)\\\)/g;
    const blockMathRegex = /\\\[([\s\S]*?)\\\]/g;

    let formattedText = [];
    let lastIndex = 0;

    const inlineMatches = Array.from(text.matchAll(inlineMathRegex));
    const blockMatches = Array.from(text.matchAll(blockMathRegex));
    const allMatches = [...inlineMatches, ...blockMatches].sort(
      (a, b) => a.index - b.index
    );

    allMatches.forEach((match, index) => {
      if (match.index > lastIndex) {
        formattedText.push(
          <span
            key={`text-${index}`}
            dangerouslySetInnerHTML={{
              __html: text.slice(lastIndex, match.index),
            }}
          />
        );
      }

      if (match[0].startsWith("\\[")) {
        formattedText.push(
          <div key={`block-${index}`} className="math-block">
            <BlockMath math={match[1]} />
          </div>
        );
      } else {
        formattedText.push(
          <span key={`inline-${index}`} className="math-inline">
            <InlineMath math={match[1]} />
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    });

    if (lastIndex < text.length) {
      formattedText.push(
        <span
          key={`text-end`}
          dangerouslySetInnerHTML={{ __html: text.slice(lastIndex) }}
        />
      );
    }

    return formattedText;
  };

  return (
    <div
      className={`system-message-component ${isInit ? "init" : ""}`}
      dir="rtl"
    >
      <div className="content">
        <div className="img-container">
          <img src={systemIcon} alt="system-icon" />
          <h3 className="dhafer-name">ظفر</h3>
        </div>
        <div className="response-content">
          {renderFormattedText(message?.content || "")}
        </div>
      </div>
      <div className={`footer ${isInit ? "hide" : ""}`} dir="rtl">
        <p onClick={handleCopy}>{copyText}</p>
      </div>
    </div>
  );
}

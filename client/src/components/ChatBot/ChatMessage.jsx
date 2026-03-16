import { useMemo } from "react";

// Simple markdown-like renderer for bold, bullet points, and line breaks
const renderContent = (text) => {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Render bold text (**text**)
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, partIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Bullet point lines
    if (line.startsWith("• ")) {
      return (
        <div key={lineIdx} className="message-bullet">
          <span className="bullet-dot">•</span>
          <span>{parts.slice(1)}</span>
        </div>
      );
    }

    if (line.trim() === "") {
      return <div key={lineIdx} className="message-spacer" />;
    }

    return (
      <div key={lineIdx} className="message-line">
        {parts}
      </div>
    );
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatMessage({ message }) {
  const isBot = message.role === "assistant";
  const renderedContent = useMemo(
    () => renderContent(message.content),
    [message.content]
  );

  return (
    <div
      className={`chat-message ${isBot ? "chat-message--bot" : "chat-message--user"}`}
    >
      {isBot && (
        <div className="message-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      )}

      <div className="message-content">
        <div
          className={`message-bubble ${
            isBot ? "message-bubble--bot" : "message-bubble--user"
          }`}
        >
          {renderedContent}
        </div>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>

      {!isBot && (
        <div className="message-avatar message-avatar--user" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      )}
    </div>
  );
}
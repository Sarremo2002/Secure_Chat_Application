/* MessageBubble — a single chat message with timestamp */
import React from "react";

export default function MessageBubble({ text, time, variant }) {
  // variant is like "alice-sent", "alice-recv", "bob-sent", "bob-recv"
  const direction = variant.includes("sent") ? "sent" : "received";
  return (
    <div className={`message-bubble message-bubble--${direction} message-bubble--${variant}`}>
      <div>{text}</div>
      <div className="message-bubble__time">{time}</div>
    </div>
  );
}

/* MessageBubble — a single chat message with timestamp and encryption label */
import React from "react";

export default function MessageBubble({ text, time, variant, isDecrypting }) {
  // variant is like "alice-sent", "alice-recv", "bob-sent", "bob-recv"
  const isSent = variant.includes("sent");
  const direction = isSent ? "sent" : "received";

  return (
    <div className={`message-bubble message-bubble--${direction} message-bubble--${variant}`}>
      {/* Show decrypting animation or the actual message */}
      {isDecrypting ? (
        <div className="message-bubble__decrypting">
          <span className="message-bubble__spinner" />
          Decrypting…
        </div>
      ) : (
        <>
          <div>{text}</div>
          <div className="message-bubble__meta">
            {/* Encryption status label */}
            <span className="message-bubble__crypto-label">
              {isSent ? "🔒 encrypted" : "🔓 decrypted"}
            </span>
            <span className="message-bubble__time">{time}</span>
          </div>
        </>
      )}
    </div>
  );
}

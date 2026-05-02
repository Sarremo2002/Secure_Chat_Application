/* ChatPanel — one user's chat view with message list and input bar */
import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatPanel({ user, messages, onSend }) {
  const [text, setText] = useState("");
  const listRef = useRef(null);

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const isAlice = user === "Alice";
  const avatarClass = isAlice ? "chat-panel__avatar--alice" : "chat-panel__avatar--bob";

  return (
    <section className="chat-panel" id={`panel-${user.toLowerCase()}`}>
      {/* Panel header with avatar and online status */}
      <div className="chat-panel__header">
        <div className={`chat-panel__avatar ${avatarClass}`}>
          {user[0]}
        </div>
        <span className="chat-panel__name">{user}</span>
        <span className="chat-panel__status">Online</span>
      </div>

      {/* Messages list */}
      <div className="chat-panel__messages" ref={listRef}>
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id || i}
            text={msg.text}
            time={msg.time}
            variant={msg.variant}
            isDecrypting={msg.isDecrypting}
            isTamperError={msg.isTamperError}
          />
        ))}
      </div>

      {/* Input bar */}
      <div className="chat-panel__input-bar">
        <input
          id={`input-${user.toLowerCase()}`}
          className="chat-panel__input"
          placeholder={`Type as ${user}…`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          id={`send-${user.toLowerCase()}`}
          className="chat-panel__send-btn"
          onClick={handleSend}
          aria-label={`Send message as ${user}`}
        >
          ▶
        </button>
      </div>
    </section>
  );
}

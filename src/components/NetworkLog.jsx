/* NetworkLog — shows intercepted ciphertext in a collapsible bottom panel */
import React, { useState, useRef, useEffect } from "react";

export default function NetworkLog({ entries }) {
  const [open, setOpen] = useState(true);
  const listRef = useRef(null);

  // Auto-scroll to latest entry
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="network-log" id="network-log">
      {/* Clickable header to toggle open/close */}
      <div className="network-log__header" onClick={() => setOpen(o => !o)}>
        <span className="network-log__dot" />
        <span>Network Channel (Intercepted Traffic)</span>
        <span className="network-log__toggle">{open ? "▼ Hide" : "▶ Show"}</span>
      </div>

      {open && (
        <div className="network-log__entries" ref={listRef}>
          {entries.length === 0 ? (
            <div className="network-log__empty">
              No traffic yet — send a message to see encrypted data here.
            </div>
          ) : (
            entries.map((e, i) => (
              <div className="network-log__entry" key={i}>
                <span>[{e.from} → {e.to}]</span>{" "}
                IV: {e.iv} | Ciphertext: {e.ciphertext}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

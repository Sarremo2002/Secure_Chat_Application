/* NetworkLog — shows intercepted ciphertext with tamper attack controls */
import React, { useState, useRef, useEffect } from "react";

function HighlightedString({ str, highlightIndex }) {
  if (highlightIndex === undefined || !str) return <span>{str}</span>;
  const before = str.slice(0, highlightIndex);
  const char = str[highlightIndex];
  const after = str.slice(highlightIndex + 1);
  return (
    <>
      {before}<span className="network-log__highlight-red">{char}</span>{after}
    </>
  );
}

export default function NetworkLog({ entries, tamperedIndex, onTamper, onResetTamper }) {
  const [open, setOpen] = useState(true);
  const listRef = useRef(null);

  // Auto-scroll to latest entry
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [entries]);

  const hasEntries = entries.length > 0;
  const isTampered = tamperedIndex !== null && tamperedIndex !== undefined;

  return (
    <div className="network-log" id="network-log">
      {/* Clickable header to toggle open/close */}
      <div className="network-log__header" onClick={() => setOpen(o => !o)}>
        <span className="network-log__dot" />
        <span>Network Channel (Intercepted Traffic)</span>
        <span className="network-log__toggle">{open ? "▼ Hide" : "▶ Show"}</span>
      </div>

      {open && (
        <>
          <div className="network-log__entries" ref={listRef}>
            {entries.length === 0 ? (
              <div className="network-log__empty">
                No traffic yet — send a message to see encrypted data here.
              </div>
            ) : (
              entries.map((e, i) => {
                const isThis = isTampered && i === tamperedIndex;
                return (
                  <div
                    className={`network-log__entry ${isThis ? "network-log__entry--tampered" : ""}`}
                    key={i}
                  >
                    {isThis && <span className="network-log__tamper-tag">[TAMPERED] </span>}
                    <span>[{e.from} → {e.to}]</span> IV: {e.iv}
                    
                    {!isThis ? (
                      <div>Ciphertext: {e.ciphertext}</div>
                    ) : (
                      <div className="network-log__tamper-compare">
                        <div><strong>Original:</strong> {e.originalCiphertext}</div>
                        <div>
                          <strong>Tampered:</strong> <HighlightedString str={e.ciphertext} highlightIndex={e.tamperPos} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Tamper attack controls */}
          <div className="network-log__actions">
            {!isTampered ? (
              <button
                className="network-log__tamper-btn"
                disabled={!hasEntries}
                onClick={onTamper}
                id="tamper-btn"
              >
                ⚠️ Simulate Tamper Attack
              </button>
            ) : (
              <button
                className="network-log__reset-btn"
                onClick={onResetTamper}
                id="reset-tamper-btn"
              >
                ↩ Reset Attack
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import React from "react";

function HighlightedString({ str, highlightIndex }) {
  if (highlightIndex === undefined || !str) return <span>{str}</span>;
  const before = str.slice(0, highlightIndex);
  const char = str[highlightIndex];
  const after = str.slice(highlightIndex + 1);
  return (
    <>
      {before}<span className="tamper-highlight-red">{char}</span>{after}
    </>
  );
}

export default function TamperModal({ state }) {
  if (!state) return null;
  const { step, originalCiphertext, tamperedCiphertext, pos, originalChar, tamperedChar, receiver } = state;

  return (
    <>
      <div className="tamper-modal-backdrop" />
      {step === 5 && <div className="red-flash-overlay" />}
      <div className="tamper-modal">
        <h2 className="tamper-modal__title">⚠️ Simulating Tamper Attack</h2>
        
        <div className={`tamper-step ${step >= 1 ? "active" : ""}`}>
          <div className="tamper-step__icon">🕵️</div>
          <div className="tamper-step__content">
            <strong>Attacker intercepts message...</strong>
            {step >= 1 && <div className="tamper-code">{originalCiphertext}</div>}
          </div>
        </div>

        <div className={`tamper-step ${step >= 2 ? "active" : ""}`}>
          <div className="tamper-step__icon">🔨</div>
          <div className="tamper-step__content">
            <strong>Attacker modifies a byte...</strong>
            {step >= 2 && (
              <div className="tamper-diff">
                Index {pos}: <span className="tamper-char-orig">{originalChar}</span> → <span className="tamper-char-new">{tamperedChar}</span>
              </div>
            )}
          </div>
        </div>

        <div className={`tamper-step ${step >= 3 ? "active" : ""}`}>
          <div className="tamper-step__icon">📨</div>
          <div className="tamper-step__content">
            <strong>Tampered message delivered to {receiver}...</strong>
            {step >= 3 && (
              <div className="tamper-code tampered">
                <HighlightedString str={tamperedCiphertext} highlightIndex={pos} />
              </div>
            )}
          </div>
        </div>

        <div className={`tamper-step ${step >= 4 ? "active" : ""}`}>
          <div className="tamper-step__icon">🔓</div>
          <div className="tamper-step__content">
            <strong>{receiver} attempts decryption...</strong>
            {step === 4 && (
               <div className="tamper-spinner-container">
                 <span className="message-bubble__spinner" />
               </div>
            )}
          </div>
        </div>

        <div className={`tamper-step ${step >= 5 ? "active" : ""}`}>
          <div className="tamper-step__icon">🚨</div>
          <div className="tamper-step__content">
            <strong className="tamper-failed">AUTHENTICATION FAILED</strong>
          </div>
        </div>
      </div>
    </>
  );
}

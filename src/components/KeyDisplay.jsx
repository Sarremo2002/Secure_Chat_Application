/* KeyDisplay — shows/hides the shared AES key with a toggle button */
import React, { useState } from "react";

export default function KeyDisplay({ hexKey }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="key-display" id="key-display">
      <span className="key-display__label">Shared Key:</span>

      {/* Show masked dots or the real key depending on toggle state */}
      <code className="key-display__value">
        {hexKey
          ? visible
            ? hexKey
            : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"
          : "Generating key…"}
      </code>

      {/* Toggle button with eye icon */}
      <button
        className="key-display__toggle"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? "Hide key" : "Show key"}
        id="key-toggle"
      >
        <span className="key-display__eye">{visible ? "🙈" : "👁️"}</span>
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

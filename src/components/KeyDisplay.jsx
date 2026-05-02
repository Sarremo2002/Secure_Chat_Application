/* KeyDisplay — shows the shared AES key in hex for educational purposes */
import React from "react";

export default function KeyDisplay({ hexKey }) {
  return (
    <div className="key-display" id="key-display">
      <span className="key-display__label">Shared Key:</span>
      <code className="key-display__value">
        {hexKey || "Generating key…"}
      </code>
    </div>
  );
}

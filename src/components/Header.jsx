/* Header component — dark gradient top bar with app title and encryption badge */
import React from "react";

export default function Header() {
  return (
    <header className="header" id="app-header">
      {/* Lock icon */}
      <div className="header__icon" aria-hidden="true">🔒</div>
      <h1 className="header__title">Secure Chat</h1>
      <span className="header__badge">AES-256-GCM</span>
    </header>
  );
}

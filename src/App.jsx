/*
 * App.jsx — Root component that wires everything together.
 *
 * State lives here; child components are purely presentational.
 * Encryption/decryption is delegated entirely to crypto.js.
 */
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import KeyDisplay from "./components/KeyDisplay";
import ChatPanel from "./components/ChatPanel";
import NetworkLog from "./components/NetworkLog";
import { generateKey, exportKeyToHex, encryptMessage, decryptMessage } from "./crypto";

// Helper: current time as HH:MM
function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [cryptoKey, setCryptoKey] = useState(null);   // CryptoKey object
  const [hexKey, setHexKey] = useState("");            // Hex string for display
  const [aliceMsgs, setAliceMsgs] = useState([]);     // Messages shown in Alice's panel
  const [bobMsgs, setBobMsgs] = useState([]);         // Messages shown in Bob's panel
  const [networkLog, setNetworkLog] = useState([]);    // Intercepted ciphertext log

  // Generate the shared AES key once on mount
  useEffect(() => {
    (async () => {
      const key = await generateKey();
      setCryptoKey(key);
      const hex = await exportKeyToHex(key);
      setHexKey(hex);
    })();
  }, []);

  // Alice sends a message → encrypt → show "decrypting..." on Bob → reveal
  const handleAliceSend = async (plaintext) => {
    if (!cryptoKey) return;
    const time = now();

    // Show plaintext in Alice's panel (sent)
    setAliceMsgs(prev => [...prev, { text: plaintext, time, variant: "alice-sent" }]);

    // Encrypt the message
    const { ciphertext, iv } = await encryptMessage(cryptoKey, plaintext);

    // Log the encrypted data in the network panel
    setNetworkLog(prev => [...prev, { from: "Alice", to: "Bob", ciphertext, iv }]);

    // Show "decrypting..." placeholder on Bob's side
    const placeholderId = Date.now();
    setBobMsgs(prev => [...prev, { id: placeholderId, text: "", time, variant: "alice-recv", isDecrypting: true }]);

    // After 600ms delay, decrypt and reveal the real message
    setTimeout(async () => {
      const decrypted = await decryptMessage(cryptoKey, ciphertext, iv);
      setBobMsgs(prev =>
        prev.map(m => m.id === placeholderId ? { ...m, text: decrypted, isDecrypting: false } : m)
      );
    }, 600);
  };

  // Bob sends a message → encrypt → show "decrypting..." on Alice → reveal
  const handleBobSend = async (plaintext) => {
    if (!cryptoKey) return;
    const time = now();

    // Show plaintext in Bob's panel (sent)
    setBobMsgs(prev => [...prev, { text: plaintext, time, variant: "bob-sent" }]);

    // Encrypt the message
    const { ciphertext, iv } = await encryptMessage(cryptoKey, plaintext);

    // Log the encrypted data in the network panel
    setNetworkLog(prev => [...prev, { from: "Bob", to: "Alice", ciphertext, iv }]);

    // Show "decrypting..." placeholder on Alice's side
    const placeholderId = Date.now();
    setAliceMsgs(prev => [...prev, { id: placeholderId, text: "", time, variant: "bob-recv", isDecrypting: true }]);

    // After 600ms delay, decrypt and reveal the real message
    setTimeout(async () => {
      const decrypted = await decryptMessage(cryptoKey, ciphertext, iv);
      setAliceMsgs(prev =>
        prev.map(m => m.id === placeholderId ? { ...m, text: decrypted, isDecrypting: false } : m)
      );
    }, 600);
  };

  return (
    <div className="app">
      <Header />
      <KeyDisplay hexKey={hexKey} />
      <div className="chat-area">
        <ChatPanel user="Alice" messages={aliceMsgs} onSend={handleAliceSend} />
        <ChatPanel user="Bob"   messages={bobMsgs}   onSend={handleBobSend} />
      </div>
      <NetworkLog entries={networkLog} />
    </div>
  );
}

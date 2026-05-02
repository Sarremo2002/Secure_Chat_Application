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
import TamperModal from "./components/TamperModal";
import { generateKey, exportKeyToHex, encryptMessage, decryptMessage } from "./crypto";

// Helper: current time as HH:MM
function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Flip a random byte in the middle of a Base64-encoded ciphertext string.
 * Returns the mutated details needed for the animation.
 */
function tamperCiphertext(base64Str) {
  const chars = base64Str.split("");
  const start = Math.floor(chars.length * 0.2);
  const end = Math.floor(chars.length * 0.8);
  const pos = start + Math.floor(Math.random() * (end - start));
  const originalChar = chars[pos];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let tamperedChar = originalChar;
  while (tamperedChar === originalChar) {
    tamperedChar = alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  chars[pos] = tamperedChar;
  return { tamperedCiphertext: chars.join(""), pos, originalChar, tamperedChar };
}

export default function App() {
  const [cryptoKey, setCryptoKey] = useState(null);
  const [hexKey, setHexKey] = useState("");
  const [aliceMsgs, setAliceMsgs] = useState([]);
  const [bobMsgs, setBobMsgs] = useState([]);
  const [networkLog, setNetworkLog] = useState([]);
  const [tamperedIndex, setTamperedIndex] = useState(null);
  const [tamperModalState, setTamperModalState] = useState(null);

  useEffect(() => {
    (async () => {
      const key = await generateKey();
      setCryptoKey(key);
      const hex = await exportKeyToHex(key);
      setHexKey(hex);
    })();
  }, []);

  const handleAliceSend = async (plaintext) => {
    if (!cryptoKey) return;
    const time = now();
    setAliceMsgs(prev => [...prev, { text: plaintext, time, variant: "alice-sent" }]);
    const { ciphertext, iv } = await encryptMessage(cryptoKey, plaintext);
    setNetworkLog(prev => [...prev, { from: "Alice", to: "Bob", ciphertext, iv }]);
    
    const placeholderId = Date.now();
    setBobMsgs(prev => [...prev, { id: placeholderId, text: "", time, variant: "alice-recv", isDecrypting: true }]);

    setTimeout(async () => {
      const decrypted = await decryptMessage(cryptoKey, ciphertext, iv);
      setBobMsgs(prev =>
        prev.map(m => m.id === placeholderId ? { ...m, text: decrypted, isDecrypting: false } : m)
      );
    }, 600);
  };

  const handleBobSend = async (plaintext) => {
    if (!cryptoKey) return;
    const time = now();
    setBobMsgs(prev => [...prev, { text: plaintext, time, variant: "bob-sent" }]);
    const { ciphertext, iv } = await encryptMessage(cryptoKey, plaintext);
    setNetworkLog(prev => [...prev, { from: "Bob", to: "Alice", ciphertext, iv }]);

    const placeholderId = Date.now();
    setAliceMsgs(prev => [...prev, { id: placeholderId, text: "", time, variant: "bob-recv", isDecrypting: true }]);

    setTimeout(async () => {
      const decrypted = await decryptMessage(cryptoKey, ciphertext, iv);
      setAliceMsgs(prev =>
        prev.map(m => m.id === placeholderId ? { ...m, text: decrypted, isDecrypting: false } : m)
      );
    }, 600);
  };

  const handleTamper = async () => {
    if (!cryptoKey || networkLog.length === 0) return;

    const lastIdx = networkLog.length - 1;
    const entry = networkLog[lastIdx];
    const receiver = entry.to;
    
    const { tamperedCiphertext, pos, originalChar, tamperedChar } = tamperCiphertext(entry.ciphertext);

    const modalState = {
      originalCiphertext: entry.ciphertext,
      tamperedCiphertext,
      pos,
      originalChar,
      tamperedChar,
      receiver
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Sequence
    setTamperModalState({ ...modalState, step: 1 });
    await delay(1000);
    setTamperModalState({ ...modalState, step: 2 });
    await delay(1000);
    setTamperModalState({ ...modalState, step: 3 });
    await delay(1000);
    setTamperModalState({ ...modalState, step: 4 });
    await delay(1000);
    setTamperModalState({ ...modalState, step: 5 });
    await delay(1000);

    setTamperModalState(null);

    setNetworkLog(prev =>
      prev.map((e, i) => i === lastIdx ? { ...e, isTampered: true, originalCiphertext: e.ciphertext, ciphertext: tamperedCiphertext, tamperPos: pos } : e)
    );
    setTamperedIndex(lastIdx);

    const time = now();
    const receiverPanel = receiver === "Bob" ? setBobMsgs : setAliceMsgs;
    const senderPanel = receiver === "Bob" ? setAliceMsgs : setBobMsgs;

    senderPanel(prev => [...prev, {
      id: Date.now() + 1,
      text: "⚠️ Your message may have been intercepted!",
      time,
      variant: "tamper-warning",
      isTamperWarning: true,
    }]);

    try {
      await decryptMessage(cryptoKey, tamperedCiphertext, entry.iv);
    } catch {
      receiverPanel(prev => [...prev, {
        id: Date.now() + 2,
        text: "⚠️ Authentication Failed — Message Tampered!",
        time,
        variant: "tamper-error",
        isTamperError: true,
      }]);
    }
  };

  const handleResetTamper = () => {
    setTamperedIndex(null);
    setNetworkLog(prev => prev.map(e => e.isTampered ? { ...e, isTampered: false, ciphertext: e.originalCiphertext } : e));
    setAliceMsgs(prev => prev.filter(m => !m.isTamperError && !m.isTamperWarning));
    setBobMsgs(prev => prev.filter(m => !m.isTamperError && !m.isTamperWarning));
  };

  return (
    <div className="app">
      <Header />
      <KeyDisplay hexKey={hexKey} />
      <div className="chat-area">
        <ChatPanel user="Alice" messages={aliceMsgs} onSend={handleAliceSend} />
        <ChatPanel user="Bob"   messages={bobMsgs}   onSend={handleBobSend} />
      </div>
      <NetworkLog
        entries={networkLog}
        tamperedIndex={tamperedIndex}
        onTamper={handleTamper}
        onResetTamper={handleResetTamper}
      />
      <TamperModal state={tamperModalState} />
    </div>
  );
}

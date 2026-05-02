/**
 * crypto.js — All encryption/decryption logic using Web Crypto API (AES-256-GCM).
 * No external libraries — only the browser's built-in crypto engine.
 */

// Generate a new AES-256-GCM key
export async function generateKey() {
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 }, // 256-bit AES key
    true,                              // extractable so we can display it
    ["encrypt", "decrypt"]             // allowed operations
  );
  return key;
}

// Export the CryptoKey as a hex string for display
export async function exportKeyToHex(key) {
  const raw = await window.crypto.subtle.exportKey("raw", key);
  const bytes = new Uint8Array(raw);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Encrypt plaintext → { ciphertext, iv } (both Base64)
export async function encryptMessage(key, plaintext) {
  // Fresh random 12-byte IV — never reuse with the same key
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  // Encode the string as UTF-8 bytes
  const data = new TextEncoder().encode(plaintext);
  // AES-GCM encrypt (includes authentication tag automatically)
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return {
    ciphertext: bufToBase64(encrypted),
    iv: bufToBase64(iv.buffer),
  };
}

// Decrypt Base64 ciphertext + iv → plaintext string
export async function decryptMessage(key, ciphertextB64, ivB64) {
  const ciphertext = base64ToBuf(ciphertextB64);
  const iv = new Uint8Array(base64ToBuf(ivB64));
  // AES-GCM decrypt — throws if data was tampered with
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

// ── helpers ──
function bufToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return window.btoa(bin);
}
function base64ToBuf(b64) {
  const bin = window.atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

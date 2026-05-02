# 🔐 Secure Chat — AES-256-GCM Encrypted Messaging

A real-time secure chat application between two users (Alice and Bob) built with **React** and the browser's built-in **Web Crypto API**. Messages are encrypted using AES-256-GCM before being sent and decrypted on receipt — demonstrating how modern applications like WhatsApp and Signal protect messages in transit.

---

## 🚀 Live Demo

[https://secure-chat-app.vercel.app](https://secure-chat-app.vercel.app)

---

## 📸 Preview

> Alice and Bob chat side by side. The Network Channel panel at the bottom shows exactly what an attacker would intercept — pure encrypted ciphertext.

---

## ✨ Features

- **AES-256-GCM Encryption** — every message is encrypted before leaving the sender
- **Fresh IV per message** — same message never produces the same ciphertext twice
- **Tamper Attack Demo** — simulates an attacker flipping a byte and shows AES-GCM catching it instantly
- **Authentication Tag Verification** — GCM mode detects any modification to the ciphertext
- **Hide / Reveal Key** — shared key is hidden by default, reveal it with one click
- **Network Channel Panel** — shows intercepted IV and ciphertext in real time
- **Side by side chat panels** — Alice and Bob each have their own independent chat view

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Web Crypto API | AES-256-GCM encryption (built into the browser) |
| CSS Variables | Easy theme customization |
| Vercel | Deployment |

---

## 📁 Project Structure

```
secure-chat-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top bar with key display and AES badge
│   │   ├── ChatPanel.jsx       # Individual chat panel for Alice or Bob
│   │   ├── MessageBubble.jsx   # Single message bubble with encrypted/decrypted label
│   │   ├── NetworkLog.jsx      # Network channel intercepted traffic panel
│   │   └── KeyDisplay.jsx      # Show/hide shared key toggle
│   ├── crypto.js               # All AES-256-GCM encryption logic with comments
│   ├── App.jsx                 # Main app layout and state
│   └── styles.css              # CSS variables for easy customization
├── public/
├── index.html
├── vite.config.js
└── README.md
```

---

## 🔑 How the Encryption Works

### 1. Key Generation
```js
// Generate a 256-bit AES key once when the app loads
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);
```

### 2. Encrypting a Message
```js
// A fresh random IV is generated for every single message
const iv = crypto.getRandomValues(new Uint8Array(12));

const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode(plaintext)
);
```

### 3. Decrypting a Message
```js
// Decryption fails immediately if the ciphertext was tampered with
const plaintext = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv },
  key,
  ciphertext
);
```

---

## 🕵️ Tamper Attack Demo

1. Send a message from Alice to Bob
2. Click **"⚠️ Simulate Tamper Attack"** in the Network Channel panel
3. Watch the step-by-step attack animation:
   - Attacker intercepts the ciphertext
   - Attacker flips a random byte
   - Bob attempts decryption
   - AES-GCM authentication tag fails
   - Bob receives **"⚠️ Authentication Failed — Message Tampered!"**
4. Click **"Reset Attack"** to return to normal

This demonstrates why **GCM mode is superior to CBC** — it encrypts AND authenticates every message.

---

## 🎨 Customizing the UI

All colors, fonts, and spacing are controlled by CSS variables at the top of `styles.css`:

```css
:root {
  --color-background: #1a1b2e;
  --color-panel: #16213e;
  --color-alice: #7c3aed;
  --color-bob: #0f9e75;
  --color-danger: #dc2626;
  --color-text: #e2e8f0;
  --font-main: 'Inter', sans-serif;
  --border-radius: 12px;
}
```

Change any value to completely restyle the app instantly.

---

## 🏃 Running Locally

```bash
# Clone the repository
git clone https://github.com/YOURUSERNAME/secure-chat-app.git

# Navigate into the project
cd secure-chat-app

# Install dependencies
npm install

# Start the development server
npm run dev

# Open in browser
http://localhost:5173
```

---

## 📦 Deploying to Vercel

```bash
# Push to GitHub
git add .
git commit -m "deploy"
git push

# Then go to vercel.com → Import your repo → Deploy
# Vercel auto-detects Vite and handles everything
```

Every push to `main` triggers an automatic redeployment.

---

## ⚠️ Educational Disclaimer

The shared key is displayed on screen **for educational purposes only**. In a production application:
- The key would never be displayed or stored in plain text
- Key exchange would use **Diffie-Hellman** or **TLS**
- Keys would be stored in secure hardware or a key management service

---

## 📚 Learn More

- [Web Crypto API — MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [AES-GCM Explained](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [How WhatsApp Encryption Works](https://www.whatsapp.com/security)

---

## 👨💻 Built With

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Vercel](https://vercel.com)

---

> "We don't just encrypt — we verify. AES encrypts, GCM authenticates, IV randomizes."

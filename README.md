# Study Buddy Bot 📚

An interactive **Mathematics tutor chatbot** for Gen Z students — accessible via **Web** and **Telegram**, with no LLM API required.

---

## Features

| Feature | Details |
|---|---|
| 📐 Concept Explanation | Clear explanations for 7 maths topics |
| 🔢 Step-by-Step Breakdown | Formula walkthroughs with worked examples |
| 🧮 Practice Questions | 5-question sets per topic |
| 🚫 Anti-Dishonesty Guard | Detects homework/exam completion requests |
| 💙 Non-Academic Escalation | Redirects personal/emotional issues to a human |
| 🔄 Fallback Escalation | After 2 failed attempts → connects to human mentor |
| 🌐 Web Interface | Modern Gen Z dark-mode chat UI |
| 📱 Telegram | Full bot via BotFather polling |

**Topics covered:** Algebra · Fractions · Geometry · Statistics · Probability · Trigonometry · Calculus

---

## Project Structure

```
studybuddy-bot/
├── server.js          # Express server + Telegram bot
├── bot/
│   └── logic.js       # Rule-based bot logic (shared)
├── public/
│   └── index.html     # Web chat UI
├── package.json
├── .env.example       # Environment variable template
└── README.md
```

---

## Quick Start

### 1. Install dependencies

```bash
cd studybuddy-bot
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```
TELEGRAM_BOT_TOKEN=your_token_from_botfather
PORT=3000
```

### 3. Run the bot

```bash
npm start
```

The web interface will be available at **http://localhost:3000**

---

## Telegram Setup (BotFather)

1. Open Telegram → search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts — choose a name (e.g. `Study Buddy Bot`) and username (e.g. `@StudyBuddyMathBot`)
4. BotFather gives you a **token** — copy it into `.env` as `TELEGRAM_BOT_TOKEN`
5. Restart the server — the bot will start polling automatically

**Bot commands to set in BotFather** (`/setcommands`):
```
start - Start a new session
reset - Reset your current session
help - Show help and available topics
```

---

## Bot Behaviour Overview

### Intents handled

| User says | Bot does |
|---|---|
| `explain algebra` | Full concept explanation |
| `practice questions for geometry` | 5-question practice set |
| `I don't understand fractions` | Explanation + offer to practice |
| `explain` (no topic) | Asks: *"What subject or topic?"* |
| `do my homework` | Declines + escalates to human |
| `I feel sad` | Declines + escalates to human |
| 2× unclear input | Auto-escalates to human mentor |

### Escalation
When escalated, the bot sends a handoff message and locks the session. Users can type `/reset` (Telegram) or click **↺ Reset** (web) to start fresh.

---

## Development

```bash
npm run dev   # uses nodemon for auto-reload
```

---

## Requirements

- Node.js ≥ 18
- A Telegram bot token (optional — web works without it)

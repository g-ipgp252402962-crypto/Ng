require("dotenv").config();
const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const { processMessage, getSession, resetSession } = require("./bot/logic");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── Web Chat API ─────────────────────────────────────────────────────────────

app.post("/api/chat", (req, res) => {
  const { message, sessionId } = req.body;
  if (!message || !sessionId) {
    return res.status(400).json({ error: "message and sessionId are required" });
  }

  const session = getSession("web_" + sessionId);
  const reply = processMessage(message, session);
  res.json({ reply });
});

app.post("/api/reset", (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) resetSession("web_" + sessionId);
  res.json({ ok: true });
});

// ── Serve the web UI ─────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Telegram Bot ─────────────────────────────────────────────────────────────

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (TELEGRAM_TOKEN && TELEGRAM_TOKEN !== "YOUR_TELEGRAM_BOT_TOKEN_HERE") {
  const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

  // Helper: send with Markdown and auto-reply fallback
  function sendMarkdown(chatId, text) {
    bot
      .sendMessage(chatId, text, { parse_mode: "Markdown" })
      .catch(() => bot.sendMessage(chatId, text)); // fallback plain text
  }

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const userId = "tg_" + chatId;
    const text = msg.text || "";

    // Handle /start command
    if (text === "/start") {
      resetSession(userId);
      sendMarkdown(
        chatId,
        "👋 Hey there! I'm *Study Buddy Bot* — your academic tutor for Mathematics!\n\n" +
          "I can help you with:\n" +
          "• 📐 *Explaining* concepts in a simple way\n" +
          "• 🔢 *Breaking down* formulas step by step\n" +
          "• 🧮 *Giving you practice questions*\n\n" +
          "Topics I cover: Algebra, Fractions, Geometry, Statistics, Probability, Trigonometry, Calculus\n\n" +
          "What would you like help with today? 😊\n\n" +
          "_Type /reset anytime to start a fresh session._"
      );
      return;
    }

    // Handle /reset command
    if (text === "/reset") {
      resetSession(userId);
      sendMarkdown(chatId, "🔄 Session reset! Let's start fresh. What topic do you need help with?");
      return;
    }

    // Handle /help command
    if (text === "/help") {
      sendMarkdown(
        chatId,
        "📚 *Study Buddy Bot — Help*\n\n" +
          "*What I can do:*\n" +
          "• Explain any maths topic clearly\n" +
          "• Break down formulas step by step\n" +
          "• Give you practice questions\n\n" +
          "*Topics available:*\n" +
          "Algebra, Fractions, Geometry, Statistics, Probability, Trigonometry, Calculus\n\n" +
          "*Example commands:*\n" +
          "• \"Explain algebra\"\n" +
          "• \"Practice questions for geometry\"\n" +
          "• \"I don't understand fractions\"\n\n" +
          "*/reset* — Start a new session"
      );
      return;
    }

    const session = getSession(userId);
    const reply = processMessage(text, session);
    sendMarkdown(chatId, reply);
  });

  bot.on("polling_error", (err) => {
    console.error("[Telegram polling error]", err.message);
  });

  console.log("✅ Telegram bot is running (polling)");
} else {
  console.log(
    "ℹ️  Telegram bot not started. Set TELEGRAM_BOT_TOKEN in .env to enable it."
  );
}

// ── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Study Buddy Bot web server running at http://localhost:${PORT}`);
});

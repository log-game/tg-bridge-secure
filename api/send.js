import jwt from "jsonwebtoken";

const JWT_SECRET = "a9s8d7f6a5s4d3f2g1h0j9k8l7z6x5c4v3b2n1m";

let messages = global.messages || [];
global.messages = messages;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const cookie = req.headers.cookie;
  if (!cookie) return res.status(401).end();

  const token = cookie
    .split(";")
    .find(c => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return res.status(401).end();

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).end();
  }

  const { text } = req.body;

  const formatted = `От: @${user.username}\n${text}`;

  await fetch(`https://api.telegram.org/bot8550352315:AAGSuiM_dm9ycPD2RmrxZjYxqhXL8U8B2A8/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: "-1002168026878",
      text: formatted
    })
  });

  messages.push({
    id: Date.now(),
    text,
    telegram_id: user.telegram_id,
    username: user.username,
    source: "web"
  });

  res.status(200).json({ ok: true });
}

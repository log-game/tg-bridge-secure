import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = process.env.GROUP_ID;
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://concepts-oe.tilda.ws");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const cookie = req.headers.cookie;
  if (!cookie) return res.status(401).end();

  const token = cookie.split(";")
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
  if (!text) return res.status(400).end();

  // 1️⃣ отправка в Telegram
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: GROUP_ID,
      text: `@${user.username}: ${text}`
    })
  });

  // 2️⃣ сохранение в Supabase
  await supabase.from("messages").insert({
    telegram_id: user.telegram_id,
    username: user.username,
    text,
    source: "web"
  });

  res.status(200).json({ ok: true });
}

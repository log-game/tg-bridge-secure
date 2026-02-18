import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = req.headers.cookie?.split("token=")[1];
  if (!token) return res.status(401).end();

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).end();
  }

  const { text } = req.body;
  const formatted = `От: @${user.username}\n${text}`;

  // Отправляем в Telegram
  await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.GROUP_ID,
      text: formatted
    })
  });

  // Сохраняем в Supabase
  await supabase.from("messages").insert({
    id: Date.now(),
    text,
    telegram_id: user.telegram_id,
    username: user.username,
    source: "web"
  });

  res.status(200).json({ ok: true });
}

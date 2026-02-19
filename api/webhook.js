import { createClient } from "@supabase/supabase-js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function sendMessage(chat_id, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id,
      text
    })
  });
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  const update = req.body;

  if (!update.message) {
    return res.status(200).end();
  }

  const message = update.message;
  const text = message.text;
  const telegram_id = message.from.id;
  const username = message.from.username;

  // ===== /login =====
  if (text === "/login") {
    const code = generateCode();

    await supabase.from("login_codes").insert({
      telegram_id,
      code
    });

    await sendMessage(
      message.chat.id,
      `Ваш код входа: ${code}\nВведите его на сайте.`
    );

    return res.status(200).end();
  }

  // ===== обычные сообщения =====
  if (text) {
    await supabase.from("messages").insert({
      telegram_id,
      username,
      text,
      source: "telegram"
    });
  }

  res.status(200).end();
}

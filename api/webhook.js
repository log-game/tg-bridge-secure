import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

let codes = global.codes || {};
global.codes = codes;

export default async function handler(req, res) {
  const body = req.body;

  // Команда /login от бота — выдаём код
  if (body.message?.text === "/login") {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    codes[code] = {
      telegram_id: body.message.from.id,
      username: body.message.from.username,
      photo_url: null
    };

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: body.message.chat.id,
        text: `Ваш код для входа: ${code}`
      })
    });
  }

  // Сохраняем все текстовые сообщения из Telegram
  if (body.message?.text) {
    await supabase.from("messages").insert({
      id: Date.now(),
      text: body.message.text,
      telegram_id: body.message.from.id,
      username: body.message.from.username,
      source: "telegram"
    });
  }

  res.status(200).end();
}

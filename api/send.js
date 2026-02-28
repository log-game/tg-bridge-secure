import { supabase } from "./_supabase.js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = "-1002168026878";

export default async function handler(req, res) {
  if (!req.cookies.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const user = JSON.parse(req.cookies.user);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Empty message" });
  }

  // Проверка мута перед отправкой
  const tgRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHAT_ID}&user_id=${user.telegram_id}`
  );

  const tgData = await tgRes.json();

  if (
    tgData.result.status === "kicked" ||
    (tgData.result.status === "restricted" &&
      tgData.result.can_send_messages === false)
  ) {
    return res.status(403).json({ error: "Muted or banned" });
  }

  // Отправка в Telegram
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: `${user.username}: ${text}`
    })
  });

  // Сохранение в Supabase
  await supabase.from("messages").insert([
    {
      telegram_id: user.telegram_id,
      username: user.username,
      text: text,
      source: "web"
    }
  ]);

  res.status(200).json({ ok: true });
}

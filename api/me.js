const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = "-1002168026878"; // ID группы

export default async function handler(req, res) {
  if (!req.cookies.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const user = JSON.parse(req.cookies.user);

  const tgRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHAT_ID}&user_id=${user.telegram_id}`
  );

  const tgData = await tgRes.json();

  if (!tgData.ok) {
    return res.status(500).json({ error: "Telegram error" });
  }

  const status = tgData.result.status;

  if (status === "kicked") {
    return res.status(403).json({ error: "Banned in group" });
  }

  if (status === "restricted" && tgData.result.can_send_messages === false) {
    return res.status(200).json({
      ...user,
      muted: true
    });
  }

  return res.status(200).json({
    ...user,
    muted: false
  });
      }

let messages = global.messages || [];
global.messages = messages;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).end();

  const body = req.body;

  if (body.message && body.message.text) {
    messages.push({
      id: Date.now(),
      text: body.message.text,
      telegram_id: body.message.from.id,
      username: body.message.from.username,
      source: "telegram"
    });
  }

  res.status(200).end();
}

let messages = global.messages || [];
global.messages = messages;

export default async function handler(req, res) {
  try {
    const body = req.body;
    if (body.message && body.message.text) {
      const msg = body.message;
      messages.push({ id: Date.now(), text: msg.text, telegram_id: msg.from.id, username: msg.from.username, source: "telegram" });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

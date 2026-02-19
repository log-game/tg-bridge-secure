import { createClient } from "@supabase/supabase-js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export default async function handler(req, res) {
  // Telegram Webhook не требует CORS
  try {
    const body = req.body;
    if (body.message && body.message.text) {
      const msg = body.message;
      await supabase.from("messages").insert({
        telegram_id: msg.from.id,
        username: msg.from.username,
        text: msg.text,
        source: "telegram"
      });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("webhook error:", err);
    res.status(500).json({ error: err.message });
  }
}

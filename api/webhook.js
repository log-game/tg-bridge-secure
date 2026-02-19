import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  try {
    const body = req.body;

    if (body.message && body.message.text) {
      const msg = body.message;

      await supabase.from("messages").insert({
        telegram_id: msg.from.id,
        username: msg.from.username || "",
        text: msg.text,
        source: "telegram"
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

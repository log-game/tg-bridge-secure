import { supabase } from "./_supabase.js";

export default async function handler(req, res) {
  if (!req.cookies.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  // авто очистка (оставляем 500)
  await supabase.rpc("clean_old_messages");

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json(data);
}

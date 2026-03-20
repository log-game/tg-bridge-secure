import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://concepts-oe.tilda.ws");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return res.status(500).json({ error });

  res.status(200).json(data);
}

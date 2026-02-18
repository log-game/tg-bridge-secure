import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("id", { ascending: true })
    .limit(100);

  res.status(200).json(data);
}

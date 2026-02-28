export default async function handler(req, res) {
  const user = req.body;

  if (!user || !user.id) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const userData = {
    telegram_id: user.id,
    username: user.username || user.first_name,
    first_name: user.first_name
  };

  res.setHeader(
    "Set-Cookie",
    `user=${encodeURIComponent(JSON.stringify(userData))}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  res.status(200).json({ ok: true });
}

export default async function handler(req, res) {
  const data = req.query; // ⚠️ берём из query, а не body

  if (!data || !data.id) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const userData = {
    telegram_id: data.id,
    username: data.username || data.first_name,
    first_name: data.first_name
  };

  res.setHeader(
    "Set-Cookie",
    `user=${encodeURIComponent(JSON.stringify(userData))}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  // редирект обратно на сайт
  res.writeHead(302, {
    Location: "https://твоя-tilda-страница.ru"
  });

  res.end();
}

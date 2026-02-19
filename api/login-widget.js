import crypto from "crypto";
import jwt from "jsonwebtoken";

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  try {
    // --- CORS ---
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://concepts-oe.tilda.ws"
    );

    // --- Проверка данных Telegram ---
    const data = { ...req.query };
    const checkHash = data.hash;
    delete data.hash;

    const secret = crypto
      .createHash("sha256")
      .update(BOT_TOKEN)
      .digest();

    const sorted = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join("\n");

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(sorted)
      .digest("hex");

    if (hmac !== checkHash) {
      return res.status(403).send("Unauthorized");
    }

    // --- Создание JWT ---
    const token = jwt.sign(
      {
        telegram_id: data.id,
        username: data.username,
        photo_url: data.photo_url
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // --- Установка cookie ---
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=None; Secure`
    );

    // --- Редирект на страницу чата ---
    res.redirect("http://concepts-oe.tilda.ws/koechat");

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
}

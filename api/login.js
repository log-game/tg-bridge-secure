import crypto from "crypto";
import jwt from "jsonwebtoken";

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://concepts-oe.tilda.ws");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const data = { ...req.query };
  const checkHash = data.hash;
  delete data.hash;

  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const sorted = Object.keys(data)
    .sort()
    .map(k => `${k}=${data[k]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(sorted)
    .digest("hex");

  if (hmac !== checkHash) return res.status(403).send("Unauthorized");

  const token = jwt.sign(
    { telegram_id: data.id, username: data.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.setHeader(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; SameSite=None; Secure`
  );

  res.redirect("https://concepts-oe.tilda.ws/koechat");
}

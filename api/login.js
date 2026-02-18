import crypto from "crypto";
import jwt from "jsonwebtoken";

const BOT_TOKEN = "8550352315:AAGSuiM_dm9ycPD2RmrxZjYxqhXL8U8B2A8";
const JWT_SECRET = "a9s8d7f6a5s4d3f2g1h0j9k8l7z6x5c4v3b2n1m";

export default function handler(req, res) {
  const data = { ...req.query };
  const checkHash = data.hash;
  delete data.hash;

  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();

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

  const token = jwt.sign(
    {
      telegram_id: data.id,
      username: data.username
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.setHeader(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; SameSite=Lax`
  );

  res.redirect("/");
}

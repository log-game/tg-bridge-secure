import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://concepts-oe.tilda.ws");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const cookie = req.headers.cookie;
  if (!cookie) return res.status(401).end();

  const token = cookie.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return res.status(401).end();

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.status(200).json(user);
  } catch {
    res.status(401).end();
  }
}

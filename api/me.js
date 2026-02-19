import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "http://concepts-oe.tilda.ws");

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

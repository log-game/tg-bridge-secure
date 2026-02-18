import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  const cookie = req.headers.cookie;
  if (!cookie) return res.status(401).end();

  const token = cookie.split("token=")[1];
  if (!token) return res.status(401).end();

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.status(200).json(user);
  } catch {
    res.status(401).end();
  }
}

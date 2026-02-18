import jwt from "jsonwebtoken";

const JWT_SECRET = "a9s8d7f6a5s4d3f2g1h0j9k8l7z6x5c4v3b2n1m";

export default function handler(req, res) {
  const cookie = req.headers.cookie;

  if (!cookie) return res.status(401).end();

  const token = cookie
    .split(";")
    .find(c => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return res.status(401).end();

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.status(200).json(user);
  } catch {
    res.status(401).end();
  }
}

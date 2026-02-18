import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

let codes = global.codes || {};
global.codes = codes;

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { code } = req.body;
  const user = codes[code];

  if (!user) return res.status(401).end();

  delete codes[code];

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

  res.setHeader(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; SameSite=Lax`
  );

  res.status(200).json({ ok: true });
}

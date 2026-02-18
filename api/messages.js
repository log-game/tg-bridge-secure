let messages = global.messages || [];
global.messages = messages;

export default function handler(req, res) {
  res.status(200).json(messages.slice(-100));
}

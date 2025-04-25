const apiKeyCheck = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.FRONTEND_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(403).json({ error: 'Forbidden: Invalid API key' });
  }

  next();
};

export default apiKeyCheck;
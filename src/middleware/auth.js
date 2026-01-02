function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token || token !== process.env.API_TOKEN) {
    return res.status(403).json({
      code: 10306,
      message: "There is no authorization",
      detail: "Missing or invalid Bearer token"
    });
  }

  next();
}

module.exports = auth;
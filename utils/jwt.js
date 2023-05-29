const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(user, process.env.SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: "7d",
  });
}

function verifyToken(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = { generateToken, verifyToken };

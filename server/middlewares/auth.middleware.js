const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Authorization header missing" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ msg: "Invalid Authorization format" });
  }

  const token = parts[1];

  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};

module.exports = auth;

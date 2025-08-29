const jwt = require("jsonwebtoken");

const authGuard = (roles = []) => {
  // roles can be ["admin"], ["user"], etc.
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ msg: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token missing" });

    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ msg: "Invalid or expired token" });

      // attach user payload to request
      req.user = decoded;

      // role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Forbidden" });
      }

      next();
    });
  };
};

module.exports = authGuard;

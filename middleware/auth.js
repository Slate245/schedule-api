const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).send("Access denied. No token provided.");
  const token = header.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

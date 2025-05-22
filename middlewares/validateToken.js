const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["autorization"];

  if (!token) {
    res.status(401).send({ error: "Necesitas un token de autorizacion" });
    return;
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, `${process.env.JWT_SECRET}`, (error, decoded) => {
      if (error) {
        return res.json({ error: "Token invalido" });
      } else {
        res.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = validateToken;

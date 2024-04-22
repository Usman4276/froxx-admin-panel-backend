const User = require("../models/user");
const jwt = require("jsonwebtoken");

//Verify JWT
async function verifyToken(req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return res.status(404).send("Bearer JWT not found in authorization header");
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECERET);
    req.body.email = decoded.email;

    next();
  } catch (error) {
    res.status(404).send(error.message);
  }
}
module.exports = verifyToken;

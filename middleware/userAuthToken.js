
require('dotenv').config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const key = process.env.SECRECT_KEY;

const generateToken = (data) => {
  const token = jwt.sign({ data }, key, { expiresIn: "1h" });
  return token;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ Message: "user must be signIn.." });
    }
    const withoutBearer = token.split(" ")[1];
    const payload = jwt.verify(withoutBearer, key);

    const checkUser = await User.findById(payload.data._id);

    if (!checkUser) {
      return res
        .status(404)
        .json({ Message: "user not found for this token..." });
    }
    req.userData = checkUser.userId;
    req.userData2 = checkUser;
    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      Error: error.message,
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

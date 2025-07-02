
require("dotenv").config();
const jwt = require("jsonwebtoken")
const {User} =require("../models/User")

const key = process.env.SECRECT_KEY;

const generateToken = (user) => {
  // Include _id and role directly in token payload
  const token = jwt.sign({ _id: user._id, role: user.role }, key);
  return token;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ Message: "User must be signed in." });
    }

    const withoutBearer = token.split(" ")[1];
    const payload = jwt.verify(withoutBearer, key); // payload = { _id, role }

    const user = await User.findById(payload._id);

    if (!user) {
      return res
        .status(404)
        .json({ Message: "User not found for this token." });
    }

    req.user = {
      _id: user._id,
      role: user.role,
      email: user.email, // optional
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

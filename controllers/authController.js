// controllers/authController.js
const bcrypt = require("bcrypt");
const jwtSvc = require("../middleware/userAuthToken");
const { User } = require("../models/User");
const fs = require("fs");
const { sendMailToUser } = require("../utils/mailsend");

async function userRegister(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      class: studentClass,
      grade,
      graduateAt,
      joinDate,
    } = req.body;

    // 1) check email
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // 2) optional: send welcome email
    await sendMailToUser(email, `${firstName} ${lastName}`, password);

    // 3) hash pw
    const hashed = await bcrypt.hash(password, 10);

    // 4) build doc
    const data = { firstName, lastName, email, password: hashed, role };
    if (role === "student") {
      data.class = studentClass;
      data.grade = grade;
    } else {
      data.graduateAt = new Date(graduateAt);
      data.joinDate = new Date(joinDate);
    }

    // 5) save
    const user = await User.create(data);

    // 6) jwt
    const token = jwtSvc.generateToken(user);

    res
      .status(201)
      .json({ message: "User created successfully.", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function userLogin(req, res) {
  // console.log("object");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not registered." });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwtSvc.generateToken(user);
    // console.log("token", token);
    res.status(200).json({ message: "Logged in.", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const file = req.file;
    let data = { ...req.body };

    if (file) {
      const old = await User.findById(userId);
      if (old?.profileFileName) {
        fs.unlinkSync(old.filePath);
      }
      data.profileFileName = file.filename;
      data.filePath = file.path;
      data.fileType = file.mimetype;
    }

    const updated = await User.findByIdAndUpdate(userId, data, { new: true });
    res.status(200).json({ message: "Profile updated.", Data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function getSingleUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ Data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function getAllUser(req, res) {
  try {
    const users = await User.find({ isDeleted: false });
    res.status(200).json({ Data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function DeleteUser(req, res) {
  try {
    const { userId } = req.params;
    const upd = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    if (!upd) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  userRegister,
  userLogin,
  updateUserProfile,
  getSingleUser,
  getAllUser,
  DeleteUser,
};

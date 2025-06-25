const jwt = require("../middleware/userAuthToken");
const { User, Contact, Review } = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { sendMailToUser } = require("../utils/mailsend");

const userRegister = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const findEmail = await User.findOne({ email });
    if (findEmail) {
      return res.status(500).json({
        message: "Email already exists.",
      });
    }
    await sendMailToUser(email, userName, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      ...req.body,
      password: hashedPassword,
    };

    await User.create(data);

    res.status(200).json({
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findEmail = await User.findOne({ email });
    if (!findEmail) {
      return res.status(500).json({
        message: "Email not registered.",
      });
    }
    const validPassword = await bcrypt.compare(password, findEmail.password);
    if (!validPassword) {
      return res.status(500).json({
        message: "Invalid password.",
      });
    }
    const token = await jwt.generateToken(findEmail);

    res.status(200).json({
      message: "User logged in successfully.",
      token,
      findEmail,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    let { userId } = req.params;

    let file = req.file;
    let newFile = req.file;

    let data = {
      ...req.body,
    };

    if (newFile) {
      const oldFile = await User.findById({ _id: userId });
      if (!oldFile) {
        return res.status(404).json({ Message: "Data Not Found.." });
      }
      if (oldFile.profileFileName) {
        fs.unlinkSync(`${oldFile.filePath}`);

        data.profileFileName = newFile.filename;
        data.filePath = newFile.path;
        data.fileType = newFile.mimetype;
      } else {
        data = {
          ...data,
          profileFileName: file.filename,
          filePath: file.path,
          fileType: file.mimetype,
        };
      }
    }
    const Data = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });

    res.status(200).json({
      status: "200",
      Data,
      message: "profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    let { userId } = req.params;
    const Data = await User.findOne({ _id: userId, isDeleted: false });
    if (!Data) {
      return res.status(404).json({
        status: "404",
        message: " User Not Found",
      });
    }
    res.status(200).json({
      status: "200",
      Data,
      message: " Fetch User successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAllUser = async (req, res) => {
  try {
    const Data = await User.find({ isDeleted: false });
    res.status(200).json({
      status: "200",
      Data,
      message: " Fetch All User successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const DeleteUser = async (req, res) => {
  try {
    let { userId } = req.params;
    const Data = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!Data) {
      return res.status(404).json({
        status: "404",
        message: " User Not Found",
      });
    }
    res.status(200).json({
      status: "200",
      message: " User Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  userRegister,
  userLogin,
  updateUserProfile,
  getSingleUser,
  getAllUser,
  DeleteUser,
};

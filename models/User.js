const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
    },

    // Student-specific fields
    class: {
      type: String,
      enum:["10th Grade","12th Grade"],
      required: true,
    },
    section: {
      type: String,
      enum:["A","B","c"],
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

module.exports = { User };

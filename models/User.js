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
      enum:["1","2","3","4","5","6","7","8","9","10"
      ],
      required: true,
    },
    section: {
      type: String,
    },
    exams: [
      {
        title: String,
        examDate: Date,
        score: Number,
        totalQues: Number,
        subject:String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

module.exports = { User };
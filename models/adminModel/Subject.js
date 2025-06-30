const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["English", "Tamil", "Mathematics", "Science", "Social"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);

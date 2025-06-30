const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
     createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["English", "Tamil", "Maths", "Science", "Social"],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);

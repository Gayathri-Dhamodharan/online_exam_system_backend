const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    class: {
      type: String,
      enum: [
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
      ],
      required: true,
    },

    type: {
      type: String,
      enum: ["mcq", "true_false"],
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [{ type: String, required: true }],
    answer: {
      type: String,
      required: true,
    },
    mark: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);

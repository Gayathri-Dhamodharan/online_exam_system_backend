const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },
  type: {
    type: String,
    enum: ["mcq", "true_false"],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [
    { type: String, required: true }
  ],
  answer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);

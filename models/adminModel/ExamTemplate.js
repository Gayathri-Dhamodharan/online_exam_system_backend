const mongoose = require("mongoose");

const examTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
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
  examDate: {
    type: Date,
    required: true
  },
  duration: {
    // in minutes
    type: Number,
    required: true
  },
  questions: [
    {
      originalQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      },
      questionText: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ["mcq", "true_false"],
        required: true
      },
      options: [
        { type: String, required: true }
      ],
      answer: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("ExamTemplate", examTemplateSchema);

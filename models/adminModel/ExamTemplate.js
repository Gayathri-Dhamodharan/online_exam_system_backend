const mongoose = require("mongoose");

const examTemplateSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
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
        "11th Grade",
        "12th Grade",
      ],
      required: true,
    },
    duration: {
      // in minutes
      type: Number,
      required: true,
    },
    questions: [
      {
        originalQuestion: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        questionText: {
          type: String,
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
    ],

    totalMark: Number,
  },

  { timestamps: true }
);

module.exports = mongoose.model("ExamTemplate", examTemplateSchema);

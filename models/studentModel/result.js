// models/Result.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const ResultSchema = new Schema({
  // Link back to the exam
  examId: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true
  },

  // Link to the student (you can populate for name, role, etc.)
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    index: true
  },

  // Have we run the validation logic yet?
  isValidated: {
    type: Boolean,
    required: true,
    default: false
  },

  // Scores
  markScored: {
    type: Number,
    required: true
  },
  totalMark: {
    type: Number,
    required: true
  },

  // Pass/fail
  isPass: {
    type: Boolean,
    required: true
  },

  // The submitted answers
  answers: {
    type: [AnswerSchema],
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Result', ResultSchema);

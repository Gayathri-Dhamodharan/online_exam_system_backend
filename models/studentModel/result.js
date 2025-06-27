// models/Result.js
const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  studentExam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentExam',
    required: true,
    unique: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  examTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamTemplate',
    required: true
  },
  attended:    { type: Number, required: true },
  notAttended: { type: Number, required: true },
  correct:     { type: Number, required: true },
  wrong:       { type: Number, required: true },
  details: [
    {
      questionId:    { type: mongoose.Schema.Types.ObjectId, required: true },
      questionText:  { type: String, required: true },
      selected:      { type: String, default: null },
      correctAnswer: { type: String, required: true },
      isCorrect:     { type: Boolean, required: true }
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('Result', resultSchema)

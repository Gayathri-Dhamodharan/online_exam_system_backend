// models/StudentExam.js
const mongoose = require("mongoose")

const studentExamSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['in_progress','completed'],
    default: 'in_progress'
  },
  startTime: { type: Date, default: Date.now },
  endTime:   { type: Date },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      selected: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('StudentExam', studentExamSchema)

// models/AssignedExam.js
const mongoose = require('mongoose');
const AssignedExamSchema = new mongoose.Schema({
  examTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamTemplate', required: true },
  student:      { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  assignedAt:   { type: Date, default: Date.now },
  startedAt:    { type: Date },
  completedAt:  { type: Date },
  status:       { type: String, enum: ['assigned','started','completed'], default: 'assigned' },
}, { timestamps: true });
module.exports = mongoose.model('AssignedExam', AssignedExamSchema);

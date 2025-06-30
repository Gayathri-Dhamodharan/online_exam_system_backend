// routes/postValidateExam.js
const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const Exam    = require('../../models/Exam');

router.post('/postValidateExam', async (req, res) => {
  try {
    const { examId, answers } = req.body;
    if (!mongoose.isValidObjectId(examId)) {
      return res.status(400).json({ error: 'Invalid examId' });
    }

    // 1. Fetch the exam document
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // 2. Build a map of questionId → question data
    const questionMap = new Map(
      exam.questions.map(q => [ String(q.questionId), q ])
    );

    // 3. Score each submitted answer
    let totalScore = 0;
    for (const sub of answers) {
      const key = String(sub.questionId);
      const q   = questionMap.get(key);
      if (!q) continue;                  // question not in this exam
      if (typeof sub.answer !== 'string') continue;

      // normalize whitespace/case if you like:
      if (sub.answer.trim() === q.answer) {
        totalScore += q.marks;
      }
    }

    // 4. Compare to exam.passMark (computed on save)
    const isPass = totalScore >= exam.passMark;

    // 5. Return the result
    return res.json({
      MarkScored: totalScore,
      isPass
    });

  } catch (err) {
    console.error('Validation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

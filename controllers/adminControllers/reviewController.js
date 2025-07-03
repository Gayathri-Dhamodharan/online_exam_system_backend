// controllers/reviewController.js

const { User } = require("../../models/User");

exports.getReviewData = async (req, res) => {
  try {
    // 1) read filters
    const classFilter = req.query.class?.trim();
    const examFilter  = req.query.exam?.trim();

    // 2) build an aggregation to unwind all student-exam entries
    const pipeline = [
      { $unwind: "$exams" },
      // optional class filter on the user's class
      ...(classFilter
        ? [{ $match: { class: classFilter } }]
        : []),
      // optional exam title filter
      ...(examFilter
        ? [{ $match: { "exams.title": examFilter } }]
        : []),
      // for the table_data rows:
      {
        $project: {
          _id: 0,
          student: { $concat: ["$firstName", " ", "$lastName"] },
          class: "$class",
          subject: "$exams.subject",
          exam: "$exams.title",
          score: "$exams.score",
          percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$exams.score", "$exams.totalQues"] },
                  100
                ]
              },
              1
            ]
          }
        }
      }
    ];

    const rows = await User.aggregate(pipeline);

    // 3) compute card_data
    const totalExamCount   = rows.length;
    const studentSet       = new Set(rows.map(r => r.student));
    const totalStudentCount= studentSet.size;
    const avgScore =
      totalExamCount > 0
        ? Math.round(
            rows.reduce((sum, r) => sum + r.percentage, 0) /
            totalExamCount
          )
        : 0;

    // 4) send response
    res.json({
      card_data: {
        total_student: totalStudentCount,
        avg_score: avgScore,
        total_exam: totalExamCount
      },
      table_data: rows
    });
  } catch (err) {
    console.error("Review dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

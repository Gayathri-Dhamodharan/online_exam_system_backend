const { User } = require("../../models/User");
const Exam = require("../../models/Exam");

// Helper to format Date to DD/MM/YYYY
function formatDateDDMMYYYY(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

exports.getDashboardStats = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select("exams class");
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const totalExamsAttended = (user.exams || []).length;

    // Fetch only the needed fields; use .lean() to prevent virtuals
    const upcomingExamsDocs = await Exam.find(
      {
        "class.name": user.class,
        startDate: { $gte: now }
      }
    )
      .lean()
      .select({
        "subject.name": 1,
        title: 1,
        startDate: 1,
        _id: 1 
      });

    const upcomingExamsCount = upcomingExamsDocs.length;

    // Compute subject aggregates
    const statsBySubject = {};
    (user.exams || []).forEach(e => {
      const subj = e.subject;
      statsBySubject[subj] = statsBySubject[subj] || { totalScore: 0, totalQues: 0 };
      statsBySubject[subj].totalScore += e.score;
      statsBySubject[subj].totalQues += e.totalQues;
    });

    const perfArray = Object.entries(statsBySubject).map(([subject, vals]) => ({
      subject,
      percentage: vals.totalQues > 0
        ? Math.round((vals.totalScore / vals.totalQues) * 100)
        : 0
    }));

    const sorted = [...perfArray].sort((a, b) => b.percentage - a.percentage);
    const highestScoreSubject = sorted[0]?.subject || null;
    const subjectToFocus = sorted[sorted.length - 1]?.subject || null;
    const graphData = perfArray.slice(0, 5);

 // Build table entries from both attended and upcoming exams
    const tableValue = [];

    // Upcoming exams
    upcomingExamsDocs.forEach(ex => {
      tableValue.push({
        Subject: ex.subject.name,
        Title:   ex.title,
        Date:    formatDateDDMMYYYY(ex.startDate)
      });
    });

    return res.json({
      card_data: {
        ExamsAttended:     totalExamsAttended,
        upcomingExams:     upcomingExamsCount,
        highestScoreSubject,
        subjectToFocus
      },
      graph_data: graphData,
      table_value: tableValue
    });

    // return res.json({upcomingExamsDocs:user.exams});

  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// controllers/dashboardController.js

// const Result = require("../../");

// const AssignedExam = require("../../");

// const Exam = require("../../models/Exam");

// const Question = require("../../models/adminModel/Question");

// const Subject = require("../../models/adminModel/Subject");

const studentDashboardController = {
  // Get student dashboard data

  getStudentDashboard: async (req, res) => {
    try {
      const studentId = req.user.id; // Assuming user ID comes from auth middleware

      // Get stats data

      const statsData = await getDashboardStats(studentId);

      // Get recent exam performance

      const examPerformance = await getRecentExamPerformance(studentId);

      // Get upcoming exams

      const upcomingExams = await getUpcomingExams(studentId);

      res.status(200).json({
        success: true,

        data: {
          stats: statsData,

          examPerformance: examPerformance,

          upcomingExams: upcomingExams,
        },
      });
    } catch (error) {
      console.error("Dashboard error:", error);

      res.status(500).json({
        success: false,

        message: "Failed to fetch dashboard data",

        error: error.message,
      });
    }
  },

  // Get detailed subject performance

  getSubjectPerformance: async (req, res) => {
    try {
      const studentId = req.user.id;

      const { limit = 10 } = req.query;

      const subjectPerformance = await Result.aggregate([
        { $match: { studentId: mongoose.Types.ObjectId(studentId) } },

        {
          $lookup: {
            from: "exams",

            localField: "examId",

            foreignField: "_id",

            as: "exam",
          },
        },

        { $unwind: "$exam" },

        {
          $group: {
            _id: "$exam.subject.name",

            totalExams: { $sum: 1 },

            totalMarks: { $sum: "$markScored" },

            totalPossible: { $sum: "$totalMark" },

            averagePercentage: {
              $avg: {
                $multiply: [{ $divide: ["$markScored", "$totalMark"] }, 100],
              },
            },

            passCount: {
              $sum: { $cond: ["$isPass", 1, 0] },
            },
          },
        },

        {
          $project: {
            subject: "$_id",

            totalExams: 1,

            averagePercentage: { $round: ["$averagePercentage", 2] },

            passRate: {
              $round: [
                {
                  $multiply: [{ $divide: ["$passCount", "$totalExams"] }, 100],
                },

                2,
              ],
            },
          },
        },

        { $sort: { averagePercentage: -1 } },

        { $limit: parseInt(limit) },
      ]);

      res.status(200).json({
        success: true,

        data: subjectPerformance,
      });
    } catch (error) {
      console.error("Subject performance error:", error);

      res.status(500).json({
        success: false,

        message: "Failed to fetch subject performance",

        error: error.message,
      });
    }
  },
};

// Helper function to get dashboard statistics

async function getDashboardStats(studentId) {
  const mongoose = require("mongoose");

  // Total questions attended

  const questionsAttended = await Result.aggregate([
    { $match: { studentId: mongoose.Types.ObjectId(studentId) } },

    { $unwind: "$answers" },

    { $count: "total" },
  ]);

  // Upcoming exams count

  const upcomingExamsCount = await AssignedExam.countDocuments({
    student: studentId,

    status: { $in: ["assigned", "started"] },
  });

  // Highest scored subject

  const highestScoreSubject = await Result.aggregate([
    { $match: { studentId: mongoose.Types.ObjectId(studentId) } },

    {
      $lookup: {
        from: "exams",

        localField: "examId",

        foreignField: "_id",

        as: "exam",
      },
    },

    { $unwind: "$exam" },

    {
      $group: {
        _id: "$exam.subject.name",

        averagePercentage: {
          $avg: {
            $multiply: [{ $divide: ["$markScored", "$totalMark"] }, 100],
          },
        },
      },
    },

    { $sort: { averagePercentage: -1 } },

    { $limit: 1 },
  ]);

  // Subject to focus (lowest scoring)

  const subjectToFocus = await Result.aggregate([
    { $match: { studentId: mongoose.Types.ObjectId(studentId) } },

    {
      $lookup: {
        from: "exams",

        localField: "examId",

        foreignField: "_id",

        as: "exam",
      },
    },

    { $unwind: "$exam" },

    {
      $group: {
        _id: "$exam.subject.name",

        averagePercentage: {
          $avg: {
            $multiply: [{ $divide: ["$markScored", "$totalMark"] }, 100],
          },
        },
      },
    },

    { $sort: { averagePercentage: 1 } },

    { $limit: 1 },
  ]);

  return {
    questionsAttended: questionsAttended[0]?.total || 0,

    upcomingExams: upcomingExamsCount,

    highestScoreSubject: highestScoreSubject[0]?._id || "N/A",

    subjectToFocus: subjectToFocus[0]?._id || "N/A",
  };
}

// Helper function to get recent exam performance

async function getRecentExamPerformance(studentId) {
  const mongoose = require("mongoose");

  const performance = await Result.aggregate([
    { $match: { studentId: mongoose.Types.ObjectId(studentId) } },

    {
      $lookup: {
        from: "exams",

        localField: "examId",

        foreignField: "_id",

        as: "exam",
      },
    },

    { $unwind: "$exam" },

    {
      $group: {
        _id: "$exam.subject.name",

        latestPercentage: {
          $last: {
            $multiply: [{ $divide: ["$markScored", "$totalMark"] }, 100],
          },
        },

        examDate: { $last: "$createdAt" },
      },
    },

    {
      $project: {
        subject: "$_id",

        percentage: { $round: ["$latestPercentage", 0] },
      },
    },

    { $sort: { examDate: -1 } },

    { $limit: 5 },
  ]);

  return performance.map((p) => ({
    subject: p.subject,

    percentage: p.percentage,
  }));
}

// Helper function to get upcoming exams

async function getUpcomingExams(studentId) {
  const mongoose = require("mongoose");

  const upcomingExams = await AssignedExam.aggregate([
    {
      $match: {
        student: mongoose.Types.ObjectId(studentId),

        status: { $in: ["assigned", "started"] },
      },
    },

    {
      $lookup: {
        from: "exams",

        localField: "examTemplate",

        foreignField: "_id",

        as: "exam",
      },
    },

    { $unwind: "$exam" },

    {
      $project: {
        subject: "$exam.subject.name",

        title: "$exam.title",

        date: "$exam.startDate",

        status: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "assigned"] }, then: "Not Attempted" },

              { case: { $eq: ["$status", "started"] }, then: "In Progress" },

              { case: { $eq: ["$status", "completed"] }, then: "Completed" },
            ],

            default: "Not Attempted",
          },
        },
      },
    },

    { $sort: { date: 1 } },

    { $limit: 10 },
  ]);

  return upcomingExams.map((exam) => ({
    id: exam._id,

    subject: exam.subject,

    title: exam.title,

    date: exam.date.toISOString().split("T")[0], // Format as YYYY-MM-DD

    score: exam.status,
  }));
}

module.exports = studentDashboardController;

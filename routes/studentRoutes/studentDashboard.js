// // routes/dashboard.js
// const express = require("express");
// const router = express.Router();
// const dashboardController = require("../../controllers/studentController/studentDashboardController");
// const verifyToken = require("../../middleware/userAuthToken"); // Assuming you have auth middleware

// // Middleware to ensure user is authenticated
// router.use(verifyToken);

// // @route   GET /api/dashboard
// // @desc    Get student dashboard data (stats, performance, upcoming exams)
// // @access  Private (Student)
// router.get("/", dashboardController.getStudentDashboard);

// router.get("/performance", dashboardController.getSubjectPerformance);

// router.get("/stats", async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const mongoose = require("mongoose");
//     const Result = require("../models/Result");
//     const AssignedExam = require("../models/AssignedExam");
//     // Total questions attended
//     const questionsAttended = await Result.aggregate([
//       { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
//       { $unwind: "$answers" },
//       { $count: "total" },
//     ]);
//     // Upcoming exams count
//     const upcomingExamsCount = await AssignedExam.countDocuments({
//       student: studentId,
//       status: { $in: ["assigned", "started"] },
//     });
//     // Highest scored subject
//     const highestScoreSubject = await Result.aggregate([
//       { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
//       {
//         $lookup: {
//           from: "exams",
//           localField: "examId",
//           foreignField: "_id",
//           as: "exam",
//         },
//       },
//       { $unwind: "$exam" },
//       {
//         $group: {
//           _id: "$exam.subject.name",
//           averagePercentage: {
//             $avg: {
//               $multiply: [{ $divide: ["$markScored", "$totalMark"] }, 100],
//             },
//           },
//         },
//       },
//       { $sort: { averagePercentage: -1 } },
//       { $limit: 1 },
//     ]);
//     // Subject to focus (lowest scoring)
//     const subjectToFocus = await Result.aggregate([
//       { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
//       {
//         $lookup: {
//           from: "exams",
//           localField: "examId",
//           foreignField: "_id",
//           as: "exam",
//         },
//       },
//       { $unwind: "$exam" },
//       {
//         $group: {
//           _id: "$exam.subject.name",
//           averagePercentage: {
//             $avg: {
//               $multiply: [{ $divide: ["$markScored", "$totalMark"] }, 100],
//             },
//           },
//         },
//       },
//       { $sort: { averagePercentage: 1 } },
//       { $limit: 1 },
//     ]);
//     const stats = {
//       questionsAttended: questionsAttended[0]?.total || 0,
//       upcomingExams: upcomingExamsCount,
//       highestScoreSubject: highestScoreSubject[0]?._id || "N/A",
//       subjectToFocus: subjectToFocus[0]?._id || "N/A",
//     };
//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error("Stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch dashboard stats",
//       error: error.message,
//     });
//   }
// });

// router.get("/recent-performance", async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const { limit = 5 } = req.query;
//     const mongoose = require("mongoose");
//     const Result = require("../models/Result");
//     const performance = await Result.aggregate([
//       { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
//       {
//         $lookup: {
//           from: "exams",
//           localField: "examId",
//           foreignField: "_id",
//           as: "exam",
//         },
//       },
//       { $unwind: "$exam" },
//       {
//         $group: {
//           _id: "$exam.subject.name",
//           latestPercentage: {
//             $last: {
//               $multiply: [{ $divide: ["$markScored", "$totalMark"] }, 100],
//             },
//           },
//           examDate: { $last: "$createdAt" },
//         },
//       },
//       {
//         $project: {
//           subject: "$_id",
//           percentage: { $round: ["$latestPercentage", 0] },
//         },
//       },
//       { $sort: { examDate: -1 } },
//       { $limit: parseInt(limit) },
//     ]);
//     const chartData = performance.map((p) => ({
//       subject: p.subject,
//       percentage: p.percentage,
//     }));
//     res.status(200).json({
//       success: true,
//       data: chartData,
//     });
//   } catch (error) {
//     console.error("Recent performance error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch recent performance",
//       error: error.message,
//     });
//   }
// });

// router.get("/upcoming-exams", async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const { limit = 10 } = req.query;
//     const mongoose = require("mongoose");
//     const AssignedExam = require("../models/AssignedExam");
//     const upcomingExams = await AssignedExam.aggregate([
//       {
//         $match: {
//           student: mongoose.Types.ObjectId(studentId),
//           status: { $in: ["assigned", "started"] },
//         },
//       },
//       {
//         $lookup: {
//           from: "exams",
//           localField: "examTemplate",
//           foreignField: "_id",
//           as: "exam",
//         },
//       },
//       { $unwind: "$exam" },
//       {
//         $project: {
//           subject: "$exam.subject.name",
//           title: "$exam.title",
//           date: "$exam.startDate",
//           status: {
//             $switch: {
//               branches: [
//                 {
//                   case: { $eq: ["$status", "assigned"] },
//                   then: "Not Attempted",
//                 },
//                 { case: { $eq: ["$status", "started"] }, then: "In Progress" },
//                 { case: { $eq: ["$status", "completed"] }, then: "Completed" },
//               ],
//               default: "Not Attempted",
//             },
//           },
//         },
//       },
//       { $sort: { date: 1 } },
//       { $limit: parseInt(limit) },
//     ]);
//     const tableData = upcomingExams.map((exam) => ({
//       id: exam._id,
//       subject: exam.subject,
//       title: exam.title,
//       date: exam.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
//       score: exam.status,
//     }));
//     res.status(200).json({
//       success: true,
//       data: tableData,
//     });
//   } catch (error) {
//     console.error("Upcoming exams error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch upcoming exams",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

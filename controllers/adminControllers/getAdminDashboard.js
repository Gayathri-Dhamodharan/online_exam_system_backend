// // controllers/adminDashboardController.js

// const Exam = require("../../models/Exam");
// const { User } = require("../../models/User");

// exports.getAdminDashboard = async (req, res) => {
//   try {
//     const userData = req.user;
//     if (userData.role !== "admin")
//       return res.status(403).json({ error: "Admins only" });

//     // read optional ?class=… (e.g. "4" or "10A")
//     const classFilter = req.query.class;
//     const hasClass =
//       typeof classFilter === "string" && classFilter.trim() !== "";

//     // --- 1) CARD DATA ---------------------------------------------------

//     // total_exams: count all Exam documents, filtered by class.name if requested
//     const examQuery = hasClass ? { "class.name": classFilter } : {};
//     const totalExams = await Exam.countDocuments(examQuery);

//     console.log(totalExams, "totalExams");
    

//     // total_students: count all student‐role Users in that class if requested
//     const userQuery = { role: "student" };
//     if (hasClass) userQuery.class = classFilter;
//     const totalStudents = await User.countDocuments(userQuery);

//     console.log(totalStudents, "totalStudents");

//     // avg_score & pass_rate: unwind only the matching exams
//     const unwindMatch = { $unwind: "$exams" };
//     const examMatch = { $match: {} };
//     if (hasClass) {
//       // only include exams whose original exam.class.name matches
//       examMatch.$match["exams.class"] = classFilter;
//     }
//     // project percent + keep totalQues/score
//     const projectPct = {
//       $project: {
//         pct: {
//           $multiply: [{ $divide: ["$exams.score", "$exams.totalQues"] }, 100],
//         },
//         totalQues: "$exams.totalQues",
//         score: "$exams.score",
//       },
//     };

//     const examEntries = await User.aggregate([
//       unwindMatch,
//       examMatch,
//       projectPct,
//     ]);

//     const sumPct = examEntries.reduce((sum, e) => sum + e.pct, 0);
//     const avgScore = examEntries.length
//       ? Math.round(sumPct / examEntries.length)
//       : 0;
//       console.log(avgScore, "avgScore");
      

//     const passedCount = examEntries.filter(
//       (e) => e.score >= Math.ceil(e.totalQues * 0.25)
//     ).length;
//     const passRate = examEntries.length
//       ? Math.round((passedCount / examEntries.length) * 100)
//       : 0;

//             console.log(avgScore, "avgScore");
//     // --- 2) GRAPH DATA: average % by subject in 5 most recent exams -------

//     // find the 5 most recent exams (optionally filtered by class)
//     const recentFive = await Exam.find(examQuery)
//       .sort({ startDate: -1 })
//       .limit(5)
//       .select("title");

//     const recentTitles = recentFive.map((e) => e.title);

//     // aggregate only those exams in users’ history
//     const graphAgg = await User.aggregate([
//       { $unwind: "$exams" },
//       { $match: { "exams.title": { $in: recentTitles } } },
//       {
//         $group: {
//           _id: "$exams.subject",
//           avgPct: {
//             $avg: {
//               $multiply: [
//                 { $divide: ["$exams.score", "$exams.totalQues"] },
//                 100,
//               ],
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           subject: "$_id",
//           percentage: { $round: ["$avgPct", 0] },
//           _id: 0,
//         },
//       },
//     ]);

//     // --- 3) TABLE VALUE: all upcoming exams ------------------------------

//     const now = new Date();
//     const upcomingQuery = {
//       startDate: { $gt: now },
//       ...(hasClass && { "class.name": classFilter }),
//     };
//     const upcoming = await Exam.find(upcomingQuery)
//       .sort({ startDate: 1 })
//       .select("title class.name subject.name startDate");

//     const tableValue = upcoming.map((e) => ({
//       title: e.title,
//       class: e.class.name,
//       subject: e.subject.name,
//       date: e.startDate
//         .toISOString()
//         .slice(0, 10)
//         .split("-")
//         .reverse()
//         .join("/"), // dd/MM/YYYY
//     }));

//     // --- RESPONSE --------------------------------------------------------

//     res.json({
//       card_data: [
//         { item: "Total Exams", value: totalExams, icon: "FileText" },
//         { item: "Total Students", value: totalStudents, icon: "Users" },
//         { item: "Avg Score", value: avgScore, icon: "Award"},
//         { item: "Pass Rate", value: `${passRate}%`, icon: "Target" },
//       ],
//       graph_data: graphAgg,
//       table_data: tableValue,
//     });
//   } catch (err) {
//     console.error("Admin dashboard error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// controllers/adminDashboardController.js

const Exam = require("../../models/Exam");
const { User } = require("../../models/User");

exports.getAdminDashboard = async (req, res) => {
  try {
    const userData = req.user;
    if (userData.role !== "admin")
      return res.status(403).json({ error: "Admins only" });

    const classFilter = req.query.class;
    const hasClass = typeof classFilter === "string" && classFilter.trim() !== "";

    // --- 1) CARD DATA ---------------------------------------------------

    const examQuery = hasClass ? { "class.name": classFilter } : {};
    const totalExams = await Exam.countDocuments(examQuery);

    const userQuery = { role: "student" };
    if (hasClass) userQuery.class = classFilter;
    const totalStudents = await User.countDocuments(userQuery);

    const unwindMatch = { $unwind: "$exams" };
    const examMatch = { $match: {} };
    if (hasClass) {
      examMatch.$match["exams.class"] = classFilter;
    }

    const projectPct = {
      $project: {
        pct: {
          $cond: {
            if: { $eq: ["$exams.totalQues", 0] },
            then: 0,
            else: {
              $multiply: [
                { $divide: ["$exams.score", "$exams.totalQues"] },
                100,
              ],
            },
          },
        },
        totalQues: "$exams.totalQues",
        score: "$exams.score",
      },
    };

    const examEntries = await User.aggregate([
      unwindMatch,
      examMatch,
      projectPct,
    ]);

    const sumPct = examEntries.reduce((sum, e) => sum + e.pct, 0);
    const avgScore = examEntries.length
      ? Math.round(sumPct / examEntries.length)
      : 0;

    const passedCount = examEntries.filter(
      (e) => e.score >= Math.ceil(e.totalQues * 0.25)
    ).length;
    const passRate = examEntries.length
      ? Math.round((passedCount / examEntries.length) * 100)
      : 0;

    // --- 2) GRAPH DATA --------------------------------------------------

    const recentFive = await Exam.find(examQuery)
      .sort({ startDate: -1 })
      .limit(5)
      .select("title");

    const recentTitles = recentFive.map((e) => e.title);

    const graphAgg = await User.aggregate([
      { $unwind: "$exams" },
      { $match: { "exams.title": { $in: recentTitles } } },
      {
        $group: {
          _id: "$exams.subject",
          avgPct: {
            $avg: {
              $cond: {
                if: { $eq: ["$exams.totalQues", 0] },
                then: 0,
                else: {
                  $multiply: [
                    { $divide: ["$exams.score", "$exams.totalQues"] },
                    100,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          subject: "$_id",
          percentage: { $round: ["$avgPct", 0] },
          _id: 0,
        },
      },
    ]);

    // --- 3) TABLE VALUE: upcoming exams ---------------------------------

    const now = new Date();
    const upcomingQuery = {
      startDate: { $gt: now },
      ...(hasClass && { "class.name": classFilter }),
    };
    const upcoming = await Exam.find(upcomingQuery)
      .sort({ startDate: 1 })
      .select("title class.name subject.name startDate");

    const tableValue = upcoming.map((e) => ({
      title: e.title,
      class: e.class.name,
      subject: e.subject.name,
      date: e.startDate
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/"), // dd/MM/YYYY
    }));

    // --- RESPONSE -------------------------------------------------------

    res.json({
      card_data: [
        { item: "Total Exams", value: totalExams, icon: "FileText" },
        { item: "Total Students", value: totalStudents, icon: "Users" },
        { item: "Avg Score", value: avgScore, icon: "Award" },
        { item: "Pass Rate", value: `${passRate}%`, icon: "Target" },
      ],
      graph_data: graphAgg,
      table_data: tableValue,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

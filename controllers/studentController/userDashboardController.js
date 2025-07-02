const User = require ("../../models/User")

exports.getDashboardStats = async (req, res) => {
  try {
    const { _id } = req.user; // Get user ID from authenticated user

    // Get user with attended exams
    const user = await User.findById(_id).select("exams class");
    if (!user) return res.status(404).json({ error: "User not found" });

    const attendedExams = user.exams || [];

    // Calculate total questions attended
    const totalQuestionsAttended = attendedExams.reduce((total, exam) => {
      return total + (exam.totalQues || 0);
    }, 0);

    // Get upcoming exams count for user's class
    const currentDate = new Date();
    const upcomingExamsCount = await Exam.countDocuments({
      "class.name": user.class, // assuming user has class field
      startDate: { $gte: currentDate },
    });

    // Calculate subject-wise performance
    const subjectStats = {};
    attendedExams.forEach((exam) => {
      const subject = exam.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = {
          totalScore: 0,
          totalQuestions: 0,
          examCount: 0,
        };
      }
      subjectStats[subject].totalScore += exam.score;
      subjectStats[subject].totalQuestions += exam.totalQues;
      subjectStats[subject].examCount += 1;
    });

    // Calculate percentages and find highest/lowest performing subjects
    const subjectPerformance = Object.keys(subjectStats).map((subject) => {
      const stats = subjectStats[subject];
      const percentage =
        stats.totalQuestions > 0
          ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
          : 0;

      return {
        subject,
        percentage,
        totalExams: stats.examCount,
        totalScore: stats.totalScore,
        totalQuestions: stats.totalQuestions,
      };
    });

    // Sort by percentage to find highest and lowest
    const sortedByPerformance = [...subjectPerformance].sort(
      (a, b) => b.percentage - a.percentage
    );

    const highestScoreSubject =
      sortedByPerformance.length > 0 ? sortedByPerformance[0].subject : "N/A";

    const subjectToFocus =
      sortedByPerformance.length > 0
        ? sortedByPerformance[sortedByPerformance.length - 1].subject
        : "N/A";

    // Get recent exam performance for chart (last 5 exams or all subjects)
    const chartData = subjectPerformance.slice(0, 5).map((item) => ({
      subject: item.subject,
      percentage: item.percentage,
    }));

    // Get recent attended exams (last 5)
    const recentExams = attendedExams
      .sort((a, b) => new Date(b.examDate) - new Date(a.examDate))
      .slice(0, 5)
      .map((exam) => ({
        id: exam._id,
        title: exam.title,
        subject: exam.subject,
        date: exam.examDate,
        score: exam.score,
        totalQuestions: exam.totalQues,
        percentage:
          exam.totalQues > 0
            ? Math.round((exam.score / exam.totalQues) * 100)
            : 0,
      }));

    // Calculate overall statistics
    const totalExamsAttended = attendedExams.length;
    const totalScore = attendedExams.reduce((sum, exam) => sum + exam.score, 0);
    const overallPercentage =
      totalQuestionsAttended > 0
        ? Math.round((totalScore / totalQuestionsAttended) * 100)
        : 0;

    const dashboardData = {
      stats: {
        questionsAttended: totalQuestionsAttended,
        upcomingExams: upcomingExamsCount,
        highestScoreSubject,
        subjectToFocus,
        totalExamsAttended,
        overallPercentage,
      },
      chartData: chartData,
      recentExams: recentExams,
      subjectPerformance: subjectPerformance,
      attendedExams: attendedExams,
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

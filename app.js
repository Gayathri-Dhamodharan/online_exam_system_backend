const express = require("express");
const connection = require("./config/db");
const userRouter = require("./routes/auth");

// adminroutes
const subjectRoutes      = require("./routes/subjectRoutes");
const classRoutes =require("./routes/classRoutes")
const questionRoutes     = require("./routes/adminRoutes/questionRoutes");
const examRoutes = require("./routes/examRoutes");
// const postValidateExamRoutes = require("./routes/studentRoutes/postValidateExam");
const userDashboardRoutes = require("./routes/studentRoutes/userDashboardRoutes");
const adminDashboardRoutes = require("./routes/adminRoutes/adminDashboardRoutes");
const reviewRoutes = require("./routes/adminRoutes/reviewRoutes");

// student routes
// const examination = require("./routes/studentRoutes/examRoutes");
 const resultRoutes = require("./routes/studentRoutes/resultRoutes")

require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors(' '));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("src/fileStorage"));
connection();

app.use("/api/user", userRouter);
app.use("/api/exam",examRoutes);

// admin
app.use("/api/subjects",      subjectRoutes);
app.use("/api/class", classRoutes)  
app.use("/api/questions",     questionRoutes);

// student
// app.use("/api/examination", examination);
app.use("/api/exam_result", resultRoutes);

// userDashboard
app.use("/api/user",userDashboardRoutes)

//admin dashboard
app.use('/api/admin', adminDashboardRoutes);

// review exam
app.use("/api/admin", reviewRoutes);


app.use("/", (req, res) => {
  res.send("Port is running in 5000 and db connected successfully");
});
// console.log("Mongo URI:", process.env.MONGO_URI);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

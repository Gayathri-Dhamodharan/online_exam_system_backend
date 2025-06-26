const express = require("express");
const connection = require("./config/db");
const userRouter = require("./routes/auth");

// adminroutes
const subjectRoutes      = require("./routes/subjectRoutes");
const classRoutes        = require("./routes/classRoutes");
const questionRoutes     = require("./routes/questionRoutes");
const examTemplateRoutes = require("./routes/examTemplateRoutes");

require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors(' '));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("src/fileStorage"));
connection();

app.use("api/user", userRouter);

// admin
app.use("/api/subjects",      subjectRoutes);
app.use("/api/classes",       classRoutes);
app.use("/api/questions",     questionRoutes);
app.use("/api/exam-templates",examTemplateRoutes);

app.use("/", (req, res) => {
  res.send("I'm alive");
});
// console.log("Mongo URI:", process.env.MONGO_URI);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

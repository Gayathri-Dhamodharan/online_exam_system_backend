const express = require("express");
const connection = require("./config/db");
const userRouter = require("./routes/auth");

require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("src/fileStorage"));
connection();

app.use("/user", userRouter);

app.use("/", (req, res) => {
  res.send("I'm alive");
});
// console.log("Mongo URI:", process.env.MONGO_URI);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { log } = require("console");

dotenv.config();

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send({ message: `server is running ${process.env.PORT}` });
});

console.log(process.env.MONGO_URI,"ferdfg");

mongoose
  .connect(process.env.MONGO_URI) //, {useNewUrlParser: true,useUnifiedTopology: true}
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 5000, async () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
     
    });
  })
  .catch((err) => console.log(err));
 
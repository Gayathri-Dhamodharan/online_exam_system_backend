const mongoose = require("mongoose");

const dbconnection = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);

    console.log("db connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbconnection;

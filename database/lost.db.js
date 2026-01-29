const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoDBUrl = process.env.MONGOURL;
const connectDB = async () => {
  try {
    await mongoose.connect(`${mongoDBUrl}/lost-and-found`);
  } catch (error) {
    console.log(
      `error while connecting to database error status ${error.code} \n error message: ${error.message}`,
    );
  }
};

module.exports = connectDB;

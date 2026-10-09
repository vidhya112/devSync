const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://vidyacharpe5_db_user:5xB97Zyf3WFpKaY@cluster0.57tcvts.mongodb.net/"
  ) 
}

module.exports = connectDB

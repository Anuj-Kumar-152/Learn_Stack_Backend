const mongoose = require("mongoose");


const connectDB = async () => {

   const MongoDbString = process.env.MONGODB_CONNECTION_STRING;

   if (!MongoDbString) {
      throw new Error("MongoDbString missing in .env");
   }

   await mongoose.connect(MongoDbString);
}

module.exports = connectDB;
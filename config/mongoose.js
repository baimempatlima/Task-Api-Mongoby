const mongoose = require("mongoose");
// require("dotenv");
// dotenv.config();

const database = process.env.MONGODB_ADDON_URI || "mongodb://baim:baim45@localhost:27017/bayu-native?authSource=admin";

mongoose.connect(database, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
  console.log(`${database}`, "Server Mongoose Database terhubung");
});

// const db = mongoose.connection;
// db.on("error", console.log.bind(`${database}`, "connection error"));
// db.once("open", console.log.bind(`${database}`, "Server mongooseDatabase terhubung"));

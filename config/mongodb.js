const { MongoClient } = require("mongodb");
require("dotenv");
// dotenv.config();
const url = process.env.MONGO_URI || "mongodb://baim:baim45@localhost:27017?bayu-native?authSource=admin";
const client = new MongoClient(url);

(async () => {
  try {
    await client.connect();
    console.log(`${url}`, "koneksi ke mongodb berhasil");
  } catch (e) {
    console.log(e);
  }
})();

const db = client.db("bayu-native");
module.exports = db;

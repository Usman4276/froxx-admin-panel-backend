const mongoose = require("mongoose");
const keys = require("./keys");

function connectionToMongoDB() {
  mongoose
    .connect(keys.MONGODB_URL)
    .then(() => console.log("Connection established successfully"))
    .catch(() => console.log("Connection failed"));
}

module.exports = connectionToMongoDB;

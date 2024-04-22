var mongoose = require("mongoose");

// Service schema
const serviceSchema = new mongoose.Schema({
  info: { type: String, required: true },
});

//Service model
const Serviceinfo = mongoose.model("serviceinfo", serviceSchema);

module.exports = Serviceinfo;

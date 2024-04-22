const mongoose = require("mongoose");

//Support Schema
const supportSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    dop: { type: String, required: true },
    filePath: { type: [], required: true, default: null },
    location: { type: String, required: true },
    // ext: { type: String },
    // filename: { type: String },
  },
  { timestamps: true }
);

//Support model
const Support = mongoose.model("support", supportSchema);

module.exports = Support;

const mongoose = require("mongoose");

//Support Schema
const documentSchema = new mongoose.Schema(
  {
    filePath: { type: String },
    ext: { type: String },
    filename: { type: String },
  },
  { timestamps: true }
);

//Support model
const Document = mongoose.model("document", documentSchema);

module.exports = Document;

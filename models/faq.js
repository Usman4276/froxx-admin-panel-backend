var mongoose = require("mongoose");

// Faq schema
const faqSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

//Faq model
const Faq = mongoose.model("faq", faqSchema);

module.exports = Faq;

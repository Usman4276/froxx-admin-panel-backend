var mongoose = require("mongoose");

// Feedback schema
const feedbackSchema = new mongoose.Schema({
  message: { type: String, required: true },
});

//Feedback model
const Feedback = mongoose.model("feedback", feedbackSchema);

module.exports = Feedback;

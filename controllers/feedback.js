const Feedback = require("../models/feedback");
const { DefaultQuestion } = require("../models/chatbot");

// @desc Submit a new Feedback
// @route POST /feedback
// @access Public
async function submitFeedback(req, res) {
  const { heading, message } = req.body;
  try {
    //Validating inputs
    if (!heading || !message) throw new Error("Empty field");
    if (typeof message !== "string" || typeof heading !== "string")
      throw new Error("Data must be a string");

    //Checking for length of data
    const defaultQuantity = await DefaultQuestion.find();

    if (defaultQuantity.length < 3) {
      await DefaultQuestion.create({
        question: heading,
        answer: null,
        lastNode: null,
        default: true,
        firstNode: true,
      });
    }

    //Submiting the feedback
    const result = await Feedback.create({ message });
    if (!result) throw new Error("Feedback not saved successfully");

    res.status(201).send({
      statusCode: 201,
      data: "Feedback saved successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc Get all Feedback
// @route GET /feedback
// @access Public
async function getFeedback(req, res) {
  try {
    //Getting the service information
    const result = await Feedback.find();
    if (!result) throw new Error("No feedback found");

    res.status(200).send({
      statusCode: 200,
      data: result,
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}
module.exports = { submitFeedback, getFeedback };

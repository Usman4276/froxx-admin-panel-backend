const mongoose = require("mongoose");

//Chatbot schema
const chatbotFirstSchema = new mongoose.Schema({
  question: String,
  answer: [String],
  lastNode: { type: Boolean, default: undefined },
  default: { type: Boolean, default: undefined },
  firstNode: { type: Boolean, default: undefined },
});

const chatbotSecondSchema = new mongoose.Schema({
  question: String,
  answer: [String],
  lastNode: { type: Boolean, default: undefined },
  default: { type: Boolean, default: undefined },
  firstNode: { type: Boolean, default: undefined },
});

// const defaultQuestionSchema = new mongoose.Schema({
//   question: String,
//   answer: [String],
//   lastNode: { type: Boolean, default: undefined },
//   default: { type: Boolean, default: undefined },
//   firstNode: { type: Boolean, default: undefined },
// });
const defaultQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
});

const childsNodes = new mongoose.Schema(
  {
    name: { type: String, default: undefined },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: undefined },
    isDefault: { type: Boolean, default: false },
    resolved: { type: Boolean, default: undefined },
    description: { type: String, default: undefined },
  },
  { timestamps: true }
);
// const childsNodes = new mongoose.Schema({
//   question: { type: String, required: true },
//   answers: [String],
//   lastNode: { type: Boolean, default: undefined },
//   description: { type: String, default: undefined },
// });

//Chatbot model
const DefaultQuestion = mongoose.model(
  "defaultQuestion",
  defaultQuestionSchema
);
const ChildNode = mongoose.model("childNode", childsNodes);
const Chatfirst = mongoose.model("chatfirst", chatbotFirstSchema);
const Chatsecond = mongoose.model("chatsecond", chatbotSecondSchema);

module.exports = { Chatfirst, Chatsecond, DefaultQuestion, ChildNode };

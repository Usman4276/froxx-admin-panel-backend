const mongoose = require("mongoose");
const {
  Chatfirst,
  Chatsecond,
  DefaultQuestion,
  ChildNode,
} = require("../models/chatbot");
var moment = require("moment");

// @desc Add questions to the chatbot
// @route POST /chatbot/add-first-query
// @access Public
// async function addFirstChat(req, res) {
//   const { question, answer, lastNode } = req.body;

//   try {
//     //Input validation
//     if (!question || !answer) throw new Error("Empty fields");

//     if (typeof question !== "string" || !Array.isArray(answer))
//       throw new Error(
//         "Invalid datatypes { question: String, answer: [String], lastNode: boolean (optional) }"
//       );

//     //Checking for already existing question
//     const regExpression = new RegExp("^" + question, "i");
//     const isAlreadyExist = await Chatfirst.findOne({ question: regExpression });
//     if (isAlreadyExist) throw new Error("Question already exist");

//     //Checking for length of data
//     const defaultQuantity = await DefaultQuestion.find();

//     //Adding questions to default questions db
//     let defaultQuestionsResult, result;
//     if (defaultQuantity.length < 3) {
//       defaultQuestionsResult = await DefaultQuestion.create({
//         question,
//         answer,
//         lastNode,
//         default: true,
//         firstNode: true,
//       });
//     } else {
//       //Creating new question
//       result = await Chatfirst.create({
//         question,
//         answer,
//         lastNode,
//         firstNode: false,
//       });
//     }

//     res.send({
//       statusCode: 200,
//       chatbotResponse: result || defaultQuestionsResult,
//       message: "success",
//     });
//   } catch (error) {
//     res.status(404).send({ error: error.message });
//   }
// }

// @desc Add questions to the chatbot
// @route POST /chatbot/add-second-query
// @access Public
// async function addSecondChat(req, res) {
//   const { question, answer, lastNode } = req.body;
//   try {
//     //Input validation
//     if (!question || !answer) throw new Error("Empty fields");

//     if (typeof question !== "string" || !Array.isArray(answer))
//       throw new Error(
//         "Invalid datatypes { question: String, answer: [String], lastNode: boolean (optional) }"
//       );

//     //Checking for already existing question
//     const regExpression = new RegExp("^" + question, "i");
//     const isAlreadyExist = await Chatsecond.findOne({
//       question: regExpression,
//     });
//     if (isAlreadyExist) throw new Error("Question already exist");

//     //Checking for length of data
//     const defaultQuantity = await DefaultQuestion.find();

//     //Adding questions to default questions db
//     let defaultQuestionsResult, result;

//     if (defaultQuantity.length < 3) {
//       defaultQuestionsResult = await DefaultQuestion.create({
//         question,
//         answer,
//         lastNode,
//         default: true,
//         firstNode: true,
//       });
//     } else {
//       //Creating new question
//       result = await Chatsecond.create({
//         question,
//         answer,
//         lastNode,
//         firstNode: false,
//       });
//     }

//     res.send({
//       statusCode: 200,
//       chatbotResponse: result || defaultQuestionsResult,
//       message: "success",
//     });
//   } catch (error) {
//     res.status(404).send({ error: error.message });
//   }
// }

// @desc Get response from the chatbot based on the question
// @route POST /chatbot/chat-response
// @access Public
// async function getChatbotResponse(req, res) {
//   const { question } = req.body;
//   try {
//     if (!question) throw new Error("Empty fields");

//     if (typeof question !== "string")
//       throw new Error("Invalid datatype it should be string");

//     const regExpressionFirst = new RegExp("^" + question, "i");

//     let defaultChat = await DefaultQuestion.findOne({
//       question: regExpressionFirst,
//     }).select({
//       answer: 1,
//       lastNode: 1,
//     });

//     let chatFirst = await Chatfirst.findOne({
//       question: regExpressionFirst,
//     }).select({
//       answer: 1,
//       lastNode: 1,
//     });

//     const chatSecond = await Chatfirst.findOne({
//       question: regExpressionFirst,
//     }).select({
//       answer: 1,
//       lastNode: 1,
//     });

//     if (!defaultChat && !chatFirst && !chatSecond)
//       throw new Error("No detail found! Please select carefully");

//     res.send({
//       statusCode: 200,
//       chatResponse: defaultChat || chatFirst || chatSecond,
//       message: "success",
//     });
//   } catch (error) {
//     res.status(404).send({ error: error.message });
//   }
// }

// @desc Get all chatbot questions
// @route GET /chatbot/chat-questions
// @access Public
// async function getChatbotQuestions(req, res) {
//   try {
//     const result = await DefaultQuestion.find()
//       .select({ question: 1, default: 1 })
//       .where({ default: true });
//     if (!result) throw new Error("No questions found");

//     res.send({
//       statusCode: 200,
//       questions: result,
//       message: "success",
//     });
//   } catch (error) {
//     res.status(404).send({ error: error.message });
//   }
// }

async function addDefaultQuestion(req, res) {
  const { question } = req.body;
  try {
    //Validating input
    if (!question) throw new Error("Empty field");
    if (typeof question !== "string")
      throw new Error("Invalid datatype, it should be string");

    //Checking for existing data
    const isAlreadyExist = await DefaultQuestion.findOne({ question });
    if (isAlreadyExist) throw new Error("Question already exists");

    //Storing data in db
    const result = await DefaultQuestion.create({ question });
    if (!result) throw new Error("Questions not saved");

    //Sending response
    res.send({
      statusCode: 200,
      data: "Question saved successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function getAnswerOfQuestion(req, res) {
  const { id } = req.body;

  try {
    //Validating input
    if (!id) throw new Error("Empty field");
    if (typeof id !== "string")
      return res.send({
        data: "Invalid datatype, it should be a string",
      });

    const result = await ChildNode.find({
      parentId: {
        $in: id,
      },
    });

    const result1 = await ChildNode.find({
      _id: {
        $in: id,
      },
    });

    if (!result || !result1)
      return res.send({
        statusCode: 200,
        data: null,
        message: "No child found",
      });

    res.send({
      statusCode: 200,
      data: result || result1,
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function getDefaultQuestion(req, res) {
  try {
    const result = await DefaultQuestion.find();
    if (!result) throw new Error("No default question found");

    res.send({
      statusCode: 200,
      data: result,
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function getAllChilds(req, res) {
  try {
    const result = await ChildNode.find();
    if (!result) throw new Error("No Node found");

    // const newArray = result.map((child) => {
    //   return moment(child.createdAt).format("YYYY-MM-DD HH:mm:ss");
    // });

    // const newArray = result.map((child) => {
    //   return {
    //     ...child,
    //     createdAt: moment(child.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    //   };
    // });

    // console.log("🚀 ~ file: chatbot.js:303 ~ newArray ~ newArray:", newArray);

    res.send({
      statusCode: 200,
      data: result,
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function editQuestions(req, res) {
  const { question, newValue } = req.body;

  try {
    //Validating inputs
    if (!question || !newValue) throw new Error("Empty field");
    if (typeof question !== "string" || typeof newValue !== "string")
      throw new Error("Invalid datatype, it should be string");

    await ChildNode.findOneAndUpdate(
      {
        question,
      },
      {
        question: newValue,
      }
    );
    await DefaultQuestion.findOneAndUpdate(
      {
        question,
      },
      {
        question: newValue,
      }
    );

    res.send({
      statusCode: 200,
      data: "Childs edited successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function editAnswers(req, res) {
  const { question, prevValue, newValue } = req.body;

  try {
    //Validating inputs
    if (!question || !newValue || !prevValue) throw new Error("Empty field");
    if (typeof question !== "string")
      throw new Error("Invalid datatype, it should be string");

    const data = await ChildNode.find({ question });
    let indexofValue;
    let tmpArray = [];
    data.map((value) => {
      indexofValue = value.answers.indexOf(prevValue);
      tmpArray = value.answers;
    });

    tmpArray.splice(indexofValue, 1, newValue);

    await ChildNode.findOneAndUpdate(
      {
        question,
      },
      {
        answers: tmpArray,
      }
    );

    res.send({
      statusCode: 200,
      data: "Childs edited successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function addMultipleAnswers(req, res) {
  const { question, answers } = req.body;

  try {
    //Validating inputs
    if (!question || !answers) throw new Error("Empty field");
    if (typeof question !== "string" || !Array.isArray(answers))
      throw new Error("Invalid datatype, it should be string & [String]");

    const filteredChilds = await ChildNode.findOne({ question });
    if (!filteredChilds) throw new Error("Question not found");
    filteredChilds.answers.push(...answers);
    const result = await filteredChilds.save();
    if (!result) throw new Error("Data not saved");

    res.send({
      statusCode: 200,
      data: "New Childs added successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteChild(req, res) {
  const { question, answerToRemove } = req.body;
  try {
    //Validating inputs
    if (!question || !answerToRemove) throw new Error("Empty field");
    if (typeof question !== "string")
      return res.send({
        data: "Invalid datatype, it should be a string",
        message: "failed",
      });
    // const result1 = await DefaultQuestion.findOneAndDelete({ question });
    // const result = await ChildNode.findOneAndDelete({ question });
    const data = await ChildNode.find({ question });
    let indexofValue;
    let tmpArray = [];

    data.map((value) => {
      indexofValue = value.answers.indexOf(answerToRemove);
      tmpArray = value.answers;
    });

    if (indexofValue == -1)
      return res.send({
        data: "No Question found",
        message: "failed",
      });

    tmpArray.splice(indexofValue, 1);

    await ChildNode.findOneAndUpdate(
      {
        question,
      },
      {
        answers: tmpArray,
      }
    );

    // if (!result && !result1)
    //   return res.send({
    //     data: "No Question found",
    //     message: "failed",
    //   });

    res.send({
      statusCode: 200,
      data: "Data deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteQuestion(req, res) {
  const { question } = req.body;

  try {
    //Validating inputs
    if (!question) throw new Error("Empty field");
    if (typeof question !== "string")
      return res.send({
        data: "Invalid datatype, it should be a string",
        message: "failed",
      });
    const result1 = await DefaultQuestion.findOneAndDelete({ question });
    const result = await ChildNode.findOneAndDelete({ question });

    if (!result && !result1)
      return res.send({
        data: "No Question found",
        message: "failed",
      });

    res.send({
      statusCode: 200,
      data: "Data deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function addNode(req, res) {
  const { parent, childs, isDefault, resolved, description } = req.body;

  try {
    //Validating inputs
    // if (!parent || !childs || !isDefault) throw new Error("Empty field");
    // if (typeof parent !== "string" || !Array.isArray(childs))
    //   return res.send({
    //     data: "Invalid datatype, it should be a string & [String]",
    //     message: "failed",
    //   });

    if (isDefault) {
      await ChildNode.create({
        name: parent,
        parentId: null,
        isDefault,
        resolved,
        description,
      });
      return res.send({
        statusCode: 200,
        data: "Default Node added successfully",
        message: "success",
      });
    }

    const parentData = await ChildNode.findOne({ name: parent });

    //Inserting data to db
    childs &&
      childs.map(async (value) => {
        await ChildNode.create({
          name: value,
          parentId: parentData._id,
          isDefault,
          resolved,
          description,
        });
      });

    resolved &&
      (await ChildNode.create({
        name: null,
        parentId: parentData._id,
        isDefault,
        resolved,
        description,
      }));

    res.send({
      statusCode: 200,
      data: "Node added successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteNode(req, res) {
  const { id } = req.params;
  let tmpArray = [];
  let tmpArray1 = [];
  try {
    //Validating inputs
    if (!id) throw new Error("Empty field");
    if (typeof id !== "string")
      return res.send({
        statusCode: 404,
        data: "Invalid datatype, it should be a string & [String]",
        message: "failed",
      });

    //Recursive function to delete all child nodes
    await deleteAllChildNode(id, tmpArray);

    res.send({
      statusCode: 200,
      data: "Node deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function editNode(req, res) {
  const { id } = req.params;
  const { newName, description } = req.body;

  try {
    //Validating inputs
    if (!id) throw new Error("Empty field");
    if (typeof id !== "string")
      return res.send({
        statusCode: 404,
        data: "Invalid datatype, it should be String",
        message: "failed",
      });

    await ChildNode.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
      name: newName,
      description: description,
    });

    res.send({
      statusCode: 200,
      data: "Node Edited successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteAllChildNode(id, tmpArray) {
  let rootNode = id;
  let uniqueArray = [];
  let allData = [];

  //Getting all Nodes
  allData = await ChildNode.find({
    parentId: { $in: id },
  });

  //Last child reached
  if (!allData.length) {
    await ChildNode.deleteMany({
      _id: { $in: id },
    });

    await ChildNode.deleteMany({
      _id: { $in: tmpArray },
    });

    await ChildNode.deleteMany({
      parentId: { $in: tmpArray },
    });
    return console.log("Data deleted successfully");
  }

  allData.length &&
    allData.map((value) => {
      tmpArray.push(...tmpArray, rootNode, value._id);
    });

  uniqueArray = Array.from(new Set(tmpArray));

  rootNode = uniqueArray[uniqueArray.length - 1];
  deleteAllChildNode(rootNode, uniqueArray);
}

async function deleteAllNodes(req, res) {
  try {
    const result = await ChildNode.deleteMany({});

    if (!result)
      return res.send({
        statusCode: 500,
        data: "Something went wrong",
        message: "failed",
      });

    res.send({
      statusCode: 200,
      data: "All Nodes deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function getDefaultNodes(req, res) {
  try {
    const result = await ChildNode.find({ isDefault: 1 });

    if (!result)
      return res.send({
        statusCode: 404,
        data: "No Node found",
        message: "failed",
      });

    res.send({
      statusCode: 200,
      data: result,
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

module.exports = {
  addDefaultQuestion,
  getAnswerOfQuestion,
  getDefaultQuestion,
  getAllChilds,
  addMultipleAnswers,
  deleteChild,
  deleteNode,
  editNode,
  deleteQuestion,
  editAnswers,
  editQuestions,
  addNode,
  deleteAllNodes,
  getDefaultNodes,
};

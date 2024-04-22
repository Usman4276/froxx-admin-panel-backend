var express = require("express");
var router = express.Router();
var { registerAdmin, adminLogin } = require("../controllers/admin");
var {
  getAllFaqs,
  faqRegister,
  getSingleFaq,
  deleteAllFaq,
} = require("../controllers/faqs");
var {
  getAllSupports,
  getSingleSupport,
  deleteAllSupport,
} = require("../controllers/support");
var {
  getAllDocuments,
  addDocument,
  deleteAllDocument,
} = require("../controllers/documents");
var {
  addDefaultQuestion,
  getAnswerOfQuestion,
  getDefaultQuestion,
  getAllChilds,
  addMultipleAnswers,
  deleteAllNodes,
  deleteNode,
  editNode,
  deleteQuestion,
  addNode,
  getDefaultNodes,
} = require("../controllers/chatbot");

var { editProfile, deleteAllUsers } = require("../controllers/user");

// ---------------Admin related routes------------------
router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.post("/user/edit", editProfile);
router.delete("/user/delete-all", deleteAllUsers);
router.route("/faqs").get(getAllFaqs).post(faqRegister);
router.post("/faqs/:id", getSingleFaq);
router.delete("/faqs/delete-all", deleteAllFaq);
router.post("/support/:id", getSingleSupport);
router.get("/support", getAllSupports);
router.delete("/support/delete-all", deleteAllSupport);
router.route("/documents").get(getAllDocuments).post(addDocument);
router.delete("/documents/delete-all", deleteAllDocument);
router.post("/chatbot/default", addDefaultQuestion);
router.post("/chatbot/add", addNode);
router.post("/chatbot/update", addMultipleAnswers);
router.get("/chatbot/childs", getAllChilds);
router.get("/chatbot/default", getDefaultNodes);
router.post("/chatbot/:id", deleteNode);
router.delete("/chatbot/all", deleteAllNodes);
router.post("/chatbot/delete/question", deleteQuestion);
router.put("/chatbot/editnode/:id", editNode);
router.route("/chatbot").post(getAnswerOfQuestion).get(getDefaultQuestion);

module.exports = router;

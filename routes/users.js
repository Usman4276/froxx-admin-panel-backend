var express = require("express");
var verifyToken = require("../middlewares/verifyJWT");
var router = express.Router();
var {
  getAllUsers,
  userRegister,
  userLogin,
  changePassword,
  userProfile,
  editProfile,
  deleteUser,
} = require("../controllers/user");
var { getAllFaqs, deleteFaq, editFaq } = require("../controllers/faqs");
var { submitSupport, deleteSupport } = require("../controllers/support");
var { getAllDocuments, deleteDocument } = require("../controllers/documents");

// ---------------User related routes------------------
router.get("/", getAllUsers);
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/change-password", verifyToken, changePassword);
router.post("/profile", verifyToken, userProfile);
router.post("/edit-profile", verifyToken, editProfile);
router.post("/faqs", getAllFaqs);
router.post("/faqs/delete", deleteFaq);
router.post("/faqs/edit", editFaq);
router.post("/support", submitSupport);
router.post("/support/delete", deleteSupport);
router.get("/documents", getAllDocuments);
router.post("/documents/delete", deleteDocument);
router.post("/delete", deleteUser);

module.exports = router;

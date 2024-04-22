const express = require("express");
const getAllAttachments = require("../controllers/documents");
const router = express.Router();

router.post("/", getAllAttachments);

module.exports = router;

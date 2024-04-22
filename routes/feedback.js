var express = require("express");
var { submitFeedback, getFeedback } = require("../controllers/feedback");
var router = express.Router();

router.route("/").post(submitFeedback).get(getFeedback);

module.exports = router;

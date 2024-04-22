var express = require("express");
var { getServiceInfo, addServiceInfo } = require("../controllers/serviceinfo");
var router = express.Router();

router.route("/").get(getServiceInfo).post(addServiceInfo);

module.exports = router;

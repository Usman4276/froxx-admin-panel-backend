const Serviceinfo = require("../models/serviceinfo");

// @desc Get all service information
// @route GET /service
// @access Public
async function getServiceInfo(req, res) {
  try {
    //Getting the service information
    const result = await Serviceinfo.find();
    if (!result) throw new Error("No service information found");

    res.status(200).send({
      statusCode: 200,
      data: result,
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc Post a new service
// @route POST /service
// @access Public
async function addServiceInfo(req, res) {
  const { info } = req.body;
  try {
    //Validating inputs
    if (!info) throw new Error("Empty field");
    if (typeof info !== "string") throw new Error("Data must be a string");

    //Submiting the feedback
    const result = await Serviceinfo.create({ info });
    if (!result) throw new Error("Service information not saved successfully");

    res.status(201).send({
      statusCode: 201,
      data: "Service information saved successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

module.exports = { getServiceInfo, addServiceInfo };

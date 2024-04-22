const Support = require("../models/support");
const upload = require("../middlewares/arrayMulter");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sendMail = require("../middlewares/mailer");
const keys = require("../config/keys");
const moment = require("moment");

// @desc Submitting support
// @route POST /support
// @access Public
function submitSupport(req, res) {
  let emailContent = {};
  let status;

  //Calling multer custom Error handling here
  upload(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError)
        throw new Error("Cannot upload more than 3 files");
      else if (err) {
        throw new Error(err);
      }

      //Validating inputs
      if (!req.body.dop || !req.body.location) throw new Error("Empty fields");
      if (typeof req.body.dop !== "string" || typeof req.body.dop !== "string")
        throw new Error("Invalid datatype it should be string");

      //Storing support data in db
      const supportData = Support.create({
        email: req.body.email,
        dop: req.body.dop,
        filePath: req.files,
        // ext: path.extname(req.file.originalname),
        location: req.body.location,
        // filename: req.file.originalname,
      });

      if (!supportData) throw new Error("Support not submitted successfully");

      //Storing for the email body
      const getSupportData = await Support.findOne({ dop: req.body.dop });
      emailContent = {
        descriptionOfProblem: getSupportData.dop,
        location: getSupportData.location,
        fileUrl: getSupportData.filePath,
      };

      //Sending email to admin
      if (emailContent) {
        status = await sendMail(
          process.env.RECEIPENT_EMAIL,
          null,
          "adminSupport",
          emailContent,
          process.env.FROM
        );
      }

      res.status(201).send({
        statusCode: 200,
        emailStatus: status,
        message: "Your support has been submitted successfully",
      });
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });
}

async function getAllSupports(req, res) {
  try {
    let files = [];

    //Getting all attachments
    const supportData = await Support.find();

    if (!supportData)
      return res.send({
        statusCode: 404,
        allDocs: "No documents found",
        message: "failed",
      });

    //Iterating over array
    supportData.map((val) => {
      files.push({
        _id: val.id,
        email: val.email,
        path: val.filePath.map((item) => {
          return {
            path: path.join(keys.BASE_URL, item.path),
            ext: path.extname(item.originalname),
            filename: item.originalname,
          };
        }),
        dop: val.dop,
        location: val.location,
        createdAt: moment(val.createdAt)
          .utc(val.createdAt)
          // .local()
          .format("dddd DD-MMMM-YYYY, h:mm:ss a"),
      });
    });

    res.send({
      statusCode: 200,
      allDocs: files,
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteSupport(req, res) {
  const { email } = req.body;
  try {
    if (!email) throw new Error("Empty fields");
    const resultData = await Support.findOne({ email });

    //Deleting file sychronously
    resultData.filePath.map((value) => {
      fs.unlinkSync(value.path, (err) => {
        if (err) throw new Error("File not deleted, something went wrong");
      });
    });

    const result = await Support.findOneAndDelete({ email });
    if (!result) throw new Error("Data not found");

    res.send({
      statusCode: 200,
      data: "File deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}
async function deleteAllSupport(req, res) {
  try {
    const result = await Support.deleteMany({});

    if (!result)
      return res.send({
        statusCode: 500,
        data: "Something went wrong",
        message: "failed",
      });

    res.send({
      statusCode: 200,
      data: "All Support deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function getSingleSupport(req, res) {
  const { id } = req.params;
  let files = [];
  try {
    const supportData = await Support.findById(id);
    if (!supportData)
      return res.send({
        statusCode: 404,
        allDocs: null,
        message: "failed",
      });

    files.push({
      email: supportData.email,
      path: supportData.filePath.map((item) => {
        return {
          path: item.path,
          ext: path.extname(item.originalname),
          filename: item.originalname,
        };
      }),
      dop: supportData.dop,
      location: supportData.location,
      createdAt: supportData.createdAt,
    });

    res.status(200).send({ statusCode: 200, data: files, message: "success" });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

module.exports = {
  submitSupport,
  getAllSupports,
  getSingleSupport,
  deleteSupport,
  deleteAllSupport,
};

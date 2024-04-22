const Document = require("../models/documents");
const path = require("path");
const keys = require("../config/keys");
const upload = require("../middlewares/singleMulter");
const multer = require("multer");
const fs = require("fs");
const moment = require("moment");

// @desc Get all documents
// @route GET /api/user/documents
// @access Public
async function getAllDocuments(req, res) {
  try {
    let files = [];

    //Getting all attachments
    const documentData = await Document.find();

    if (!documentData)
      return res.send({
        statusCode: 404,
        allDocs: "No documents found",
        message: "failed",
      });

    //Iterating over array
    documentData.map((val) => {
      files.push({
        path: path.join(keys.BASE_URL, val.filePath),
        forAdmin: val.filePath,
        ext: val.ext,
        filename: val.filename,
        createdAt: moment
          .utc(val.createdAt)
          .local()
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

// @desc POST a document
// @route POST /api/admin/documents
// @access Public
async function addDocument(req, res) {
  upload(req, res, async function (err) {
    try {
      if (err instanceof multer.MulterError)
        throw new Error("Multer error has occured while uploading");
      else if (err) {
        throw new Error(err);
      }

      //Storing document data in db
      const documentData = Document.create({
        filePath: req.file.path,
        ext: path.extname(req.file.originalname),
        filename: req.file.originalname,
      });

      if (!documentData) throw new Error("Support not submitted successfully");

      res.status(201).send({
        statusCode: 200,
        message: "Your document has been submitted successfully",
      });
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  });
}

async function deleteDocument(req, res) {
  const { filename } = req.body;
  try {
    if (!filename) throw new Error("Empty fields");
    const resultData = await Document.findOne({ filename });

    //Deleting file sychronously
    fs.unlinkSync(resultData.filePath, (err) => {
      if (err) throw new Error("File not deleted, something went wrong");
    });

    const result = await Document.findOneAndDelete({ filename });
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

async function deleteAllDocument(req, res) {
  try {
    const result = await Document.deleteMany({});

    if (!result)
      return res.send({
        statusCode: 500,
        data: "Something went wrong",
        message: "failed",
      });

    res.send({
      statusCode: 200,
      data: "All Documents deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

module.exports = {
  getAllDocuments,
  addDocument,
  deleteDocument,
  deleteAllDocument,
};

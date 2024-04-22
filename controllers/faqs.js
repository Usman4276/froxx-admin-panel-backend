const Faq = require("../models/faq");
const moment = require("moment");

// @desc Get all faqs
// @route GET /faqs/
// @access Public
async function getAllFaqs(req, res) {
  try {
    const faqsData = await Faq.find();
    const newFaqDataArray = faqsData.map((value) => {
      return {
        _id: value._id,
        title: value.title,
        body: value.body,
        createdAt: moment(value.createdAt)
          .utc(value.createdAt)
          // .local()
          .format("dddd DD-MMMM-YYYY, h:mm:ss a"),
      };
    });

    if (!faqsData) throw new Error("No faqs found");
    res
      .status(200)
      .send({ statusCode: 200, data: newFaqDataArray, message: "success" });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function getSingleFaq(req, res) {
  const { id } = req.params;
  try {
    const faqsData = await Faq.findById(id);
    if (!faqsData)
      return res.send({
        statusCode: 404,
        data: null,
        message: "failed",
      });
    res
      .status(200)
      .send({ statusCode: 200, data: faqsData, message: "success" });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc Register faqs
// @route POST /faqs/register
// @access Public
async function faqRegister(req, res) {
  const { title, body } = req.body;

  try {
    //Validating input
    if (!title || !body) throw new Error("Empty fields");
    if (typeof title !== "string" || typeof body !== "string")
      throw new Error("Invalid datatype it should be string");

    //Checking for faq already registered
    const faqData = await Faq.findOne({ title, body });
    if (faqData) throw new Error("Faq already registered");

    //Creating new faq
    const result = await Faq.create({
      title,
      body,
    });
    if (!result) throw new Error("Faq not created");
    res.status(201).send({ statusCode: 200, data: result, message: "success" });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteFaq(req, res) {
  const { title } = req.body;

  try {
    if (!title) throw new Error("Empty fields");
    await Faq.findOneAndDelete({ title });
    res.status(200).send({
      statusCode: 200,
      data: "Faq deleted sucessfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteAllFaq(req, res) {
  try {
    const result = await Faq.deleteMany({});

    if (!result)
      return res.send({
        statusCode: 500,
        data: "Something went wrong",
        message: "failed",
      });

    res.send({
      statusCode: 200,
      data: "All Faqs deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function editFaq(req, res) {
  const { prevTitle, title, body } = req.body;

  try {
    if (!prevTitle || !title || !body) throw new Error("Empty fields");
    if (
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof prevTitle !== "string"
    )
      throw new Error("Invalid datatype it should be string");

    const result = await Faq.findOneAndUpdate(
      { title: prevTitle },
      {
        title,
        body,
      }
    );
    if (!result) throw new Error("Faq not updated");

    res.status(200).send({
      statusCode: 200,
      data: "Faq Updated Successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

module.exports = {
  getAllFaqs,
  faqRegister,
  deleteFaq,
  deleteAllFaq,
  editFaq,
  getSingleFaq,
};

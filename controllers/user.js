const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendMail = require("../middlewares/mailer");
const moment = require("moment");

// @desc Get all users
// @route GET /users/
// @access Public
async function getAllUsers(req, res) {
  try {
    const result = await User.find();
    const newResultArray = result.map((value) => {
      return {
        _id: value._id,
        firstname: value.firstname,
        lastname: value.lastname,
        company: value.company,
        email: value.email,
        createdAt: moment
          .utc(value.createdAt)
          .local()
          .format("dddd DD-MMMM-YYYY, h:mm:ss a"),
      };
    });

    if (!result) throw new Error("User not found");
    res.status(200).send({ statusCode: 200, data: newResultArray });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc User registration
// @route POST /users/register
// @access Public
async function userRegister(req, res) {
  const { firstname, lastname, email, password, company } = req.body;

  try {
    //Validating inputs
    if (!firstname || !lastname || !email || !password)
      throw new Error("Empty fields");
    if (
      typeof firstname !== "string" ||
      typeof lastname !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    )
      throw new Error("Invalid datatype it should be string");

    //Checking for user already registered
    const userData = await User.findOne({ email });
    if (userData) throw new Error("User already registered");

    //Creating new user
    const result = await User.create({
      firstname,
      lastname,
      email,
      password: await hashPassword(password),
      company,
    });
    if (!result) throw new Error("User not created");

    //Sending email
    const emailSendStatus = await sendMail(email, password, "welcomeEmail");

    if (!emailSendStatus.success) {
      await User.findOneAndDelete({ email });
      return res.status(200).send({
        success: emailSendStatus.success,
        message: emailSendStatus.message,
        data: null,
      });
    }

    res.status(201).send({ success: true, data: result, emailSendStatus });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc User login
// @route POST /users/login
// @access Public
async function userLogin(req, res) {
  const { email, password } = req.body;

  try {
    //Validating inputs
    if (!email || !password) throw new Error("Empty fields");
    if (typeof email !== "string" || typeof password !== "string")
      throw new Error("Invalid datatype it should be string");

    //Finding users from database
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found");

    const result = await bcrypt.compare(password, user.password);
    if (!result) throw new Error("Invalid credentials");

    res.status(200).send({
      statusCode: 200,
      data: {
        token: generateJWT(
          user.firstname,
          user.lastname,
          user.email,
          user.company
        ),
      },
      message: "success",
      isChangePassword: user.isChangePassword,
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc Change user password
// @route POST /users/change-password
// @access Private
async function changePassword(req, res) {
  const { email, password, confirmPassword, oldPassword } = req.body;

  try {
    //Validating inputs
    if (!password || !confirmPassword || !oldPassword)
      throw new Error("Empty fields");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      typeof oldPassword !== "string"
    )
      throw new Error("Invalid datatype it should be string");

    if (password !== confirmPassword)
      throw new Error("Password not matches with confirm password");

    //Getting the user to check for old password
    const user = await User.findOne({ email });
    const verification = await bcrypt.compare(oldPassword, user.password);
    if (!verification) throw new Error("Wrong old password");

    //Updating user data
    await User.findOneAndUpdate(
      { email },
      { password: await hashPassword(password), isChangePassword: true },
      {
        new: true,
      }
    );

    return res.status(200).send({
      statusCode: 200,
      data: "Password changed successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc Edit user profile data
// @route POST /users/edit-profile
// @access Private
async function editProfile(req, res) {
  const { email, firstname, lastname, company } = req.body;

  try {
    //Validating inputs
    if (!firstname || !lastname || !company) throw new Error("Empty fields");

    if (
      typeof email !== "string" ||
      typeof firstname !== "string" ||
      typeof lastname !== "string" ||
      typeof company !== "string"
    )
      throw new Error("Invalid datatype it should be string");

    const result = await User.updateOne(
      { email },
      { firstname, lastname, company },
      { password: 0 }
    );

    const userData = await User.findOne(
      { email },
      {
        password: 0,
        isChangePassword: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );

    if (result)
      return res.status(200).send({
        statusCode: 200,
        data: userData,
        message: "User updated successfully",
      });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

// @desc Get user profile data
// @route GET /users/profile
// @access Private
async function userProfile(req, res) {
  const { email } = req.body;

  try {
    if (typeof email !== "string")
      throw new Error("Invalid datatype it should be string");

    const result = await User.findOne({ email }, { password: 0 });
    if (result)
      return res
        .status(200)
        .send({ statusCode: 200, data: result, message: "success" });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteUser(req, res) {
  const { email } = req.body;

  try {
    if (!email) throw new Error("Empty fields");
    await User.findOneAndDelete({ email });
    return res.status(200).send({
      statusCode: 200,
      data: "User deleted sucessfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

async function deleteAllUsers(req, res) {
  try {
    const result = await User.deleteMany({});

    if (!result)
      return res.send({
        statusCode: 500,
        data: "Something went wrong",
        message: "failed",
      });

    res.send({
      statusCode: 200,
      data: "All Users deleted successfully",
      message: "success",
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

//Genereate JWT
function generateJWT(firstname, lastname, email, company) {
  return jwt.sign(
    { firstname, lastname, email, company },
    process.env.JWT_SECERET
  );
}

// Hashing password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

module.exports = {
  getAllUsers,
  userRegister,
  userLogin,
  changePassword,
  userProfile,
  editProfile,
  deleteUser,
  deleteAllUsers,
};

const nodemailer = require("nodemailer");
const keys = require("../config/keys");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const sendMail = async (
  recipientEmail,
  recipientPassword,
  templateName,
  emailBody,
  From
) => {
  try {
    let status;

    //Transport configuration
    let transporter = nodemailer.createTransport({
      host: keys.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // View Engine middleware
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          layoutsDir: "views/",
          defaultLayout: false,
        },
        viewPath: "views/",
        extName: ".hbs",
      })
    );

    //Sendmail function
    let info = await transporter.sendMail({
      from: From ? From : keys.FROM,
      to: recipientEmail,
      subject: "Visual Assistance Support Application",
      text: "Visual Assistance Support Application",
      template: templateName,
      context: {
        email: recipientEmail,
        password: recipientPassword,
        dop: emailBody && emailBody?.descriptionOfProblem,
        location: emailBody && emailBody?.location,
      },
      attachments: emailBody && emailBody?.fileUrl,
    });

    //Returning the status
    if (!info.messageId)
      status = { success: false, message: "Email failed to send" };
    else status = { success: true, message: "" };

    return status;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = sendMail;

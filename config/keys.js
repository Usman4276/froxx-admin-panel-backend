const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const MONGODB_URL = process.env.MONGODB_URL;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FROM = process.env.FROM;
const HOST = process.env.HOST;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

module.exports = {
  BASE_URL,
  MONGODB_URL,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  PORT,
  FROM,
  HOST,
  ADMIN_EMAIL,
};

require('dotenv').config();

const url = process.env.URL;
const key = process.env.TOKEN_FX;

module.exports = {
  url,
  key,
};

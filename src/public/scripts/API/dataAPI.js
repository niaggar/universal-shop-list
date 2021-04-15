const axios = require('axios');
const config = require('./config');

async function dataApi(value) {
  const url = `${config.url}${value}?access_key=${config.key}`;
  try {
    const response = await axios.get(url);
    const { symbols } = response.data;
    const countrys = Object.entries(symbols);

    return new Promise((resolve, reject) => {
      resolve({ values: countrys });
    });
  } catch (err) {
    console.log(err);

    return { values: [['none', 'none']] };
  }
}

module.exports = dataApi;

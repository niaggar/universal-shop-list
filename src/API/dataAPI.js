const axios = require('axios');
const config = require('./config');

// value could be <<symbols>> <<latest>>
async function dataApi(value) {
  const url = `${config.url}${value}?access_key=${config.key}`;
  value = value == 'latest' ? 'rates' : value;
  try {
    let response;
    response = await axios.get(url);
    response = response.data[value];
    response = Object.entries(response);

    return { values: response };
  } catch (err) {
    console.log(err);

    return { values: [['none', 'none']] };
  }
}

module.exports = dataApi;

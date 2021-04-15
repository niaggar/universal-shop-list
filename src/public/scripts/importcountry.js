const path = require('path');
const fs = require('fs/promises');

async function importCountry() {
  const contryPath = path.join(process.cwd(), 'src/public/data/country.json');

  try {
    let response = await fs.readFile(contryPath);

    response = JSON.parse(response);
    response = Object.entries(response);

    return { values: response };
  } catch (err) {
    console.log(err);

    return [['none', 'none']];
  }
}

module.exports = importCountry;

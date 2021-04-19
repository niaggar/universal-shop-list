const { conectDb } = require('../../../database/database');
const dataApi = require('../../API/dataAPI');

const convert = async (db, todiv = 'EUR', values) => {
  const conversor = await dataApi('latest');

  if (!values) {
    values = await db.get('list').map('imp-price').value();
  }

  conversor.values.forEach((div) => {
    if (div[0] == todiv) {
      values.forEach((element, index) => {
        values[index] = (parseFloat(element) * div[1]).toFixed(1);
      });
    }
  });

  return values;
};

module.exports = convert;

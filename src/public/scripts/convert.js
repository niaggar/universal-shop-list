const dataApi = require('../../API/dataAPI');

const convert = async (db, todiv = 'EUR', values, conversor) => {
  if (!conversor) {
    conversor = await dataApi('latest');
  }

  if (!values) {
    values = await db.get('list').map('imp-price').value();
  }

  conversor.values.forEach((div) => {
    let numFix = div[0] == 'BTC' ? 5 : 1;
    if (div[0] == todiv) {
      values.forEach((element, index) => {
        values[index] = (parseFloat(element) * div[1]).toFixed(numFix);
      });
    }
  });

  return values;
};

module.exports = convert;

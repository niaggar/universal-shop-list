const { Router } = require('express');
const router = Router();

// const dataApi = require('../public/scripts/API/dataAPI');
const importCountry = require('../public/scripts/importCountry');
const { getConection } = require('../../database/database');

router.get('/', (req, res) => {
  const db = getConection();

  importCountry()
    .then((data) => {
      let databaseData = db.get('list').value();

      const infoToSent = {
        values: data.values,
        list: databaseData,
      };

      res.render('pages/index', infoToSent);
    })
    .catch((err) => {
      res.render('pages/index', err);
    });
});

router.post('/add', (req, res) => {
  const db = getConection();

  db.get('list').push(req.body).write();

  res.status(200).redirect('/');
});

module.exports = router;

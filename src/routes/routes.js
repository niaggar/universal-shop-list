const { Router } = require('express');
const { nanoid } = require('nanoid');
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

router.get('/knowid', (req, res) => {
  const db = getConection();
  const ids = db.get('list').map('id').value();
  res.send(ids);
});

router.post('/editstate/', async (req, res) => {
  const db = getConection();

  db.get('list')
    .find({ id: req.body.id })
    .assign({ state: req.body.state })
    .write();

  res.status(200).send('All is fine');
});

router.post('/add', (req, res) => {
  const db = getConection();
  let id = nanoid();
  db.get('list')
    .push({
      id,
      state: false,
      ...req.body,
    })
    .write();

  res.status(200).redirect('/');
});

module.exports = router;

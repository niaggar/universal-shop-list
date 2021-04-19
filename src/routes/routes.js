const { Router } = require('express');
const { nanoid } = require('nanoid');
const router = Router();

const dataApi = require('../API/dataAPI');
const convert = require('../public/scripts/convert');
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

<<<<<<< HEAD
router.get('/price/:div', async (req, res) => {
  const db = getConection();
  const todiv = req.params.div;

  console.log(todiv);

  let values;
  values = await db
=======
router.get('/price', (req, res) => {
  const db = getConection();

  const values = db
>>>>>>> d44753e8d1972c3762b525d57c9e04dd89bb97d2
    .get('list')
    .filter({ state: false })
    .map('imp-price')
    .value();
<<<<<<< HEAD
  values = await convert(db, todiv, values);

  console.log(values);
=======
>>>>>>> d44753e8d1972c3762b525d57c9e04dd89bb97d2

  res.status(200).send(values);
});

router.post('/editstate/', async (req, res) => {
  const db = getConection();

  db.get('list')
    .find({ id: req.body.id })
    .assign({ state: req.body.state })
    .write();

  res.status(200).send('All is fine');
});

router.post('/add', async (req, res) => {
  const db = getConection();

  if (req.body['imp-divisa'] != 'EUR') {
    const data = await dataApi('latest');

    data.values.forEach((element) => {
      if (element[0] == req.body['imp-divisa']) {
        req.body['imp-price'] = (
          parseInt(req.body['imp-price']) / element[1]
        ).toFixed(1);
      }
    });

    req.body['imp-divisa'] = 'EUR';
  }

  db.get('list')
    .push({
      id: nanoid(),
      state: false,
      ...req.body,
    })
    .write();

  res.status(200).redirect('/');
});

router.post('/convert', async (req, res) => {
  const db = getConection();
  let results = await convert(db, req.body.toConvert);

  res.status(200).send(results);
});

module.exports = router;

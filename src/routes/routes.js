const { Router } = require('express');
const { nanoid } = require('nanoid');
const router = Router();

const dataApi = require('../API/dataAPI');
const convert = require('../public/scripts/convert');
const importCountry = require('../public/scripts/importCountry');
const { getConection } = require('../../database/database');

let localstorageAPI;

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

// Return the IDs of the task list
router.get('/know', (req, res) => {
  const db = getConection();
  const ids = db.get('list').map('id').value();
  res.status(200).send(ids);
});

// Return the data of the API
router.get('/API', async (req, res) => {
  let resultAPI;
  resultAPI = await dataApi('latest', false);

  resultAPI = {
    time: new Date().toLocaleDateString(),
    ...resultAPI,
  };

  res.status(200).send(resultAPI);
});

router.post('/price/', async (req, res) => {
  const db = getConection();

  const todiv = req.body.div;
  const conversor = req.body.values;

  localstorageAPI = conversor;

  let values;
  values = await db
    .get('list')
    .filter({ state: false })
    .map('imp-price')
    .value();
  values = await convert(db, todiv, values, { values: conversor });

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
    localstorageAPI.forEach((element) => {
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
  let results = await convert(db, req.body.toConvert, false, {
    values: req.body.values,
  });

  res.status(200).send(results);
});

module.exports = router;

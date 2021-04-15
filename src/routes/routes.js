const { Router } = require('express');
const router = Router();

// const dataApi = require('../public/scripts/API/dataAPI');
const importCountry = require('../public/scripts/importCountry');

router.get('/', (req, res) => {
  importCountry()
    .then((data) => {
      res.render('pages/index', data);
    })
    .catch((err) => {
      res.render('pages/index', err);
    });
});

router.post('/add', (req, res) => {
  res.status(200).redirect('/');
});

module.exports = router;

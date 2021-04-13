const { Router } = require('express');
const router = Router();

const dataApi = require('../public/scripts/API/dataAPI');

router.get('/', (req, res) => {
  dataApi('symbols')
    .then((data) => {
      console.log('Todo bien');
      res.render('pages/index', data);
    })
    .catch((err) => {
      console.log(`Error on the promise: ${err}`);
      res.render('pages/index', {});
    });
});

module.exports = router;

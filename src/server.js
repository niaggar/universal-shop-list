const express = require('express');
const router = require('./routes/routes.js');
const path = require('path');

class App {
  constructor(port = 8000) {
    this.port = port;
    this.app = express();
    this.middelwares();
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`>>> Listening on port ${this.port}`);
    });
  }

  middelwares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.use(router);
  }
}

module.exports = App;

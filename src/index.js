const App = require('./server');
const { conectDb } = require('../database/database');

const app = new App(8181);

app.start();
conectDb();

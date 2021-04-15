const App = require('./server');
const { conectDb } = require('../database/database');

const app = new App();

app.start();
conectDb();

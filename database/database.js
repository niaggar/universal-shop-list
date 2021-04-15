const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

let db;

async function conectDb() {
  const adapter = new FileAsync('db.json');
  db = await lowdb(adapter);
  db.defaults({ list: [] }).write();
}

function getConection() {
  return db;
}

module.exports = {
  conectDb,
  getConection,
};

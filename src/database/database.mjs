import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

class db {

  constructor() {
    this.adapter = new FileSync('database.json');
    this.database = lowdb(this.adapter);
    this.initialice();
  }
  
  initialice() {
    this.database.defaults({ list: [] })
      .write();
  }

  dbwrite(data) {
    this.database.get('list')
      .push({ 
        ...data,
      })
      .write()
  }

}

const database = new db();

export default database;
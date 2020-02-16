const sqlite3 = require('sqlite3').verbose();


module.exports = {
  GetCache: (dbPath) => {
    return new sqlite3.Database(dbPath, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to SQlite database.');
    });
  }
}
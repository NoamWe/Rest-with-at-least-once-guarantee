
const dbFactory = require('./DbFactory')

const db = dbFactory.GetCache('db/data.db')

module.exports = {


    init: () => {
        db.run(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY,
            name TEXT)`);
    },

    insert: (name) => {

        return new Promise((resolve,reject)=>{
            db.run(`INSERT INTO users(name) VALUES(?)`, name, function (err) {
                if (err) {
                    reject(err)
                }
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                resolve(this.lastID)
            });
        })
    },

    selectAll: () => {
        const sql = `SELECT * FROM users`

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row.name);
            });
        });

    },
    close: () => {
        db.close();
    }
}
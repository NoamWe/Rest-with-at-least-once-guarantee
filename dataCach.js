
const dbFactory = require('./DbFactory')

const db = dbFactory.GetCache('db/data.db')

module.exports = {


    init: () => {
        return new Promise((resolve,reject)=>{
            db.run(`
            CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY,
                name TEXT)`, function(err){
                    if(err) {
                        reject(err) 
                    }
                    resolve()
                });
        })
    },

    insert: (name) => {
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM users`
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err)
                }
                resolve(rows)
            });
        })
    },

    close: () => {
        return new Promise((resolve, reject) => {
            db.close(function(err){
                if (err) {
                    reject(err)
                } 
                console.log('disconnected from SQLite server')
                resolve();
            });

        })

    }
}
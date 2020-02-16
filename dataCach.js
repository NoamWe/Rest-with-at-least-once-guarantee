const dbFactory = require('./DbFactory')
const db = dbFactory.GetCache('db/data.db')

function init() {
    return new Promise((resolve, reject) => {
        db.run(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            completed INTEGER DEFAULT 0)`, function (err) {
            if (err) {
                reject(err)
            }
            resolve()
        });
    })
}

function insert(name) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users(name) VALUES(?)`, name, function (err) {
            if (err) {
                reject(err)
            }
            // get the last insert id
            console.log(`A row has been inserted id:${this.lastID} name: ${name}`);
            resolve(this.lastID)
        });
    })
}

function selectAll() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users`
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        });
    })
}

function update(dataId) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET completed=1 WHERE id=?;`
        db.run(sql, dataId, function (err) {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
}

function close() {
    return new Promise((resolve, reject) => {
        db.close(function (err) {
            if (err) {
                reject(err)
            }
            console.log('disconnected from SQLite server')
            resolve();
        });

    })
}

function selectNonCompleted() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users
        WHERE completed=0`
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        });
    })

}

module.exports = {

    init,
    insert,
    selectAll,
    update,
    close,
    selectNonCompleted
}
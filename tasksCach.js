
const dbFactory = require('./DbFactory')

const db = dbFactory.GetCache('db/tasks.db')

module.exports = {

    init: () => {

        db.run(`
        CREATE TABLE IF NOT EXISTS tasks(
            id INTEGER PRIMARY KEY,
            name TEXT)`);
    },

    insert: (name) => {

        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO tasks(name) VALUES(?)`, name, function (err) {
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
            const sql = `SELECT * FROM tasks`

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                // rows.forEach((row) => {
                //     console.log(row.name);
                // });
                resolve(rows)
                // return rows
            });
        })
    },

    deleteAll: () => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM tasks', function (err) {
                if (err) {
                    reject(err)
                }
                // get the last insert id
                console.log(`all previous tasks have been deleted`);
                resolve()
            });
        })
    },
    delete: (taskId) => {
        return new Promise((resolve,reject)=>{
            const sql = `DELETE FROM tasks
                         WHERE id=?`
            const id = parseInt(taskId)
            db.run(sql, id, function (err) {
                if (err) {
                    reject(err)
                }
                // get the last insert id
                console.log(`task id: ${id} has been deleted`);
                resolve(id)
            });
        })
    },
    close: () => {
        db.close();
    }
}
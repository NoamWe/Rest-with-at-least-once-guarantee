const sql = require('mssql')
const keys = require('../config/keys');

const config = {
  user: keys.DB.user,
  password: keys.DB.password,
  server: keys.DB.server,
  database: keys.DB.database,
  connectionTimeout: 300000,
  idleTimeoutMillis: 300000,
  requestTimeout: 300000,
  options: {
    encrypt: true
  }
}

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => {
    console.log('Database Connection Failed! Bad Config: ', err)
  })

module.exports = {
  sql, poolPromise
}
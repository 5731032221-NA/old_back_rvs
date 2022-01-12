const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
// const config = require('../../nuxt.config.js')
// config.dev = process.env.NODE_ENV !== 'production'
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname))
app.disable('x-power-by')
const { getDBConf } = require('../ws/db/dbConfig')
const DbConnect = require('../ws/db/dbConnect').DbConnect
const DBCnf = getDBConf()
const port = require('../ws/sys/configPort')
const Log = require('../ws/Utility/log').Log
const authen = require('./authen')
const assetRouter = require("./asset");
const serve = app.listen(port.login, () => {
  console.log('Server listening on ', port.login)
})
try {
  const dbConn = new DbConnect(DBCnf).getCnn()
  dbConn
    .then(async (connection) => {
      app.use(authen)
      app.use(assetRouter);
    })
    .catch((error) => {
      const data = `ORM CONNECTION|${error}`
      // method, error number
      // error message ที่มี error number
      const lg = new Log()
      lg.setLog(data)
      console.log('ORM connection error: ', error)
    })
} catch (error) {
  const data = `ORM Create |${error}`
  // method, error number
  // error message ที่มี error number
  const lg = new Log()
  lg.setLog(data)
  console.log('DATABASE ' + error)
}

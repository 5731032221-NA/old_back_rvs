const crt = require('crypto')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const svPort = require('../ws/sys/configPort')
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname))
app.disable('x-power-by')
const { mdwAuth } = require('./mdwAuth')
const port = svPort.login
const pid = process.pid
const serve = app.listen(port, () => {
  console.log('Server listening on ', port)
})

app.get('/', (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})
app.get('/welcome', (req, res, next) => {
  const resp = {
    status: '1000',
    msg: 'Welcome Town Hall'
  }
  res.send(resp)
})
app.post('/login', async (req, res, next) => {
  const resp = {
    status: '0000',
    contents: []
  }
  try {
    const { username, password } = req.body.user
    const pwd = crt
      .createHash('md5')
      .update(password)
      .digest('hex')
    // const { username, password } = req.query
    const tkn = mdwAuth(username, pwd)
    if (tkn) {
      resp.status = '3000'
      res.set('authorization', tkn.accessToken)
      res.set('refresh-token', tkn.refreshToken)
      resp.contents.push(tkn)
      res.send(resp)
    } else {
      resp.contents = 'Username or Password Invalid'
      res.send(resp)
    }
  } catch (error) {
    console.log(error)
    resp.contents.push(error)
    res.send(resp)
  }
})
app.delete('/login', (req, res, next) => {
  // const { params } = req.headers
  // setLog
  const resp = {
    status: '1000',
    msg: 'Logout success',
    content: []
  }
  try {
    req.headers.authorization = ' '
    res.send(resp)
  } catch (error) {
    resp.content.push(error)
    res.send(resp)
  }
})

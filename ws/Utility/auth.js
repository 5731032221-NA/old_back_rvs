const JSC = require('./jwtservice').jwtService
const userVerify = (req, res, next) => {
  try {
    const jsc = new JSC()
    const token = req.headers.authorization
    if (jsc.verify(token)) {
      next()
    } else {
      const resp = {
        status: '0000',
        msg: 'Acess Deny'
      }
      res.send(resp)
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  userAuth: userVerify
}

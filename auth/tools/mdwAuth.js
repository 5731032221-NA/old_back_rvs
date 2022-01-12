const { TOKENEXPIREIN } = require('../../sys/service')
const usersRole = require('../../sys/users')
const JSC = require('../../Utility/jwtService').jwtService
const { tokenID } = require('../Utility/tools')
const mdwAuth = (data) => {
  const jsc = new JSC()
  try {

    const payload = {
      sub: data,
      iat: new Date().getTime(),
      expiresIn: '120',
      algorithm: 'HS256',
      id: tokenID
    }
    // set session : token
    return jsc.sign(payload)
  } catch (error) {
    return {
      status: '0000',
      msg: 'Acess dedy!!'
    }
  }
}

const refreshToken = function(usr, pwd) {
  let rft = ''
  return rft
}

module.exports = {
  mdwAuth
}

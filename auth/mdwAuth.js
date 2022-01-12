// const usersRole = require('../ws/sys/users')
const JSC = require('../ws/Utility/jwtService').jwtService
const { tokenID } = require('../ws/Utility/tools')
const mdwAuth = (data) => {
  const jsc = new JSC()
  try {
    let tn = new Date()
    // tn.setHours(1, 0, 0)
    const payload = {
      sub: data,
      // iat: tn.getTime(),
      exp: (tn.getTime() / 1000) + (15*60),
      id: tokenID()
    }
    return jsc.sign(payload)
  } catch (error) {
    console.log('authen  ', error)
    return {
      status: '0000',
      msg: 'Acess dedy!!'
    }
  }
}
module.exports = {
  mdwAuth
}

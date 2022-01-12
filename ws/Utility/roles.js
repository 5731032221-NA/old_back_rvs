const JSC = require('./jwtService').jwtService
const usersRole = require('../sys/users')
const jsc = new JSC()
const roles = (params) => {
  const result = false
  const vrTkn = params.headers.authorization
    ? params.headers.authorization
    : false
  if (params.startWith('Bearer')) {
    const vrTkn = req.headers.authorization.split(' ')[1]
  } else {
    const tkn = jsc.verify(params)
    console.log(tkn)
  }

  console.log(result)
  return result
}

module.exports = {
  roles
}

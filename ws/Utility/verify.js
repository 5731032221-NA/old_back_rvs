const JSC = require('./jwtservice').jwtService
const userVerify = (tkn, comp) => {
  try {
    const jsc = new JSC()
    return jsc.verify(tkn, comp)
  } catch (e) {

    throw new Error(e)
  }
}

module.exports = {
  userAuth: userVerify
}

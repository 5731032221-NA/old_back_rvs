const _LIMIT = 5
const _USERS = []
class Session {
  constructor() {
    this.limited = _LIMIT
    this.users = _USERS
  }

  add(usersIP, tmsp) {
    let result = this.users.find((e) => {
      console.log(e)
      if (e.userIP !== usersIP) {
        console.log('test ')
        this.users.push({
          userIP: usersIP,
          lastTmsp: tmsp
        })
        return e
      }
    })
  }

  update(usersIP) {
    let result = this.users.find((e) => {
      if (e.userIP === usersIP) {
        e.lastTmsp = new Date(15 * 3600 * 1000)
        return e
      }
    })
  }

  isLimited() {
    return this.users.length === _LIMIT
  }

  print() {
    console.log(this.users)
  }
}

module.exports = {
  Session
}

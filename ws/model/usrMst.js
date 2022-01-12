class usrMst {
  constructor(info) {
    this.data = {
      userid: null,
      usrlogin: null,
      password: null,
      usrtype: null
    }
    this.fill(info)
  }

  fill = (info) => {
    for (const prop in this.data) {
      if (this.data[prop] !== 'undefined') {
        this.data[prop] = info[prop]
      }
    }
  }
}

module.exports = {
  usrMst
}

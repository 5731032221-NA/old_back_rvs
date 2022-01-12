class usrpermisionMst {
  constructor(info) {
    this.data = {
      propertyid: null,
      branchid: null,
      userid: null,
      usrpermission: null,
      dev: null,
      beta: null,
      status: null
    }
    this.fill(info)
  }

  fill = (info) => {
    if (info) {
      for (const prop in this.data) {
        if (this.data[prop] !== 'undefined') {
          this.data[prop] = info[prop]
        }
      }
    }
  }
}

module.exports = {
  usrpermisionMst
}

class usrMenus {
  constructor(info) {
    this.data = {
      listname: null,
      parent: null,
      description: null,
      recordstatus: null,
      category: null,
      value: null
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
  usrMenus
}

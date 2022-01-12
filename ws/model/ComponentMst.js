class componentMst {
  constructor(info) {
    this.data = {
      componentid: null,
      name: null,
      position: null,
      seq: null,
      state: null
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
  componentMst
}

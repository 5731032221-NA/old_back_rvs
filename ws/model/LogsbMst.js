class LogsMst {
  constructor(info) {
    this.data = {
      information: null
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
  LogsMst
}

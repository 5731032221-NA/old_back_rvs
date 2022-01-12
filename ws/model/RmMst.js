class RmMst {
  constructor(info) {
    this.data = {
      rmproperty: null,
      roommno: null,
      roomtype: null,
      floor: null,
      building: null,
      wing: null,
      exposure: null,
      description: null,
      sqsize: null,
      seq: null,
      status: null,
      attribute: null
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
  RmMst
}

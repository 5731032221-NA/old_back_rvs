class cfgmst {
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
    lang()
    desc()
  }

  fill = (info) => {
    for (const prop in this.data) {
      if (this.data[prop] !== 'undefined') {
        this.data[prop] = info[prop]
      }
    }
  }
}

function lang() {
  const oo = this.description.split('-')
  this.description = oo[0]
  return oo[1]
}

function desc(desc = '', lang = '') {
  this.description = `${desc}-${lang.toUpperCase()}`
}

module.exports = {
  cfgmst
}

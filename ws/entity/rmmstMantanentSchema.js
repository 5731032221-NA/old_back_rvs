const EntitySchema = require('typeorm').EntitySchema
const rmmst = require('../model/rmmstMantanent').rmmstMantanent

module.exports = new EntitySchema({
  name: 'rmmst',
  target: rmmst,
  columns: {
    listname: {
      primary: true,
      type: 'character',
      generated: false
    },
    parent: {
      type: 'character'
    },
    description: {
      type: 'character varying'
    },
    category: {
      type: 'character varying'
    },
    recordstatus: {
      type: 'character'
    }
  }
})

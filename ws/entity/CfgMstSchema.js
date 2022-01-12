const EntitySchema = require('typeorm').EntitySchema
const cfgmst = require('../model/CfgMst').CfgMst

module.exports = new EntitySchema({
  name: 'cfgmst',
  target: cfgmst,
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
    recordstatus: {
      type: 'character'
    },
    category: {
      type: 'character varying'
    },
    value: {
      type: 'character varying'
    }
  }
})

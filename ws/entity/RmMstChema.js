const EntitySchema = require('typeorm').EntitySchema
const rmmst = require('../model/Rmmst').RmMst

module.exports = new EntitySchema({
  name: 'rmmst',
  target: rmmst,
  columns: {
    rmproperty: {
      primary: true,
      type: 'character varying',
      generated: false
    },
    rmno: {
      type: 'character varying'
    },
    rmtypeid: {
      type: 'character varying'
    },
    floorid: {
      type: 'character'
    },
    buildingid: {
      type: 'character varying'
    },
    wingid: {
      type: 'character varying'
    },
    exposure: {
      type: 'character varying'
    },
    rmdesc: {
      type: 'character varying'
    },
    rmsqsize: {
      type: 'integer'
    },
    rmseq: {
      type: 'integer'
    },
    rmstatus: {
      type: 'character varying'
    },
    rmattribute: {
      type: 'character varying'
    }
  },
  relations: {
    listname: {
      target: "cfgmst",
      type: "one-to-many",
      joinTable: true,
      cascade: true
    }
  }
})

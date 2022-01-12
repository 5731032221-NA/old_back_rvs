const EntitySchema = require('typeorm').EntitySchema
const cmpgdtl = require('../model/cmpgDtl').cmpgDtl

module.exports = new EntitySchema({
  name: 'cmpgdtl',
  target: cmpgdtl,
  columns: {
    cmstid: {
      primary: true,
      type: 'integer',
      generated: true
    },
    promocode: {
      type: 'character varying'
    },
    strdate: {
      type: 'timestamp with time zone',
    },
    enddate: {
      type: 'timestamp with time zone',
    },
    mkt: {
      type: 'character varying'
    },
    source: {
      type: 'character varying'
    },
    channel: {
      type: 'character varying'
    },
    profiles: {
      type: 'integer'
    },
    status: {
      type: 'character'
    },
    remark: {
      type: 'text'
    },
    cmpgdtlid: {
      type: 'integer'
    }
  }
})

const EntitySchema = require('typeorm').EntitySchema
const cmpgmst = require('../model/cmpgMst').CmpgMst

module.exports = new EntitySchema({
  name: 'cmpgmst',
  target: cmpgmst,
  columns: {
    cmpgmstid: {
      primary: true,
      type: 'integer',
      generated: true
    },
    name: {
      type: 'character varying'
    },
    detail: {
      type: 'character varying'
    },
    strdate: {
      type: 'timestamp with time zone',
    },
    strtime: {
      type: 'time with time zone'
    },
    enddate: {
      type: 'timestamp with time zone',
    },
    endtime: {
      type: 'time with time zone'
    },
    status: {
      type: 'integer'
    },
    note: {
      type: 'integer'
    },
    indefinitely: {
      type: 'boolean'
    },
    qtyeachtime: {
      type: 'smallint'
    },
    brandcode: {
      type: 'character varying'
    }
  }
})

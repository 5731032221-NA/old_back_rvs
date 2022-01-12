const EntitySchema = require('typeorm').EntitySchema
const cmpgdtl = require('../model/cmpgDtl').cmpgDtl

module.exports = new EntitySchema({
  name: 'cmpgdtl',
  target: cmpgdtl,
  columns: {
    cmpgdtlid: {
      primary: true,
      type: 'integer',
      generated: true
    },
    recurring: {
      type: 'character varying'
    },
    description: {
      type: 'character varying'
    },
    strdate: {
      type: 'timestamp with time zone'
    },
    strtime: {
      type: 'time with time zone'
    },
    enddate: {
      type: 'timestamp with time zone'
    },
    endtime: {
      type: 'time with time zone'
    },
    validfrom: {
      type: 'date'
    },
    validto: {
      type: 'date'
    },
    disc: {
      type: 'integer'
    },
    amount: {
      type: 'smallint'
    },
    minamnt: {
      type: 'smallint'
    },
    maxamnt: {
      type: 'smallint'
    },
    minpurchase: {
      type: 'smallint'
    },
    maxpurchase: {
      type: 'smallint'
    },
    actqty: {
      type: 'smallint'
    },
    usedqty: {
      type: 'smallint'
    },
    qty: {
      type: 'integer'
    },
    qtyforevery: {
      type: 'smallint'
    },
    note: {
      type: 'character varying'
    },
    promotype: {
      type: 'character varying'
    },
    recurringflag: {
      type: 'character varying'
    },
    validoption: {
      type: 'character varying'
    },
    frequency: {
      type: 'smallint'
    },
    onday: {
      type: 'character varying'
    },
    onthe: {
      type: 'smallint'
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
      type: 'character varying'
    },
    note: {
      type: 'character varying'
    },
    status: {
      type: 'character'
    },
    remark: {
      type: 'text'
    },
    cmpgmstid: {
      type: 'integer'
    }
  }
})

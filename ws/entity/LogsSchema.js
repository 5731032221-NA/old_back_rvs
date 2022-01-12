const EntitySchema = require('typeorm').EntitySchema
const logsb = require('../model/LogsbMst').LogsbMst
module.exports = new EntitySchema({
  name: 'logsb',
  target: logsb,
  columns: {
    logbid: {
      primary: true,
      type: 'integer',
      gernated: true
    },
    timestamp: {
      type: 'timestamp with time zone'
    },
    information: {
      type: 'text'
    },
    function: {
      type: 'character varying'
    },
    action: {
      type: 'character varying'
    },
    user: {
      type: 'character varying'
    },
    designation: {
      type: 'character varying'
    },
    changedfrom: {
      type: 'character varying'
    }
  }
})

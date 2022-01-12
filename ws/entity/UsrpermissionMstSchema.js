const EntitySchema = require('typeorm').EntitySchema
const usrpermisionMst = require('../model/usrpermissionMst').usrpermisionMst
module.exports = new EntitySchema({
  name: 'usrpermisionMst',
  target: usrpermisionMst,
  columns: {
    prpertyid: {
      primary: true,
      type: 'character varying',
      generated: false
    },
    branchid: {
      type: 'character varying'
    },
    userid: {
      type: 'character varying'
    },
    usrpermission: {
      type: 'character varying'
    },
    dev: {
      type: 'character varying'
    },
    beta: {
      type: 'character'
    },
    status: {
      type: 'character'
    }
  }
})

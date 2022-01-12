// userid, usrlogin, password, usrtype

const EntitySchema = require('typeorm').EntitySchema
const usr = require('../model/usrMst').usrMst
module.exports = new EntitySchema({
  name: 'usr',
  target: usr,
  columns: {
    userid: {
      primary: true,
      type: 'character varying',
      generated: false
    },
    userlogin: {
      type: 'character varying'
    },
    password: {
      type: 'character varying'
    },
    usrtype: {
      type: 'character varying'
    }
  }
})

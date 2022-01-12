const EntitySchema = require('typeorm').EntitySchema
const Username = require('../model/Username').Username

module.exports = new EntitySchema({
  name: 'Username',
  target: Username,
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true
    },
    firstname: {
      type: 'character varying'
    },
    lastname: {
      type: 'character varying'
    },
    age: {
      type: 'int'
    },
    status_record: {
      type: 'character varying'
    },
    status_marriaged: {
      type: 'character'
    },
    userid: {
      type: 'character varying'
    },
    password: {
      type: 'character varying'
    },
    property: {
      type: 'character varying'
    },
    branch: {
      type: 'character varying'
    }
  }
})

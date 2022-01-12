const EntitySchema = require('typeorm').EntitySchema
const MstMarriageStatus = require('../model/MstMarriageStatus').MstMarriageStatus

module.exports = new EntitySchema({
  name: 'MstMarriageStatus',
  target: MstMarriageStatus,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    code: {
      type: 'character'
    },
    description: {
      type: 'character varying'
    },
    status: {
      type: 'character varying'
    }
  }
})

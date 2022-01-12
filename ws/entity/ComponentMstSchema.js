const EntitySchema = require('typeorm').EntitySchema
const ComponentMst = require( '../model/ComponentMst' ).ComponentMst
module.exports = new EntitySchema({
  name: 'ComponentMst',
  target: ComponentMst,
  columns: {
    componentid: {
      primary: true,
      type: 'character',
      generated: false
    },
    name: {
      type: 'character varying'
    },
    position: {
      type: 'smallint'
    },
    seq: {
      type: 'smallint'
    },
    state: {
      type: 'character varying'
    }
  }
})

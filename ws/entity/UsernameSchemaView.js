const { ViewEntity, ViewColumn } = require('typeorm')
const tbName = 'username'
ViewEntity('userMobileView')

ViewEntity({
  expression: (cnn) =>
    cnn
      .createQueryBuilder()
      .select()
      .from(`${tbName}`)
} )

module.exports = UsernameSchemaView() {
  ViewColumn: {
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
    }

  }
}

/*
module.exports = new EntitySchema({
  name: 'Username',
  target: Username,
  columns: {
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
    passowrd: {
      type: 'character varying'
    },
    property: {
      type: 'char varying'
    },
    branch: {
      type: 'char varying'
    }
  }
})
*/

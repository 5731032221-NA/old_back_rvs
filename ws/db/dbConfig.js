const DataBase = {
  pmsDev: {
    mysql: {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'devtest',
      synchronize: true,
      encoding: 'tis620'
    },
    DEFAULT: {
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'rvspms'
    },
    mongodb: {
      type: 'c',
      host: '127.0.0.1',
      port: 27017,
      username: '',
      password: '',
      database: 'devtest',
      synchronize: true
    },
    sqlite: {
      type: 'sqlite3',
      database: 'devtest.sqlite',
      synchronize: true,
      storage: 'C:sqlitedbdevtest.sqlite'
    }
  }
}

module.exports = {
  getDBConf() {
    return DataBase.pmsDev.DEFAULT
  }
}

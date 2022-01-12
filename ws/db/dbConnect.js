require('reflect-metadata')
const { createConnection } = require('typeorm')
class DbConnect {
  constructor(obj, u = '', p = '') {
    this.type = obj.type
    this.host = obj.host
    this.port = obj.port
    this.database = obj.database
    this.username = u || obj.username
    this.password = p || obj.password
    this.n_conn = null
  }

  getCnn(arrEnt = []) {
    return createConnection({
      type: this.type,
      host: this.host,
      port: this.port,
      database: this.database,
      username: this.username,
      password: this.password,
      entities: [
        require("../entity/CfgMstSchema"),
        require("../entity/LogsSchema"),
        require("../entity/UsernameSchema"),
        require("../entity/UsrpermissionMstSchema"),
        require("../entity/RmMstChema"),
        require("../entity/RmInvSchema"),
        require("../entity/CampaignMst"),
        require("../entity/CampaignDtl"),
        require("../entity/CodeMst")
      ],
      autoSchemaSync: true
    })
  }

  close(cnn) {
    cnn.release()
    cnn.close()
  }
}
// entities: ['entity/*.js'],
module.exports = {
  DbConnect
}

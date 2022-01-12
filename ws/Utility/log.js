const fs = require('fs')
const getConnection = require('typeorm')
/*************************************/
const LGS = require('../model/LogsbMst').LogsMst
const dateFormat = require('dateformat')
const SV = require('../sys/service')
/*************************************/
const { timeZone } = require('../sys/service')
const tbName = 'logsb'
/* ------------------------------------------------- */
/* ============================== */
//  UserID, (Role) +module and/or Function
// const fileLog = `C://wamp64/www/projectRVSPMS/RVS-PMS/var/log/${ today }.log`
class Log {
  constructor() {
    const now = new Date()
    const today = dateFormat(now, 'isoDate')
    // this.info = `${today} ${nowTime}`
    this.info = `${new Date().getTime()}`
    this.fileLog = today
    this.text = ''
  }

  /*
  timpstamp, app/module (mailer) ,
  function (profile management),
  action/method (view/edit/delete),
  user,
  designation (workstation id/name, IP),
  Changed from (delete/edit) __________________________ข้อมูลที่ก่อนถูกเปลี่ยนแปลง______
 */
  setLog(userid, lgModule, lgFunction, lgAction, usrAgent, lgText, lgFile) {
    try {
      console.log('log 1', lgFile)
      this.fileLog = SV[lgFile].replace('$$LF', this.fileLog)
      const logStream = fs.createWriteStream(this.fileLog, { flags: 'a' })
      this.text = `${userid}|${lgModule}|${lgFunction}|${lgAction}|${lgText}|${usrAgent}`
      logStream.write(`\r\n${this.info}|${this.text}`)
      logStream.end('\r\n')
      console.log('Log ', this.fileLog)
    } catch (error) {
      console.log('writeLog: ', error)
    }
  }

  async setLogDB(
    userid,
    lgModule,
    lgFunction,
    lgAction,
    lgDesignnation,
    lgText
  ) {
    try {
      this.text = `${userid}|${lgModule}|${lgFunction}|${lgAction}|${lgDesignnation}|${lgText}`
      const cnnLogs = getConnection.createQueryBuilder()
      const items = await cnnLogs
        .insert()
        .into(`${tbName}`)
        .values({
          infomation: this.text
        })
        .updateEntity(false)
        .execute()
    } catch (e) {
      console.log('log db', e)
    }
  }

  async readLogDB(tbName) {
    try {
      const cnnLogs = getConnection.createQueryBuilder()
      const items = await cnnLogs
        .select()
        .from(`${tbName}`)
        .getRawMany()
      let logDatas = []
      items.forEach((ele) => {
        let obj = {
          dateTime: ele.timestamp,
          detail: ele.infomation
        }
        logDatas.push(obj)
      })
      return logDatas
    } catch (e) {
      console.log('log db', e)
      return `Can't Read`
    }
  }

  release(inct) {
    inct = null
  }
}

module.exports = {
  Log
}

const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const { getTime, addMinutes, getUnixTime, add } = require('date-fns')
const Log = require('./Log').Log
const SSN = require('./session').Session
const privateKey = fs.readFileSync(
  path.join(__dirname, '../config/private.key'),
  'utf8'
)
const privateReflesh = fs.readFileSync(
  path.join(__dirname, '../config/privateReflesh.key'),
  'utf8'
)
const { TOKENEXPIREIN, timeZone } = require('../config/service')
const tag = 'verifyy'
const expIn = 15 * 60 * 1000
class jwtService {
  constructor() {
    this.$Options = {
      issuer: 'RevoSoft',
      subject: 'super@rvs.co.th',
      audience: 'http://rvs.co.th',
      expiredIn: expIn,
      algorithm: 'HS256'
    }
  }

  sign(payload) {
    const objTkn = {
      accessToken: `Bearer ${jwt.sign(payload, privateKey)}`,
      refreshToken: jwt.sign(payload, privateReflesh)
    }
    return objTkn
  }

  refreshToken(payload) {
    return jwt.sign(payload, privateReflesh)
  }

  verify(token, comp) {
    try {
      let now = new Date().toLocaleDateString('en-Us', {
        timeZone
      })
      console.log('now', now)
      let veri = jwt.verify(token, privateKey)
      console.log('veri', veri)
      let perious = 15 * 60 *1000
      console.log(veri.expIn >= perious)
      let SS = new SSN()
      if (SS.isLimited()) {
        SS.update('10.200.12.49', 15 * 60 * 1000)
      } else {
        console.log('no limited')
        SS.add('10.200.12.49', getUnixTime(new Date(2020, 10, 19, 13, 30, 0)))
      }
      SS.print()
      return veri
      /*
      let now = new Date().toLocaleDateString('en-Us', {
        timeZone
      } )
      */
      /*
      const today = new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')
      console.log('aa ', today)
      let arr = today.split(' ')
      let arrDate = arr[0].split('-')
      let arrTime = arr[1].split(':')
      const lastTimestamp = 1601886972000
      const now = getTime(
        new Date(
          parseInt(arrDate[2]),
          parseInt(arrDate[1]),
          parseInt(arrDate[0]),
          parseInt(arrTime[0]),
          parseInt(arrTime[1]),
          parseInt(arrTime[2])
        )
      )

      console.log('now', now)
      console.log('arr Date', arrDate)
      console.log('arrTime ', arrTime)
      console.log('lastTime ', lastTimestamp)

      if (now - lastTimestamp <= SS.durationMinutes) {
        console.log('session ', now)
        if (veri.exp === null || veri.exp < now) {
          console.log('token ', veri.exp)
          if (!isSessionLimited()) {
            // gen new id and push lastTimestame and update token
            resetTime()
            // resigh
            const data = {
              user: veri.sub.user,
              property: veri.sub.property,
              branch: veri.sub.branch
            }
            let tn = new Date()
            const payload = {
              sub: data,
              iat: tn.getTime(),
              expiredIn: addMinutes(tn, 30).getTime()/1000,
              id: tokenID()
            }
            this.sign(payload)
          }
        }
        return veri
      } else {
        // releaseMem(veri.id)
        return { status: '3000', msg: 'Session Denied' }
      }
      */
      /*
        if session[id] - duration > 0 && limit <= count(session)
         if tokenexpire < now()
           update token and refresh token
        else
          session expired
      */
      /*
        currentTime - lasttimestamp <= sessionTimesout
      */
      /*
      if ( veri ) {
        console.log('veri ', veri)
        // update token time
        const data = {
          user: veri.sub.user
        }
        const payload = {
          sub: data,
          iat: new Date().getTime(),
          expiresIn: TOKENEXPIREIN,
          userID: tokenID(),
          algorithm: 'HS256'
        }
        veri = jwt.sign(payload, privateKey)
      }
      */
    } catch (err) {
      // invalid token
      console.log('module ', comp)
      console.log('verify err ', err)
      let lg = new Log()
      lg.setLog(tag, comp, err)
      return false
    }
  }

  encode(payload, secret) {
    return jwt.encode(payload, secret)
  }

  decode(token) {
    return jwt.decode(token, { complete: true })
  }
}

module.exports = {
  jwtService
}

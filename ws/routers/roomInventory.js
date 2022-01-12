const express = require('express')
const rtrRmInv = express.Router()
const getConnection = require('typeorm')
// const differenceInCalendarDays = require( 'date-fns/differenceInCalendarDays' )
// const isLeapYear = require('date-fns/isLeapYear')
const { format } = require('date-fns')
const Log = require('../Utility/log').Log
const pid = process.pid
const tbName = 'rminv'
const tag = '/room-inv'
const resp = {
  status: '0000',
  msg: 'Access Denied!',
  content: []
}
rtrRmInv.get('/', async (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})

rtrRmInv.get('/room-inv', async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .orderBy('monthyear', 'ASC')
      .getRawMany()
    const a = []
    items.forEach((ele) => {
      delete ele.rminvid
      const arrT = []
      const arrKey = Object.keys(ele)
      arrKey.forEach((e) => {
        if (parseInt(e)) {
          const key = `${ele.monthyear.trim()}-${e}`
          const o = {}
          o[key] = []
          o[key] = ele[e]
          arrT[ele.rmtype] = o
          a.push(Object.assign({}, arrT))
        }
      })
    })
    // beginOfTheWeek(), EndOfTheWeek()
    // height date select
    console.log(`Row Result: ${a.length}`)
    // rmno => 0, 1 : room status : rsvn
    resp.status = '2000'
    resp.msg = `Success!`
    resp.content = a
    res.send(resp)
  } catch (error) {
    const data = `${tag} |${error}`
    // method, error number
    // error message ที่มี error number
    console.log(error)
    const lg = new Log()
    lg.setLog(data)
    res.send(resp)
  }
})

rtrRmInv.post('/room-inv', async (req, res, next) => {
  try {
    let { rType, arrivalDate, departureDate, night } = req.query
    const period = []
    const roomRsvn = 1
    let beginOfTheWeek = ''
    let endOfTheWeek = ''
    rType = rType.trim()
    arrivalDate = arrivalDate.trim()
    departureDate = departureDate.trim()
    night = parseInt(night.trim())
    rType = rType.trim()
    let date1 = arrivalDate
    let date2 = departureDate
    date1 = date1.split('-')
    date2 = date2.split('-')
    const m1 = date1[0] + '-' + date1[1]
    const m2 = date2[0] + '-' + date2[1]
    let items = []
    // get 5 before arrival and 2 month
    // if jan get 2 month after
    const connection = getConnection.createQueryBuilder()
    if (rType) {
      items = await connection
        .select('r.*')
        .from(`${tbName}`, 'r')
        .where(`rmtype like '${rType}'`)
        .andWhere( `monthyear BETWEEN '${ m1 }' AND '${ m2 }'` )
        .orderBy('monthyear', 'ASC')
        .getRawMany()
      const arrRoom = []
      items.forEach((ele) => {
        delete ele.rminvid
        const arrT = []
        const arrKey = Object.keys(ele)
        arrKey.forEach((e) => {
          if (parseInt(e)) {
            const key = ele.monthyear.trim() + '-' + e.padStart(2, '0')
            const o = {}
            o[key] = []
            o[key] = ele[e]
            arrT[ele.rmtype] = o
            arrRoom.push(Object.assign({}, arrT))
          }
        })
      })

      let bStay = []
      bStay = arrRoom.filter((n) => {
        const key = Object.keys(n[rType])[0]
        const num = n[rType][key]

        if (
          num !== null &&
          new Date(key) >= new Date(arrivalDate) &&
          new Date(key) < new Date(departureDate)
        ) {
          period.push(key)
          return roomRsvn <= num
        } else {
          return 0
        }
      })
      const searchResult = bStay.length === parseInt(night)
      console.log(
        ` filter ${bStay.length} night ${night} : ${bStay.length ===
          parseInt(night)}`
      )
      console.log(bStay)
      beginOfTheWeek = '2020-02-25'
      endOfTheWeek = '2020-03-05'
      // rmno => 0, 1 : room status : rsvn
      resp.status = '2000'
      resp.msg = `Success!`
      resp.content = [
        { beginOfTheWeek: beginOfTheWeek },
        { endOfTheWeek: endOfTheWeek },
        { searResult: searchResult },
        { filter: bStay },
        { rooms: arrRoom }
      ]
    }
    res.send(resp)
  } catch (error) {
    const data = `${tag} |${error}`
    // method, error number
    // error message ที่มี error number
    console.log(error)
    const lg = new Log()
    lg.setLog(data)
    res.send(resp)
  }
})

rtrRmInv.get('/room-build/:id', async (req, res, next) => {
  const { id } = req.params

  let numRoom = Math.floor(Math.random() * Math.floor(10))
  let day = Math.floor(Math.random() * Math.floor(28))
  if (day === 0) day = 1
  if (numRoom === 0) numRoom = 1
  const obj = {}
  obj[day] = numRoom
  console.log(obj)
  const qrb = getConnection.createQueryBuilder()
  const items = await qrb
    .update(`rminv`)
    .set(obj)
    .where(`${day} = '${day}'`)
    .andWhere(`rmtype = '${id.trim().toUpperCase()}'`)
    .returning('*')
    .updateEntity(true)
    .execute()

  const resp = {
    status: '2000',
    msg: 'Success',
    content: items
  }
  res.send(resp)
})

rtrRmInv.get('/room-inv/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .where(`rmType='${id}'`)
      .getRawMany()

    const a = []
    items.forEach((ele) => {
      delete ele.rminvid
      const arrT = []
      const arrKey = Object.keys(ele)
      arrKey.forEach((e) => {
        if (parseInt(e)) {
          const key = ele.monthyear.trim() + '-' + e
          const o = {}
          o[key] = []
          o[key] = ele[e]
          arrT[ele.rmtype] = o
          a.push(Object.assign({}, arrT))
        }
      })
    })
    // rmno => 0, 1 : room status
    resp.status = '2000'
    resp.msg = `Success!`
    resp.content = a
    res.send(resp)
  } catch (error) {
    const data = `${tag} |${error}`
    // method, error number
    // error message ที่มี error number
    console.log(error)
    const lg = new Log()
    lg.setLog(data)
    res.send(resp)
  }
})

module.exports = rtrRmInv

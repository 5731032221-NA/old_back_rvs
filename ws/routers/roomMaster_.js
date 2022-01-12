const express = require('express')
const rtrCfgMst = express.Router()
const getConnection = require('typeorm')
// const ConfigMaster = require('../model/cfgmst').cfgmst
const Log = require('../Utility/log').Log
const pid = process.pid
const tbName = 'rmmst'
const tag = '/room-masters'
rtrCfgMst.get('/', async (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})
rtrCfgMst.get('/room-masters', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: []
  }

  try {
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .getRawMany()

    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = items
    console.log('roommaster', items)
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(`${tag}|${error}`)
    console.log(error)
    res.send(resp)
  }
})

rtrCfgMst.post('/room-masters', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: []
  }

  try {
    const {
      rmproperty,
      rmno,
      rmtypeid,
      wingid,
      floorid,
      buildingid,
      exposureid,
      rmdesc,
      rmsqsize,
      rmseq,
      rmstatus,
      rmattribute
    } = req.body

    // check duplicate
    const qrb = getConnection.createQueryBuilder()
    const dup = await qrb
      .select()
      .from(`${tbName}`)
      .where(`TRIM(rmproperty) = '${rmproperty}'`)
      .andWhere(`TRIM(rmno) = '${rmno}'`)
      .getRawMany()

    if (dup.length === 0) {
      let arrAttr = []
      rmattribute.forEach((ele) => {
        arrAttr.push(ele.key)
      })
      arrAttr = arrAttr.join(',')
      const obj = {
        rmproperty,
        rmno,
        rmtypeid,
        floorid,
        wingid,
        buildingid,
        exposureid,
        rmdesc,
        rmsqsize,
        rmseq,
        rmstatus,
        rmattribute: arrAttr
      }
      const items = await qrb
        .insert()
        .into(`${tbName}`)
        .values(obj)
        .returning([
          'rmproperty',
          'rmno',
          'rmtypeid',
          'floorid',
          'rmdesc',
          'rmdesc',
          'rmsqsize',
          'rmseq',
          'rmstatus',
          'rmattribute'
        ])
        .updateEntity(false)
        .execute()
      resp.status = '2000'
      resp.msg = 'Save Success!'
      resp.content.push(items)
    } else {
      resp.status = '1000'
      resp.msg = `${rmproperty} - ${rmno} :  Already exists.`
    }
    res.send(resp)
  } catch (error) {
    console.log(error)
    const data = `${tag}|${error}`
    const lg = new Log()
    lg.setLog(data)
    resp.msg = error
    res.send(resp)
  }
})

module.exports = rtrCfgMst

const express = require('express')
const rtr = express.Router()
const getConnection = require('typeorm')
const Log = require('../Utility/log').Log
const { usrPerm } = require('../queryparser/user')
const { userAuth } = require('../Utility/verify')
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE,
  CMP
} = require('../sys/service')
const pid = process.pid
const tbName = 'rmmst'
const tag = '/room-inv'
const _COMPONENTID = 'RM-RAC-00792254'
const resp = {
  status: '0000',
  msg: 'Access Denied!',
  content: [],
  items: []
}
// eslint-disable-next-line require-await
rtr.get('/', async (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})

rtr.get('/room-rack/:building/:floor', async (req, res, next) => {
  try {
    const tkn = req.headers.authorization
    let usrVerify = userAuth(tkn, _COMPONENTID)
    if (!usrVerify) {
      resp.status = '2002'
      resp.msg = 'Invalid Token.'
      res.send(resp)
    }
    const userid = usrVerify.sub.user
    const uhp = await usrPerm(
      _COMPONENTID,
      _READ,
      userid,
      usrVerify.sub.property,
      usrVerify.sub.branch,
      _SEPARATE
    )
    const propertyid = usrVerify.sub.property
    const id = usrVerify.sub.user
    const bnc = usrVerify.sub.branch
    if (uhp) {
      let { building, floor } = req.params
      if (building.toUpperCase() === 'ALL') {
        building = 'buildingid'
      } else {
        building = `'${building}'`
      }
      if (floor.toUpperCase() === 'ALL') {
        floor = 'floorid'
      } else {
        floor = `'${floor}'`
      }
      const connection = getConnection.createQueryBuilder()
      const roomrack = await connection
        .select('buildingid, floorid, rmno, rmstatus, rmdesc')
        .from(`${tbName}`)
        .where(`TRIM(buildingid) = ${building}`)
        .andWhere(`TRIM(floorid) = ${floor}`)
        .orderBy('rmmst.buildingid')
        .addOrderBy('rmmst.floorid')
        .addOrderBy('rmmst.rmno')
        .getRawMany()
      resp.content = roomrack
      resp.status = '2000'
      resp.msg = 'Success!'
      res.send(resp)
    } else {
      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .select('userid, usrpermission')
        .from(`usrpermissionmst`)
        .where(`propertyid = '${propertyid}'`)
        .andWhere(`branchid = '${bnc}'`)
        .andWhere(`userid = '${id}'`)
        .getRawOne()
      if (items) {
        const usrPermissions = items.usrpermission.split(_SEPARATE)
        const arrPosition = []
        for (let i = 0; i < usrPermissions.length; i++) {
          if (usrPermissions[i] !== '') {
            arrPosition.push(i + 1)
          }
        }
        if (arrPosition.length > 0) {
          const where$ = arrPosition.join(',')
          const connComponent = getConnection.createQueryBuilder()
          const components = await connComponent
            .select()
            .from('componentmst')
            .where(`position IN (${where$})`)
            .andWhere(`state = 'dev'`)
            .getRawMany()
          const permissions = []
          components.forEach((ele) => {
            const obj = {
              permission: usrPermissions[parseInt(ele.position) - 1],
              icon: ele.icon,
              slug: ele.slug
            }
            permissions.push(obj)
          })
          const data = []
          const obj = {
            components: permissions
          }
          data.push(obj)
          resp.content = data
          resp.status = '2001'
          resp.msg = 'Permission Denied!.'
        } else {
          resp.status = '2003'
          resp.msg = 'Permission Notset.'
        }
      } else {
        resp.status = '2003'
        resp.msg = 'Permission Denied.'
      }
      res.send(resp)
    }
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

module.exports = rtr

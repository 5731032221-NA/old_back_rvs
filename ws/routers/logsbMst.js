"use strict"
/*
*System
*/
const {
  router,
  getConnection,
  SVC,
  getMsg,
  usrPerm,
  componentsUsr,
  components,
  userAuth
} = require('../config/sysHeader')
/*
Biz
*/
// Optional
const CFGLOG = require('../modules/config/logs').LogMst
const Log = require('../Utility/log').Log
// Global Constance
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE
} = require('../sys/service')
/*
* Declaration
*/
const typeModule = 'Config'
const typeFunctions = 'logsb'
const _COMPONENTID = 'LG-MST-00892254'
const tbName = components.logsmaster._TABLES.default
/* ------------------------------------------------- */
// Global Variable
/* ============================== */
// eslint-disable-next-line require-await
console.log('date', new Date().getTime())
router.get('/', async (req, res, next) => {
  res.send({
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  })
})
router.get('/logs', async (req, res, next) => {
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  }

  try {
    /*
    const tkn = req.headers.authorization
    const usrVerify = userAuth(tkn)
    */
    let usrVerify = true
    if (!usrVerify) {
      resp.status = '2002'
      resp.msg = 'Invalid Token'
      res.send(resp)
    }
    /*
    const propertyid = usrVerify.sub.property
    const id = usrVerify.sub.user
    const bnc = usrVerify.sub.branch
    let uhp = await usrPerm(_COMPONENTID, _READ, id, propertyid, bnc, _SEPARATE)
    */
    let uhp = true
    if (uhp) {
      /* Start Biz */
      let lg = new CFGLOG()
      resp = await lg.views('*')
      /* End Biz */

    } else {
      resp.content = await componentsUsr(usrVerify.sub.property, usrVerify.sub.branch, usrVerify.sub.user);
      resp.status = SVC.PERMISSION.code
      resp.msg = SVC.PERMISSION.msg
    }
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(typeModule, typeFunctions, error)
    console.log(error)
    res.send(resp)
  }
})

router.post('/logs', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: [],
    items: []
  }
  console.log('req ', req)
  try {
    /*
       userid,
       lgModule,
       lgFunction,
       lgAction,
       lgDesignnation,
       lgText
     */
    const { timestamp, information } = req.body
    const tkn = req.headers.authorization
    const usrVerify = userAuth(tkn)
    if (usrVerify) {
      const userid = usrVerify.sub.user
      const uhp = await usrPerm(
        _COMPONENTID,
        _CREATE,
        userid,
        usrVerify.sub.property,
        usrVerify.sub.branch,
        _SEPARATE
      )
      if (uhp) {
        const connection = getConnection.createQueryBuilder()
        const obj = {
          timestamp,
          information
        }
        const items = await connection
          .insert()
          .into(`${tbName}`)
          .values(obj)
          .returning(['timestamp', 'information'])
          .updateEntity(false)
          .execute()
        resp.status = '2000'
        resp.msg = 'Save Success!'
        resp.content.push(items)
      } else {
        // return new menu
        resp.content = []
        resp.items = []
        resp.status = '2001'
        resp.msg = 'Permission Denied.'
      }
    } else {
      resp.status = '2002'
    }
    res.send(resp)
  } catch (error) {
    /* test
    console.log(error)
    const data = `${tag}|${error}`
    const lg = new Log()
    lg.setLog( data )
    */
    console.log('log ', error)
    resp.msg = 'error'
    res.send(resp)
  }
})

router.delete('/user-management', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: [],
    items: []
  }
  try {
    const { timestamp } = req.body
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
      _DELETE,
      userid,
      usrVerify.sub.property,
      usrVerify.sub.branch,
      _SEPARATE
    )
    if (uhp !== 'N') {
      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .delete()
        .from(`${tbName}`)
        .where('timestamp = :timestamp', { timestamp })
        .execute()
      resp.content.push(items)
      resp.status = '2000'
      resp.msg = 'Success'
      res.send(resp)
    } else {
      resp.content = []
      resp.status = '2001'
      resp.msg = 'Permission Denied'
      res.send(resp)
    }
  } catch (error) {
    console.log(error)
    resp.msg = 'Failer'
    res.send(resp)
  }
})

router.put('/logs', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: [],
    items: []
  }
  try {
    const { timestamp, information } = req.body
    /*
    const tkn = req.headers.authorization
    const usrVerify = userAuth(tkn)
    */
    let usrVerify = true
    if (usrVerify) {
      /*
      const uhp = await usrPerm(
        _COMPONENTID,
        _UPDATE,
        usrVerify.sub.user,
        usrVerify.sub.property,
        usrVerify.sub.branch,
        _SEPARATE
      )
      */
      let uhp = true
      if (uhp) {
        const obj = {
          information
        }
        const connection = getConnection.createQueryBuilder()
        const items = await connection
          .update(`${tbName}`)
          .set(obj)
          .where(`timestamp = '${timestamp.trim()}'`)
          .returning(['timestamp', 'iformation'])
          .updateEntity(true)
          .execute()

        resp.status = '2000'
        resp.msg = `Create ${rmno} : Success!`
        resp.content = items
      } else {
        resp.status = '2001'
        resp.msg = 'Permission Denied.'
      }
    } else {
      resp.status = '2002'
    }
    res.send(resp)
  } catch (e) {
    // method, error number
    // error message ที่มี error number
    console.log(e)
    const lg = new Log()
    lg.setLog(typeModule, typeFunctions, e)
    res.send(resp)
  }
})

module.exports = router

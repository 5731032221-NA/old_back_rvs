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
const CFGCMDT = require('../modules/config/campaignDtl').CampaignDtl
const Log = require('../Utility/log').Log
// Global Constance
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE
} = require('../config/service')
/*
* Declaration
*/
const pid = process.pid
const tbName = components.campaign.detail._TABLES.default
const typeModule = 'campaignDetail'
const typeFunctions = '/campaign-detail'
const enpoint = '/campaign-detail'
const logFile = 'logfpath'
const _COMPONENTID = 'CF-CMPG-00592299'

router.get('/', async (req, res, next) => {
  res.send({
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  })
})


router.get(`${enpoint}/:hid/:dtlid/:extra`, async (req, res, next) => {
  /* Start pattern */
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  }
  try {
    /*        
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    */
    let usrVerify = true
    if (!usrVerify) {
      resp.status = SVC.INVALIDTOKEN.code;
      resp.msg = SVC.INVALIDTOKEN.msg;
    } else {
      /*
      const propertyid = usrVerify.sub.property;
      const id = usrVerify.sub.user;
      const bnc = usrVerify.sub.branch;
      let uhp = await usrPerm(_COMPONENTID, _READ, id, propertyid, bnc, _SEPARATE);
      */
      let uhp = true
      if (uhp) {
        /* Start Biz */
        let cfg = new CFGCMDT()
        resp = await cfg.views(req.params)
        /* End Biz */
      } else {
        resp.content = await componentsUsr(usrVerify.sub.property, usrVerify.sub.branch, usrVerify.sub.user);
        resp.status = SVC.PERMISSION.code
        resp.msg = SVC.PERMISSION.msg
      }
    }
    res.send(resp)
  } catch (error) {
    // data = 'DATABASE'+error
    // method, error number
    // error message ที่มี error number
    // lg = new Log()
    // lg.setLog(data)
    console.log(error)
    const lg = new Log()
    lg.setLog(tbName, typeModule, typeFunctions, _READ, req.get('user-agent'), error, logFile)
    res.send(resp)
  }
  /* End pattern */
})

router.post(`${enpoint}`, async (req, res, next) => {
  /* Start pattern */
  // const params = req.query
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  }
  try {
    /*
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    */
    const usrVerify = true
    if (!usrVerify) {
      resp.status = SVC.INVALIDTOKEN.code;
      resp.msg = SVC.INVALIDTOKEN.msg;
    } else {

      /*
      const propertyid = usrVerify.sub.property;
      const id = usrVerify.sub.user;
      const bnc = usrVerify.sub.branch;
      let uhp = await usrPerm(_COMPONENTID, _CREATE, id, propertyid, bnc, _SEPARATE);
      */
      let uhp = true
      if (uhp) {
        /* Start Biz */
        let cfg = new CFGCMDT()
        // resp = await cfg.add(req.body)
        resp = await cfg.add(req.body)
        /* End Biz */
      } else {
        resp.content = await componentsUsr(usrVerify.sub.property, usrVerify.sub.branch, usrVerify.sub.user);
        resp.status = SVC.PERMISSION.code
        resp.msg = SVC.PERMISSION.msg
      }
    }
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(tbName, typeModule, typeFunctions, _CREATE, req.get('user-agent'), error, logFile)
    res.send(resp)
  }
  /* End pattern */
})

router.put(`${enpoint}`, async (req, res, next) => {
  /* Start pattern */
  // const params = req.query  
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  }
  try {
    /*
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    */
    const usrVerify = true
    if (!usrVerify) {
      resp.status = SVC.INVALIDTOKEN.code;
      resp.msg = SVC.INVALIDTOKEN.msg;
    } else {

      /*
      const propertyid = usrVerify.sub.property;
      const id = usrVerify.sub.user;
      const bnc = usrVerify.sub.branch;
      let uhp = await usrPerm(_COMPONENTID, _CREATE, id, propertyid, bnc, _SEPARATE);
      */
      let uhp = true
      if (uhp) {
        /* Start Biz */
        let cfg = new CFGCMDT()
        // resp = await cfg.add(req.body)        
        resp = await cfg.update(req.body)
        /* End Biz */
      } else {
        resp.content = await componentsUsr(usrVerify.sub.property, usrVerify.sub.branch, usrVerify.sub.user);
        resp.status = SVC.PERMISSION.code
        resp.msg = SVC.PERMISSION.msg
      }
    }
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(tbName, typeModule, typeFunctions, _CREATE, req.get('user-agent'), error, logFile)
    res.send(resp)
  }
  /* End pattern */
})

router.delete(`${enpoint}/:id`, async (req, res, next) => {
  /* Start pattern */
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  }
  try {
    /*
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    */
    let usrVerify = true
    if (!usrVerify) {
      resp.status = SVC.INVALIDTOKEN.code;
      resp.msg = SVC.INVALIDTOKEN.msg;
    } else {
      /*
      const propertyid = usrVerify.sub.property;
      const id = usrVerify.sub.user;
      const bnc = usrVerify.sub.branch;
      let uhp = await usrPerm(_COMPONENTID, _READ, id, propertyid, bnc, _SEPARATE);
      */
      let uhp = true
      if (uhp) {
        /* Start Biz */
        const cfg = new CFGCMDT()
        resp = await cfg.remove(req.params)
        console.log('res', resp)
        /* End Biz */
      } else {
        resp.content = await componentsUsr(usrVerify.sub.property, usrVerify.sub.branch, usrVerify.sub.user);
        resp.status = SVC.PERMISSION.code
        resp.msg = SVC.PERMISSION.msg
      }
    }
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(tbName, typeModule, typeFunctions, _DELETE, req.get('user-agent'), error, logFile)
    res.send(resp)
  }
  /* End pattern */
})

module.exports = router

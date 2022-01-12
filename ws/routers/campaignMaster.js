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
  userAuth
} = require('../config/sysHeader')
/*
Biz
*/
// Optional
const CFGCMPG = require('../modules/config/campaignMst').CampaignMst
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
const tbName = 'cmpgfst'
const typeModule = 'campaignHeader'
const typeFunctions = '/campaign-header'
const enpoint = '/campaign-header'
const logFile = 'logfpath'
const _COMPONENTID = 'CF-CMPG-00592299'
console.log(process.argv[2])

router.get('/', async (req, res, next) => {
  res.send({
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  })
})

router.get(`${enpoint}/:brand/:id/:page/:offset`, async (req, res, next) => {
  /* Start pattern */

  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  }


  try {
    /*
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .where(`TRIM(parent) = '${id.trim().toUpperCase()}'`)
      .addOrderBy('recordseq', 'ASC')
      .getRawMany()

    const arrRmType = []
    if (items.length > 0) {
      items.forEach((e) => {
        const l = e.description.trim().split('-')
        const obj = {
          _id: e.listname,
          parent: e.parent.trim(),
          name: [
            {
              desc: l[0],
              lang: l[1]
            }
          ]
        }
        arrRmType.push(obj)
      })
    }

    const opt = {
      idKey: '_id',
      parentKey: 'parent',
      childrenKey: '_children'
    }
    const arr = listToTree(items, opt)
    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = arrRmType
    res.send(resp)
    */
    /*
           subList.forEach((ele) => {
              console.log('m::', ele.listname)
              const oo = ele.description.split('-')
              subTree.push({
                _id: ele.listname.trim(),
                parent: ele.parent.trim(),
                name: [
                  {
                    lang: oo[1],
                    desc: oo[0],
                    status: ele.recordStatus
                  }
                ]
              })
            })

       */
    /*        
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    */
    let usrVerify
    usrVerify = true
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
        let cfg = new CFGCMPG()
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
    const lg = new Log()
    lg.setLog(tbName, typeModule, typeFunctions, _READ, req.get('user-agent'), error, logFile)
    res.send(resp)
  }
  /* End pattern */
})

router.get(`${enpoint}/:brand/:id/:page/:offset`, async (req, res, next) => {
  /* Start pattern */
  const brand = req.params.brand || 'FSDH'
  const id = req.params.id
  const page = req.params.page - 1 > 0 ? req.params.page : 0
  const limit = req.params.offset || 100
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg
  }
  try {
    /*
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .where(`TRIM(parent) = '${id.trim().toUpperCase()}'`)
      .addOrderBy('recordseq', 'ASC')
      .getRawMany()

    const arrRmType = []
    if (items.length > 0) {
      items.forEach((e) => {
        const l = e.description.trim().split('-')
        const obj = {
          _id: e.listname,
          parent: e.parent.trim(),
          name: [
            {
              desc: l[0],
              lang: l[1]
            }
          ]
        }
        arrRmType.push(obj)
      })
    }

    const opt = {
      idKey: '_id',
      parentKey: 'parent',
      childrenKey: '_children'
    }
    const arr = listToTree(items, opt)
    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = arrRmType
    res.send(resp)
    */
    /*
           subList.forEach((ele) => {
              console.log('m::', ele.listname)
              const oo = ele.description.split('-')
              subTree.push({
                _id: ele.listname.trim(),
                parent: ele.parent.trim(),
                name: [
                  {
                    lang: oo[1],
                    desc: oo[0],
                    status: ele.recordStatus
                  }
                ]
              })
            })

       */
    /*        
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    */
    let usrVerify
    usrVerify = true
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
        let cfg = new CFGCMPG()
        resp = await cfg.views(brand, id, page, limit)
        /* End Biz */
      } else {
        resp.content = await componentsUsr(usrVerify.sub.property, usrVerify.sub.branch, usrVerify.sub.user);
        resp.status = SVC.PERMISSION.code
        resp.msg = SVC.PERMISSION.msg
      }
    }
    res.send(resp)
  } catch (error) {
    console.log('err', error)
    // data = 'DATABASE'+error
    // method, error number
    // error message ที่มี error number
    // lg = new Log()
    // lg.setLog(data)
    const lg = new Log()
    lg.setLog(tbName, typeModule, typeFunctions, _READ, req.get('user-agent'), error, logFile)
    res.send(resp)
  }
  /* End pattern */
})

router.post(`${enpoint}`, async (req, res, next) => {
  /* Start pattern */
  // const { params } = req.body
  // const params = req.query
  const params = req.body
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
      let uhp = await usrPerm(_COMPONENTID, state, id, propertyid, bnc, _SEPARATE);
      */
      let uhp = true
      if (uhp) {
        /* Start Biz */
        let cfg = new CFGCMPG()
        resp = await cfg.add(params, _CREATE)
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

// router.delete(`${enpoint}/:brand/:id`, async (req, res, next) => {
router.delete(`${enpoint}/:brand/:id`, async (req, res, next) => {
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
        const cfg = new CFGCMPG()
        resp = await cfg.remove(req.params)
        /* End Biz */
      } else {
        resp.content = await componentsUsr(usrVerify.sub.property, usrVerify.sub.branch, usrVerify.sub.user);
        resp.status = SVC.PERMISSION.code
        resp.msg = SVC.PERMISSION.msg
      }
    }
    res.send(resp)
  } catch (error) {
    /*
    const lg = new Log()
    lg.setLog(tbName, typeModule, typeFunctions, _DELETE, req.get('user-agent'), error, logFile)
    */
    console.log(error)
    res.send(resp)
  }
  /* End pattern */
})


router.put(`${enpoint}`, async (req, res, next) => {
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
        let cfg = new CFGCMPG()
        resp = await cfg.update(req.body)
        // resp = await cfg.add(req.body, _UPDATE, id)
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
    lg.setLog(tbName, typeModule, typeFunctions, _UPDATE, req.get('user-agent'), error, logFile)
    res.send(resp)
  }
  /* End patterns */
})

module.exports = router

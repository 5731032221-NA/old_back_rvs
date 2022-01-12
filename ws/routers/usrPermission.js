const express = require('express')
const rtr = express.Router()
/*************************************/
const getConnection = require('typeorm')
const Log = require('../Utility/log').Log
/*************************************/
const {
  permissiosRoles,
  decodePerm,
  encodePerm,
  permissiosRole
} = require('../Utility/user')
const { makeComponentTree, CompTree } = require('../Utility/tools')
const { usrPerm, componentsUsr } = require('../queryparser/user')
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
const tbName = 'usrpermissionmst'
const _COMPONENTID = 'CM-MST-00892254'
const typeModule = 'Config'
const typeFunctions = 'user-permissions'
const tagType = 'frontLogs'
const logFile = 'logbpath'
/* ------------------------------------------------- */
// let resp = {
//   status: '0000',
//   msg: 'Access Denied!',
//   content: [],
//   items: []
// }
/* ============================== */
// eslint-disable-next-line require-await
rtr.get('/', async (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})

rtr.get('/user-permissions', async (req, res, next) => {
  let resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: [],
    items: []
  }
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
    const whereDev = "dev = 'Y'"
    const whereBeta = "beta = 'N'"
    const status = "status = 'A'"
    const cnnPermission = getConnection.createQueryBuilder()
    const itemsUsers = await cnnPermission
      .select('userid, propertyid, branchid,usrpermission')
      .from(`${tbName}`)
      .where(`${status}`)
      .andWhere(`${whereDev}`)
      .andWhere(`${whereBeta}`)
      .orderBy(`userid`, 'ASC')
      .getRawMany()

    if (itemsUsers) {
      const connRole = getConnection.createQueryBuilder()
      const components = await connRole
        .select('componentid, parent, name, position')
        .from('componentmst')
        .orderBy('seq', 'ASC')
        .addOrderBy('position', 'ASC')
        .getRawMany()
      const roles = CompTree(components, new Array(4).fill('N'))
      resp.content = roles
    }
    resp.content.push({
      users: itemsUsers
    })
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
})

rtr.get('/user-permissions/:id', async (req, res, next) => {
  let resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: [],
    items: []
  }
  try {
    // 'a'.charCodeAt(0)//returns 97, where '0' is the index of the string 'a'
    // var myVarAscii = myVar.charCodeAt(0); //convert 'A' character to it's ASCII code (65)
    // const _ASCII = 64
    // ,CRUD,,,R,CRUD
    /*
    let pp = '-F-D-F'
    const ps = pp.split('')
    for (let index = 0; index < ps.length; index++) {
      const ele = ps[index]
      if (ele !== '-') {
        const dec = ele.charCodeAt(0) - _ASCII
        const toBin = (dec >>> 0).toString(2)
        console.log(toBin)
      }
    }
    */
    const { id } = req.params
    // const { propertyid, bnc } = req.query
    const propertyid = 'FSDH'
    const bnc = 'HQ'
    // const params = req.query
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select('userid, usrpermission, propertyid, branchid')
      .from(`${tbName}`)
      .where(`userid = '${id}'`)
      .andWhere(`propertyid = '${propertyid}'`)
      .andWhere(`branchid = '${bnc}'`)
      .getRawMany()
    let arrElem = []
    for (let i = 0; i < items.length; i++) {
      const elem = items[i]
      const usrPermissions = elem.usrpermission.split(_SEPARATE)
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
          .select('componentid, parent, name, position')
          .from('componentmst')
          .where(`position IN (${where$})`)
          .orderBy('seq', 'ASC')
          .getRawMany()

        let permissions = []
        components.forEach((ele) => {
          let p = encodePerm(usrPermissions[parseInt(ele.position) - 1])
          const obj = {
            name: ele.name,
            permission: p
          }
          permissions.push(obj)
        })
        arrElem.push({
          userid: id,
          propertyid: elem.propertyid,
          branch: bnc,
          items: permissions
        })
      } else {
        arrElem.push({
          userid: id,
          propertyid,
          branch: bnc,
          items: []
        })
      }
    }
    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = arrElem
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(typeModule, typeFunctions, error)
    console.log(`error ${typeModule} ${typeFunctions}`, error)
    res.send(resp)
  }
})

rtr.put('/user-permissions/:id', async (req, res, next) => {
  let resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: [],
    items: []
  }
  try {
    const id = req.params.id
    const params = req.body
    if (params[0].items.length > 0) {
      const propertyid = 'FSDH'
      const bnc = params[0].branch ? params[0].branch : 'HQ'
      const tkn = req.headers.authorization
      let usrVerify = userAuth(tkn)
      if (usrVerify) {
        const userid = usrVerify.sub.user
        let uhp = await usrPerm(
          _COMPONENTID,
          _UPDATE,
          userid,
          usrVerify.sub.property,
          usrVerify.sub.branch,
          _SEPARATE
        )
        if (uhp) {
          let logTextBefor = ''
          const connection = getConnection.createQueryBuilder()
          const itemsUser = await connection
            .select('userid, usrpermission,propertyid, branchid')
            .from(`${tbName}`)
            .where(`propertyid = '${propertyid}'`)
            .andWhere(`branchid = '${bnc}'`)
            .andWhere(`userid = '${params[0].userid.trim()}'`)
            .getRawOne()
          logTextBefor += `${itemsUser.userid} ${itemsUser.usrpermission} ${itemsUser.propertyid} ${itemsUser.branchid}`
          console.log('params ', params)
          for (let i = 0; i < params.length; i++) {
            const elem = params[i]
            let arrComp = []
            let property = elem.propertyid
            let branch = elem.branchid ? elem.branchid.trim() : 'HQ'
            console.log('items ', elem.items)
            elem.items.forEach((ele) => {
              arrComp.push(`'${ele.name}'`)
            })
            arrComp = arrComp.join(',')
            let usrPerm = itemsUser.usrpermission.split(',')
            const connectionPerm = getConnection.createQueryBuilder()
            const components = await connectionPerm
              .select(`name, position`)
              .from('componentmst')
              .where(`name IN (${arrComp})`)
              .andWhere(`state = 'dev'`)
              .getRawMany()
            elem.items.forEach((ele, i) => {
              let p = decodePerm(ele.permission)
              const cmp = components.filter((c) => c.name === ele.name)
              usrPerm[parseInt(cmp[0].position) - 1] = p.join('')
            })
            usrPerm = usrPerm.join(',')
            console.log('usrPerm', usrPerm)
            const cnnUpdate = getConnection.createQueryBuilder()
            const items = await cnnUpdate
              .update(`${tbName}`)
              .set({
                usrpermission: usrPerm
              })
              .where(`propertyid = '${property.trim()}'`)
              .andWhere(`branchid = '${branch.trim()}'`)
              .andWhere(`userid = '${id.trim()}'`)
              .returning('*')
              .updateEntity(true)
              .execute()
            let result = Object.entries(items)
            result = result[1][1]
            if (result.length > 0) {
              let data = []
              data.push({
                userid: id,
                propertyid: property,
                branchid: branch
              })
              resp.content.push(data)
              resp.status = '2000'
              resp.msg = `Update Success!`
              const usrAgent = req.get('User-Agent')
              let lg = new Log()
              /*
              lg.setLog(
                userid,
                typeModule,
                typeFunctions,
                _UPDATE,
                logTextBefor,
                usrAgent,
                logFile
              )
              */
              lg.setLogDB(
                userid,
                typeModule,
                typeFunctions,
                _UPDATE,
                usrAgent,
                logTextBefor
              )
              lg = null
            } else {
              resp.status = '2100'
              resp.msg = `Cannot Update`
            }
          }
        } else {
          // return new permission
          resp.status = '2001'
          resp.msg = 'Permission Denied.'
        }
      } else {
        resp.status = '2002'
        resp.msg = 'Invalid Token.'
      }
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

rtr.get('/usercomponentpermision/:username/:component', async (req, res, next) => {
  let resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: [],
    items: []
  }
  try {
    if (req.params.username == 'root' || req.params.username == 'Root' || req.params.username == 'ADMIN') resp.content.push({
      componentcode:req.params.component ,permissioncreate:1,permissionread:1, permissionupdate:1,permissiondelete:1
    })
    else{
    const connection = getConnection.createQueryBuilder()
    const permission = await connection
      .select(` componentcode ,permissioncreate,permissionread, permissionupdate,permissiondelete `)
      .from(`userpermission`)
      .where(`username = '${req.params.username}' and componentcode = '${req.params.component}'`)
      .getRawOne()
    // resdata = {};
    // rolepermission.forEach(async (ele) => {
    //   resdata[ele.componentcode] = {
    //     permissioncreate: ele.permissioncreate,
    //     permissionread: ele.permissionread,
    //     permissionupdate: ele.permissionupdate,
    //     permissiondelete: ele.permissiondelete,
    //   }
    // })
    
    if(permission){
      resp.content.push(permission)
    }else{
    resp.content.push({
      componentcode:req.params.component ,permissioncreate:0,permissionread:0, permissionupdate:0,permissiondelete:0
    })
    }

    }
    
    resp.status = '2000'
    resp.msg = 'Success'
    res.send(resp)
  } catch (error) {
    console.log(error)
    res.send(resp)
  }
})


module.exports = rtr

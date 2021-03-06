const express = require('express')
const rtr = express.Router()
const getConnection = require('typeorm')
const Log = require('../Utility/log').Log
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
const tag = 'user-permissions'
const _COMPONENTID = 'CM-MST-00892254'
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

rtr.get('/user-permissions', async (req, res, next) => {
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
    const cnnUsr = getConnection.createQueryBuilder()
    const itemsUsers = await cnnUsr
      .select('userid, property, branch')
      .from(`username`)
      .andWhere(`status_record = 'active'`)
      .andWhere(`property IS NOT NULL `)
      .getRawMany()

    const whereDev = "dev = 'Y'"
    const whereBeta = "beta = 'N'"
    const status = "status = 'A'"
    const cnnPermission = getConnection.createQueryBuilder()
    const permissions = await cnnPermission
      .select('userid, propertyid, branchid,usrpermission')
      .from(`${tbName}`)
      .where(`propertyid = '${propertyid}'`)
      .andWhere(`branchid = '${bnc}'`)
      .andWhere(`userid = '${id}'`)
      .andWhere(`${status}`)
      .andWhere(`${whereDev}`)
      .andWhere(`${whereBeta}`)
      .getRawOne()
    console.log('permissions ', permissions)
    let perm = permissions.usrpermission.split(',')
    perm = new Array(perm.length)
    perm.fill('N')
    if (perm.length > 0) {
      const connRole = getConnection.createQueryBuilder()
      const components = await connRole
        .select('componentid, parent, name, position')
        .from('componentmst')
        .orderBy('seq', 'ASC')
        .addOrderBy('position', 'ASC')
        .getRawMany()
      const roles = CompTree(components, perm)
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
rtr.get('/user-permissions-', async (req, res, next) => {
  try {
    const tkn = req.headers.authorization
    const usrVerify = userAuth(tkn, tag)
    // const usrVerify = true
    if (usrVerify) {
      const connection = getConnection.createQueryBuilder()
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _READ,
        usrVerify.sub.user.toUpperCase(),
        usrVerify.sub.role.propertyid.toUpperCase(),
        _SEPARATE
      )
      // const uhp = true
      if (uhp) {
        const propertyid = 'FSDH'
        const bnc = 'CHR'
        const whereDev = "dev = 'Y'"
        const whereBeta = "beta = 'N'"
        const status = "status = 'A'"
        const cnnPermission = getConnection.createQueryBuilder()
        const permissions = await cnnPermission
          .select('userid,usrpermission,propertyid, branchid')
          .from(`${tbName}`)
          .where(`propertyid = '${propertyid}'`)
          .andWhere(`branchid = '${bnc}'`)
          .andWhere(`${status}`)
          .andWhere(`${whereDev}`)
          .andWhere(`${whereBeta}`)
          .getRawMany()

        const connRole = getConnection.createQueryBuilder()
        const components = await connRole
          .select('componentid, parent, name, position')
          .from('componentmst')
          .orderBy('seq', 'ASC')
          .addOrderBy('position', 'ASC')
          .getRawMany()
        const roles = permissiosRoles(permissions, components)
        /*
        const idMapping = components.reduce((acc, el, i) => {
          acc[el.componentid.trim().substring(0, 2)] = i
          return acc
        }, {})
        let root
        let arrComp = []
        components.forEach((el, i) => {
          let parent = el.parent.trim().substring(0, 2)
          let obj = {
            id: i,
            name: el.name,
            parent
          }

          if (el.parent.trim() === '**ROOT') {
            root = obj
            return
          }
          const parentEl = components[idMapping[parent]]
          parentEl.children = [...(parentEl.children || []), el]
          arrComp.push(parentEl)
        })

        let uSet = new Set(arrComp)
        arrComp = [ ...uSet ]
        */
        resp.status = '2000'
        resp.msg = 'Success!'
        resp.content = roles
      } else {
        const userid = usrVerify.sub.user.toUpperCase()
        const propertyid = 'FSDH'
        const bnc = 'CHR'
        const whereDev = "dev = 'Y'"
        const whereBeta = "beta = 'N'"
        const status = "status = 'A'"
        const cnnPermission = getConnection.createQueryBuilder()
        const items = await cnnPermission
          .select('userid,usrpermission,propertyid, branchid')
          .from(`usrpermissionmst`)
          .where(`propertyid = '${propertyid}'`)
          .andWhere(`branchid = '${bnc}'`)
          .andWhere(`userid = '${userid}'`)
          .andWhere(`${status}`)
          .andWhere(`${whereDev}`)
          .andWhere(`${whereBeta}`)
          .getRawOne()
        const usrPermissions = items.usrpermission.split(_SEPARATE)
        const arrPosition = []
        for (let i = 0; i < usrPermissions.length; i++) {
          if (usrPermissions[i] !== '') {
            arrPosition.push(i + 1)
          }
        }
        const where$ = arrPosition.join(',')
        const connComponent = getConnection.createQueryBuilder()
        const components = await connComponent
          .select('componentid, name, icon, parent')
          .from('componentmst')
          .where(`position IN (${where$})`)
          .getRawMany()
        const permissions = []
        components.forEach((ele) => {
          const obj = {
            icon: ele.icon,
            slug: ele.name,
            _children: []
          }
          permissions.push(obj)
        })
        // permission: usrPermissions[parseInt(ele.position) - 1],
        const data = []
        const obj = {
          propertyID: items.propertyid,
          branchID: items.branchid,
          userID: items.userid,
          components: permissions
        }
        data.push(obj)
        resp.content.items = data
        resp.status = '2001'
        resp.msg = 'Permission Denined.'
      }
    } else {
      resp.status = '2002'
    }
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(`${tag}|${error}`)
    console.log(error)
    res.send(resp)
  }
})

rtr.get('/user-permissionss/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { propertyid, bnc } = req.query
    // const propertyid = 'FSDH'
    // const bnc = 'CHR'
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select('userid, usrpermission, propertyid, branchid')
      .from(`${tbName}`)
      .where(`userid = '${id}'`)
      .andWhere(`propertyid = ${propertyid}`)
      .andWhere(`branchid = ${bnc}`)
      .getRawMany()
    let datas = []
    const usrPermissions = items[0].usrpermission.split(_SEPARATE)
    const arrPosition = []
    for (let i = 0; i < usrPermissions.length; i++) {
      if (usrPermissions[i] !== '') {
        arrPosition.push(i + 1)
      }
    }
    const where$ = arrPosition.join(',')
    const components = await componentsUsr(where$)
    let permissions = []
    components.forEach((el) => {
      let p = encodePerm(usrPermissions[parseInt(el.position) - 1])
      const obj = {
        name: el.name,
        permission: p
      }
      permissions.push(obj)
    })
    datas.push({
      userid: id,
      propertyid: items[0].propertyid,
      permission: permissions
    })
    /*
    const usrPermissions = items.usrpermission.split(_SEPARATE)
    const arrPosition = []
    for (let i = 0; i < usrPermissions.length; i++) {
      if (usrPermissions[i] !== '') {
        arrPosition.push(i + 1)
      }
    }
    const where$ = arrPosition.join(',')
    const connComponent = getConnection.createQueryBuilder()
    const components = await connComponent
      .select('componentid, parent, name, position')
      .from('componentmst')
      .where(`position IN (${where$})`)
      .orderBy('seq', 'ASC')
      .getRawMany()
    let permissions = []
    let data = []
    components.forEach((ele) => {
      let p = encodePerm(usrPermissions[parseInt(ele.position) - 1])
      const obj = {
        name: ele.name,
        permission: p
      }
      permissions.push(obj)
    })
    data.push( permissions )
    */

    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = datas
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(`${tag}|${error}`)
    console.log(`error ${tag}`, error)
    res.send(resp)
  }
})

rtr.get('/user-permissions/:id', async (req, res, next) => {
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
    console.log(id)
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
          propertyid: propertyid,
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
    lg.setLog(`${tag}|${error}`)
    console.log(`error ${tag}`, error)
    res.send(resp)
  }
})

rtr.put('/user-permissions/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const params = req.body
    const propertyid = 'FSDH'
    const bnc = params[0].branch ? params[0].branch : 'HQ'
    const tkn = req.headers.authorization
    console.log('params ', params)
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
        const connection = getConnection.createQueryBuilder()
        const itemsUser = await connection
          .select('userid, usrpermission,propertyid, branchid')
          .from(`${tbName}`)
          .where(`propertyid = '${propertyid}'`)
          .andWhere(`branchid = '${bnc}'`)
          .andWhere(`userid = '${params[0].userid.trim()}'`)
          .getRawOne()

        for (let i = 0; i < params.length; i++) {
          const elem = params[i]
          let arrComp = []
          let property = elem.propertyid
          let branch = elem.branchid ? elem.branchid.trim() : 'HQ'
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
    res.send(resp)
  } catch (e) {
    const data = `${tag} |${e}`
    // method, error number
    // error message ??????????????? error number
    console.log(e)
    const lg = new Log()
    lg.setLog(data)
    res.send(resp)
  }
})

module.exports = rtr

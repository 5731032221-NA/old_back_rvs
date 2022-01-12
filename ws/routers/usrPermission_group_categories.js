const express = require('express')
const rtr = express.Router()
const getConnection = require('typeorm')
const Log = require('../Utility/log').Log
const { permissiosRoles, decodePerm } = require('../Utility/user')
const { makeComponentTree } = require('../Utility/tools')
const { usrPerm } = require('../queryparser/user')
const { userAuth } = require('../Utility/verify')
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE
} = require('../sys/service')
const pid = process.pid
const tbName = 'usrpermissionmst'
const tag = '/room-masters'
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
  try {
    const tkn = req.headers.authorization
    // const usrVerify = userAuth(tkn)
    const usrVerify = true
    if (usrVerify) {
      const connection = getConnection.createQueryBuilder()
      /*
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _READ,
        usrVerify.sub.user.toUpperCase(),
        usrVerify.sub.role.propertyid.toUpperCase(),
        _SEPARATE
      )
      */
      const uhp = true
      if (uhp) {
        const propertyid = 'FSDH'
        const bnc = 'CHR'
        const whereDev = "dev = 'Y'"
        const whereBeta = "beta = 'N'"
        const status = "status = 'A'"
        const connectionA = getConnection.createQueryBuilder()
        const Categories = await connectionA
          .select('substring(componentid from 1 for 2) AS category, name')
          .from(`componentmst`)
          .getRawMany()
        const cnnPermission = getConnection.createQueryBuilder()
        const permissions = await cnnPermission
          .select('userid,usrpermission')
          .from(`${tbName}`)
          .where(`propertyid = '${propertyid}'`)
          .andWhere(`branchid = '${bnc}'`)
          .andWhere(`${status}`)
          .andWhere(`${whereDev}`)
          .andWhere(`${whereBeta}`)
          .getRawMany()

        const connRole = getConnection.createQueryBuilder()
        const components = await connRole
          .select('componentid, parent, name')
          .from('componentmst')
          .orderBy('seq', 'ASC')
          .addOrderBy('position', 'ASC')
          .getRawMany()
        const roles = permissiosRoles(permissions, components)
        const idMapping = components.reduce((acc, el, i) => {
          acc[el.componentid.trim().substring(0, 2)] = i
          return acc
        }, {})
        let root
        let arrComp = []
        components.forEach((el, i) => {
          // Handle the root element
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
          // Use our mapping to locate the parent element in our data array

          const parentEl = components[idMapping[parent]]

          // Add our current el to its parent's `children` array
          parentEl.children = [...(parentEl.children || []), el]
          arrComp.push(parentEl)
        })
        console.log('root ', root)
        let uSet = new Set(arrComp)
        arrComp = [...uSet]
        resp.status = '2000'
        resp.msg = 'Success!'
        resp.content = arrComp
      } else {
        const userid = usrVerify.sub.user.toUpperCase()
        const propertyid = 'FSDH'
        const bnc = 'CHR'
        const whereDev = "dev = 'Y'"
        const whereBeta = "beta = 'N'"
        const status = "status = 'A'"
        const cnnPermission = getConnection.createQueryBuilder()
        const items = await cnnPermission
          .select('userid,usrpermission')
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
            permission: usrPermissions[parseInt(ele.position) - 1],
            _children: []
          }
          permissions.push(obj)
        })
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
rtr.get('/user-permissions/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { propertyid, bnc } = req.query
    let category = id.toUpperCase()
    const connectionA = getConnection.createQueryBuilder()
    const Categories = await connectionA
      .select('substring(componentid from 1 for 2) AS category, name, parent')
      .where(`componentid like '${category}%'`)
      .from(`componentmst`)
      .getRawMany()
    console.log('Categories ', Categories)
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select('userid, usrpermission')
      .from(`${tbName}`)
      .where(`propertyid = '${propertyid}'`)
      .andWhere(`branchid = '${bnc}'`)
      .andWhere(`userid = '${id}'`)
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
      .select('componentid, slug, icon, parent')
      .from('componentmst')
      .where(`position IN (${where$})`)
      .getRawMany()
    const permissions = []
    components.forEach((ele) => {
      const obj = {
        icon: ele.icon,
        slug: ele.slug,
        permission: usrPermissions[parseInt(ele.position) - 1],
        children: []
      }
      permissions.push(obj)
    })
    const data = []
    const obj = {
      propertyID: items.propertyid,
      branchID: items.branchid,
      userID: items.userid,
      components: permissions
    }
    data.push(obj)
    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = data
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(`${tag}|${error}`)
    console.log('error ', error)
    res.send(resp)
  }
})

rtr.put('/user-permissions/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const { name, child } = req.body
    const propertyid = 'FSDH'
    const bnc = 'CHR'
    const tkn = req.headers.authorization
    const usrVerify = userAuth(tkn)
    if (usrVerify) {
      const connection = getConnection.createQueryBuilder()
      const userid = usrVerify.sub.user.toUpperCase()
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _UPDATE,
        userid,
        usrVerify.sub.role.propertyid.toUpperCase(),
        _SEPARATE
      )
      if (uhp) {
        const connection = getConnection.createQueryBuilder()
        const itemsUser = await connection
          .select('userid, usrpermission')
          .from(`${tbName}`)
          .where(`propertyid = '${propertyid}'`)
          .andWhere(`branchid = '${bnc}'`)
          .andWhere(`userid = '${userid}'`)
          .getRawOne()
        let arrComp = []
        child.forEach((ele) => {
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
        child.forEach((ele, i) => {
          let p = decodePerm(ele.permission)
          const cmp = components.filter((c) => c.name === ele.name)
          console.log('cmp ', cmp)
          console.log('position ', parseInt(cmp[0].position) - 1)
          usrPerm[parseInt(cmp[0].position) - 1] = p.join('')
        })

        usrPerm = usrPerm.join(',')
        const cnnUpdate = getConnection.createQueryBuilder()
        const items = await cnnUpdate
          .update(`${tbName}`)
          .set({
            usrpermission: usrPerm
          })
          .where(`propertyid = '${propertyid.trim()}'`)
          .andWhere(`branchid = '${bnc.trim()}'`)
          .andWhere(`userid = '${name.trim()}'`)
          .returning(['userid', 'usrpermission'])
          .updateEntity(true)
          .execute()
        resp.content = items
        resp.status = '2000'
        resp.msg = `Update Success!`
      } else {
        resp.status = '2001'
        resp.msg = 'Permission Denied.'
      }
    } else {
      resp.status = '2002'
    }
    res.send(resp)
  } catch (e) {
    const data = `${tag} |${e}`
    // method, error number
    // error message ที่มี error number
    console.log(e)
    const lg = new Log()
    lg.setLog(data)
    res.send(resp)
  }
})

module.exports = rtr

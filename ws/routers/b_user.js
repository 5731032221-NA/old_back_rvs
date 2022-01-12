const express = require('express')
const router = express.Router()
/*************************************/
const getConnection = require('typeorm')
const crt = require('crypto')
const Log = require('../Utility/log').Log
const { usrPerm, componentsUsr } = require('../queryparser/user')
const { userAuth } = require('../Utility/verify')
const Username = require('../model/Username').Username
const Account = require('../model/Account').Account
/*************************************/
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE
} = require('../sys/service')
const pid = process.pid
const tbName = 'username'
const tagType = 'user-management/users'
const _COMPONENTID = 'UR-00845678'
/* ------------------------------------------------- */
let resp = {
  status: '0000',
  msg: 'Access Denied',
  content: []
}
/* ============================== */
router.get('/', (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})

function decodeToken(str) {
  if (str) {
    str = str.split('.')[1]

    str = str.replace('/-/g', '+')
    str = str.replace('/_/g', '/')
    switch (str.length % 4) {
      case 0:
        break
      case 2:
        str += '=='
        break
      case 3:
        str += '='
        break
      default:
        throw new Error('Invalid token')
    }

    str = (str + '===').slice(0, str.length + (str.length % 4))
    str = str.replace(/-/g, '+').replace(/_/g, '/')

    str = decodeURIComponent(
      escape(Buffer.from(str, 'base64').toString('binary'))
    )

    str = JSON.parse(str)
    return str
  }
}

router.post('/rolegroup', async (req, res, next) => {
  try {
    const params = req.body
    console.log("params", params)
    let rolecode = params.rolecode.trim();
    let rolename = params.rolename.trim();
    let description = params.description.trim();
    let applyproperty = params.applyproperty;
    let status = params.status;
    console.log("applyproperty", applyproperty);
    const cnnDup = getConnection.createQueryBuilder()
    const itemsAleady = await cnnDup
      .select(`rolecode`)
      .from(`rolegroup`)
      .where(`rolecode = '${rolecode}'`)
      // .andWhere(`lastname = '${lName}'`)
      .getRawOne()
    console.log('already ', itemsAleady)
    if (!itemsAleady) {

      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .insert()
        .into(`rolegroup`)
        .values({
          rolecode: rolecode,
          rolename: rolename,
          description: description,
          applypropertys: applyproperty,
          status: status
        })
        .updateEntity(false)
        .execute()

      console.log("permission", req.body.permission)
      const permconnection = getConnection.createQueryBuilder()
      const perm = await permconnection
        .insert()
        .into(`rolepermission`)
        .values(req.body.permission)
        .updateEntity(false)
        .execute()


      resp.content.push(items)
      resp.status = '2000'
      resp.msg = `Success! `
    } else {
      resp.status = '1000'
      resp.msg = `Duplicate`
      resp.content = []
    }
    res.send(resp)
  } catch (error) {
    console.log(error)
    res.send(resp)
  }
})

router.delete('/rolegroup/:rolecode', async (req, res, next) => {
  try {
    let rolecode = req.params.rolecode;
    const connection = getConnection.createQueryBuilder()
    const drop = await connection
      .delete()
      .from('rolegroup')
      .where('rolecode  = :rolecode', { rolecode })
      .execute()
    resp.content.push(drop)
    resp.status = '2000'
    resp.msg = 'Success'
    res.send(resp)
  } catch (error) {
    console.log(error)
    res.send(resp)
  }
})

router.delete('/user/:username', async (req, res, next) => {
  try {
    let username = req.params.username;
    const connection = getConnection.createQueryBuilder()
    const drop = await connection
      .delete()
      .from('account')
      .where('username  = :username', { username })
      .execute()
    resp.content.push(drop)
    resp.status = '2000'
    resp.msg = 'Success'
    res.send(resp)
  } catch (error) {
    console.log(error)
    res.send(resp)
  }
})

router.post('/user', async (req, res, next) => {
  try {
    const params = req.body
    console.log("params", params)
    let fName = params.firstname.trim();
    let lName = params.lastname.trim();
    let code = params.code.trim();
    let position = params.position.trim();
    let grantproperty = params.userproperty
    let roles = params.role;
    let status = params.status;
    console.log("roles", roles);
    const cnnDup = getConnection.createQueryBuilder()
    const itemsAleady = await cnnDup
      .select(`username`)
      .from(`account`)
      .where(`username = '${code}'`)
      // .andWhere(`lastname = '${lName}'`)
      .getRawOne()
    console.log('already ', itemsAleady)
    if (!itemsAleady) {
      let pwd = new Date().getTime().toString(36)
      const userid = fName.substring(0, 3) + lName.substring(0, 2)
      let usrMsg = `  ID : ${userid}  PASS: ${pwd}`
      console.log(usrMsg)
      pwd = crt
        .createHash('md5', 'revopms')
        .update(pwd)
        .digest('hex')

      // Generate รหัสพนักงาน  6 digit ใส่ id auto gen ป้องกันการใส่่เองใน db เพราะ chema ใส่ไว้เป็น int ฉะนั้น id ที่เป็นจุดทสนิยม จะทำให้ระบบไม่สามารถทำงานได้
      // select coalesce(MAX(id), 0) +1 as uu from username
      const username1 = new Account(
        fName,
        lName,
        code,
        pwd,
        position,
        status
      )
      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .insert()
        .into(`account`)
        .values([username1])
        .returning([
          'firstname',
          'lastname',
          'username',
          'pwd',
          'position',
          'status'
        ])
        .updateEntity(false)
        .execute()
      roles.split(",").forEach(async (ele) => {
        let cnnRole = getConnection.createQueryBuilder()
        let insertRole = await cnnRole
          .insert()
          .into(`userrole`)
          .values({
            username: code,
            rolecode: ele
          })
          .updateEntity(false)
          .execute()
      })

      grantproperty.split(",").forEach(async (ele) => {
        let cnnProperty = getConnection.createQueryBuilder()
        let insertProperty = await cnnProperty
          .insert()
          .into(`grantproperty`)
          .values({
            username: code,
            propertycode: ele
          })
          .updateEntity(false)
          .execute()
      })

      resp.content.push(items)
      resp.status = '2000'
      resp.msg = `Success!  ${usrMsg}`
    } else {
      resp.status = '1000'
      resp.msg = `Duplicate ${code}`
      resp.content = []
    }
    res.send(resp)
  } catch (error) {
    console.log(error)
    res.send(resp)
  }
})

router.put('/user', async (req, res, next) => {
  try {
    const params = req.body
    let fName = params.firstname.trim()
    let lName = params.lastname.trim()
    let code = params.code.trim()
    let position = params.posotion.trim()
    let grantproperty = params.grantproperty
    let status = params.status

    const cnnDup = getConnection.createQueryBuilder()
    const itemsAleady = await cnnDup
      .select(`username`)
      .from(`account`)
      .where(`username = '${code}'`)
      // .andWhere(`lastname = '${lName}'`)
      .getRawOne()
    console.log('already ', itemsAleady)
    if (!itemsAleady) {
      let pwd = new Date().getTime().toString(36)
      const userid = fName.substring(0, 3) + lName.substring(0, 2)
      let usrMsg = `  ID : ${userid}  PASS: ${pwd}`
      console.log(usrMsg)
      pwd = crt
        .createHash('md5', 'revopms')
        .update(pwd)
        .digest('hex')

      // Generate รหัสพนักงาน  6 digit ใส่ id auto gen ป้องกันการใส่่เองใน db เพราะ chema ใส่ไว้เป็น int ฉะนั้น id ที่เป็นจุดทสนิยม จะทำให้ระบบไม่สามารถทำงานได้
      // select coalesce(MAX(id), 0) +1 as uu from username
      const username1 = new Account(
        fName,
        lName,
        code,
        position,
        status
      )
      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .update(`${tbName}`, username1)
        .where({ username: code })
        .returning([
          'firstname',
          'lastname',
          'username',
          'position',
          'status'
        ])
        .updateEntity(true)
        .execute()
      resp.content.push(items)
      resp.status = '2000'
      resp.msg = `Success!  ${usrMsg}`
    } else {
      resp.status = '1000'
      resp.msg = `Duplicate ${code}`
      resp.content = []
    }
    res.send(resp)
  } catch (error) {
    console.log(error)
    res.send(resp)
  }
})

router.get('/propertyrole/:property', async (req, res, next) => {
  try {
    console.log("propertyrole")
    console.log("prop", req.params.property)
    const tkn = req.headers.authorization;
    const decoded = decodeToken(tkn)
    console.log("tkn", decoded);
    if (decoded.sub.username == 'ADMIN') resp.content.push("Administrator")
    if (decoded.sub.username == 'root' || decoded.sub.username == 'Root') resp.content.push("Root")
    else {
      console.log("property", req.params.property);
      const connection = getConnection.createQueryBuilder()
      const roleper = await connection
        .select("string_agg(distinct roleper.rolename, ',') rn")
        .from(`userrole`)
        // .where(`userrole.username = '${decoded.sub.username}'`)
        .innerJoin("rolegroup", "roleper", "userrole.rolecode = roleper.rolecode")
        .where(`userrole.username = '${decoded.sub.username}' and (roleper.applypropertys LIKE '%${req.params.property}%' or roleper.applypropertys = '*ALL')`)
        .getRawOne()
      console.log("roleper", roleper)
      resp.content.push(roleper.rn.split(","))

    }

    // }
    resp.status = '2000'
    resp.msg = 'Success!'
    res.send(resp)
  } catch (error) {
    console.log('err users', error)
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = 'Failer'
    res.send(resp)
  }
})
const compmaster = {
  "DB": "C01",
  "RV": "C02",
  "FD": "C03",
  "CS": "C04",
  "PF": "C05",
  "NA": "C06",
  "HK": "C07",
  "EN": "C08",
  "RS": "C09",
  "CF": "C10",
  "ST": "C11"
}
router.get('/propertypermission/:property', async (req, res, next) => {
  try {
    console.log("propertypermission")
    console.log("prop", req.params.property)
    const tkn = req.headers.authorization;
    const decoded = decodeToken(tkn)
    console.log("tkn", decoded);
    if (decoded.sub.username == 'ADMIN' || decoded.sub.username == 'root') resp.content.push(['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11'])
    else {
      console.log("property", req.params.property);
      const connection = getConnection.createQueryBuilder()
      const roleper = await connection
        .select("string_agg(distinct per.componentcode, ',') compper")
        .from(`userrole`)
        // .where(`userrole.username = '${decoded.sub.username}'`)
        .innerJoin("rolegroup", "roleper", "userrole.rolecode = roleper.rolecode")
        .innerJoin("rolepermission", "per", "userrole.rolecode = per.rolecode")
        .where(`userrole.username = '${decoded.sub.username}' and (roleper.applypropertys LIKE '%${req.params.property}%' or roleper.applypropertys = '*ALL')`)
        .getRawOne()
      console.log("roleper", roleper)
      let setlist = new Set();
      roleper.compper.split(",").forEach(async ele => setlist.add(compmaster[ele.substring(0, 2)]));

      console.log("setlist", setlist);

      resp.content.push(Array.from(setlist))

    }

    // }
    resp.status = '2000'
    resp.msg = 'Success!'
    res.send(resp)
  } catch (error) {
    console.log('err users', error)
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = 'Failer'
    res.send(resp)
  }
})

router.get('/listuser', async (req, res, next) => {
  try {

    // const tkn = req.headers.authorization
    // let usrVerify = userAuth(tkn, _COMPONENTID)
    // if (!usrVerify) {
    //   resp.status = '2002'
    //   resp.msg = 'Invalid Token.'
    //   res.send(resp)
    // }
    // const userid = usrVerify.sub.user
    // const uhp = await usrPerm(
    //   _COMPONENTID,
    //   _READ,
    //   userid,
    //   usrVerify.sub.property,
    //   usrVerify.sub.branch,
    //   _SEPARATE
    // )
    // if (uhp !== 'N') {
    //   if (uhp === 'Y') {
    // const connection = getConnection.createQueryBuilder()
    // const items = await connection
    //   .select("id,username ,firstname ,lastname ,status, position, GROUP_CONCAT(rolecode SEPARATOR ', ')")
    //   .from(`account`)
    //   .getRawMany()
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select("id,account.username ,firstname ,lastname ,status, position, string_agg(distinct rolecode.rolecode, ', ') roles, string_agg(distinct propertycode.propertycode, ', ') property")
      .from(`account`)
      .leftJoin("userrole", "rolecode", "rolecode.username = account.username")
      .leftJoin("grantproperty", "propertycode", "propertycode.username = account.username")
      .groupBy("id,account.username ,firstname ,lastname ,status, position")
      .getRawMany()
    console.log(items)
    resp.content.push(items)
    // }
    resp.status = '2000'
    resp.msg = 'Success!'
    res.send(resp)
    // } else {
    //   const userid = usrVerify.sub.user
    //   const propertyid = usrVerify.sub.property
    //   const bnc = usrVerify.sub.branch
    //   const whereDev = "dev = 'Y'"
    //   const whereBeta = "beta = 'N'"
    //   const status = "status = 'A'"
    //   const cnnPermission = getConnection.createQueryBuilder()
    //   const items = await cnnPermission
    //     .select('rolecode,status,rolename')
    //     .from(`rolegroup`)
    //     .where(`propertyid = '${propertyid}'`)
    //     .andWhere(`branchid = '${bnc}'`)
    //     .andWhere(`userid = '${userid}'`)
    //     .andWhere(`${status}`)
    //     .andWhere(`${whereDev}`)
    //     .andWhere(`${whereBeta}`)
    //     .getRawMany()
    //   items.forEach((ele) => {
    //     const obj = {
    //       icon: ele.icon,
    //       slug: ele.name,
    //       _children: []
    //     }
    //     permissions.push(obj)
    //   })
    //   // permission: usrPermissions[parseInt(ele.position) - 1],
    //   const data = []
    //   const obj = {
    //     // propertyID: items.propertyid,
    //     // branchID: items.branchid,
    //     // userID: items.userid,
    //     components: permissions
    //   }
    //   data.push(obj)
    //   console.log(data)
    //   resp.content = data
    //   res.send(resp)
    //   resp.status = '2001'
    //   resp.msg = 'Permission Denied!.'
    // }
  } catch (error) {
    console.log('err users', error)
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = 'Failer'
    res.send(resp)
  }
})


router.post('/listpropertybyroles', async (req, res, next) => {
  try {

    // const tkn = req.headers.authorization
    // let usrVerify = userAuth(tkn, _COMPONENTID)
    // if (!usrVerify) {
    //   resp.status = '2002'
    //   resp.msg = 'Invalid Token.'
    //   res.send(resp)
    // }
    // const userid = usrVerify.sub.user
    // const uhp = await usrPerm(
    //   _COMPONENTID,
    //   _READ,
    //   userid,
    //   usrVerify.sub.property,
    //   usrVerify.sub.branch,
    //   _SEPARATE
    // )
    // if (uhp !== 'N') {
    //   if (uhp === 'Y') {
    console.log("listpropertybyroles body", req.body)
    let arrayrole = "('" + req.body.roles.join("','") + "')";
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select("string_agg(rolegroup.applypropertys, ',') applypropertys")
      .from(`rolegroup`)
      .where(`rolecode IN ${arrayrole}`)
      .getRawOne()
    console.log("listpropertybyroles", items)
    if (items.applypropertys) {
      if (items.applypropertys.indexOf("*ALL") >= 0) {
        let allconnection = getConnection.createQueryBuilder()
        let allitems = await allconnection
          .select("string_agg(rolegroup.applypropertys, ',') applypropertys")
          .from(`rolegroup`)
          .where(`applypropertys != '*ALL'`)
          .getRawOne()
        console.log(allitems.applypropertys)
        resp.content.push(allitems.applypropertys)
      } else {
        resp.content.push(items.applypropertys)
      }
    } else resp.content.push('')
    // }
    resp.status = '2000'
    resp.msg = 'Success!'
    res.send(resp)
    // } 
    //   else {
    //     console.log("hihi")
    //     const userid = usrVerify.sub.user
    //     const propertyid = usrVerify.sub.property
    //     const bnc = usrVerify.sub.branch
    //     const whereDev = "dev = 'Y'"
    //     const whereBeta = "beta = 'N'"
    //     const status = "status = 'A'"
    //     const cnnPermission = getConnection.createQueryBuilder()
    //     const items = await cnnPermission
    //       .select('rolecode,status,rolename')
    //       .from(`rolegroup`)
    //       .where(`propertyid = '${propertyid}'`)
    //       .andWhere(`branchid = '${bnc}'`)
    //       .andWhere(`userid = '${userid}'`)
    //       .andWhere(`${status}`)
    //       .andWhere(`${whereDev}`)
    //       .andWhere(`${whereBeta}`)
    //       .getRawMany()
    //     items.forEach((ele) => {
    //       const obj = {
    //         icon: ele.icon,
    //         slug: ele.name,
    //         _children: []
    //       }
    //       permissions.push(obj)
    //     })
    //     // permission: usrPermissions[parseInt(ele.position) - 1],
    //     const data = []
    //     const obj = {
    //       // propertyID: items.propertyid,
    //       // branchID: items.branchid,
    //       // userID: items.userid,
    //       components: permissions
    //     }
    //     data.push(obj)
    //     console.log(data)
    //     resp.content = data
    //     res.send(resp)
    //     resp.status = '2001'
    //     resp.msg = 'Permission Denied!.'
    //   }
  } catch (error) {
    console.log('err users', error)
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = 'Failer'
    res.send(resp)
  }
})


router.get('/listallproperty', async (req, res, next) => {
  try {

    // const tkn = req.headers.authorization
    // let usrVerify = userAuth(tkn, _COMPONENTID)
    // if (!usrVerify) {
    //   resp.status = '2002'
    //   resp.msg = 'Invalid Token.'
    //   res.send(resp)
    // }
    // const userid = usrVerify.sub.user
    // const uhp = await usrPerm(
    //   _COMPONENTID,
    //   _READ,
    //   userid,
    //   usrVerify.sub.property,
    //   usrVerify.sub.branch,
    //   _SEPARATE
    // )
    // if (uhp !== 'N') {
    //   if (uhp === 'Y') {

    let allconnection = getConnection.createQueryBuilder()
    let allitems = await allconnection
      .select("string_agg(rolegroup.applypropertys, ',') applypropertys")
      .from(`rolegroup`)
      .where(`applypropertys != '*ALL'`)
      .getRawOne()
    console.log(allitems.applypropertys)
    resp.content.push(allitems.applypropertys)

    // }
    resp.status = '2000'
    resp.msg = 'Success!'
    res.send(resp)
    // } 
    //   else {
    //     console.log("hihi")
    //     const userid = usrVerify.sub.user
    //     const propertyid = usrVerify.sub.property
    //     const bnc = usrVerify.sub.branch
    //     const whereDev = "dev = 'Y'"
    //     const whereBeta = "beta = 'N'"
    //     const status = "status = 'A'"
    //     const cnnPermission = getConnection.createQueryBuilder()
    //     const items = await cnnPermission
    //       .select('rolecode,status,rolename')
    //       .from(`rolegroup`)
    //       .where(`propertyid = '${propertyid}'`)
    //       .andWhere(`branchid = '${bnc}'`)
    //       .andWhere(`userid = '${userid}'`)
    //       .andWhere(`${status}`)
    //       .andWhere(`${whereDev}`)
    //       .andWhere(`${whereBeta}`)
    //       .getRawMany()
    //     items.forEach((ele) => {
    //       const obj = {
    //         icon: ele.icon,
    //         slug: ele.name,
    //         _children: []
    //       }
    //       permissions.push(obj)
    //     })
    //     // permission: usrPermissions[parseInt(ele.position) - 1],
    //     const data = []
    //     const obj = {
    //       // propertyID: items.propertyid,
    //       // branchID: items.branchid,
    //       // userID: items.userid,
    //       components: permissions
    //     }
    //     data.push(obj)
    //     console.log(data)
    //     resp.content = data
    //     res.send(resp)
    //     resp.status = '2001'
    //     resp.msg = 'Permission Denied!.'
    //   }
  } catch (error) {
    console.log('err users', error)
    resp.msg = 'Failer'
    res.send(resp)
  }
})

router.get('/listrole', async (req, res, next) => {
  try {

    // const tkn = req.headers.authorization
    // let usrVerify = userAuth(tkn, _COMPONENTID)
    // if (!usrVerify) {
    //   resp.status = '2002'
    //   resp.msg = 'Invalid Token.'
    //   res.send(resp)
    // }
    // const userid = usrVerify.sub.user
    // const uhp = await usrPerm(
    //   _COMPONENTID,
    //   _READ,
    //   userid,
    //   usrVerify.sub.property,
    //   usrVerify.sub.branch,
    //   _SEPARATE
    // )
    // if (uhp !== 'N') {
    //   if (uhp === 'Y') {
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select('rolegroup.rolecode rolecode,rolename,description,status,COUNT(DISTINCT rolecode.username) count')
      .from(`rolegroup`)
      .leftJoin("userrole", "rolecode", "rolegroup.rolecode = rolecode.rolecode")
      .groupBy("rolegroup.rolecode,rolename,description,status")
      .getRawMany()
    resp.content.push(items)
    // }
    resp.status = '2000'
    resp.msg = 'Success!'
    res.send(resp)
    // } 
    //   else {
    //     console.log("hihi")
    //     const userid = usrVerify.sub.user
    //     const propertyid = usrVerify.sub.property
    //     const bnc = usrVerify.sub.branch
    //     const whereDev = "dev = 'Y'"
    //     const whereBeta = "beta = 'N'"
    //     const status = "status = 'A'"
    //     const cnnPermission = getConnection.createQueryBuilder()
    //     const items = await cnnPermission
    //       .select('rolecode,status,rolename')
    //       .from(`rolegroup`)
    //       .where(`propertyid = '${propertyid}'`)
    //       .andWhere(`branchid = '${bnc}'`)
    //       .andWhere(`userid = '${userid}'`)
    //       .andWhere(`${status}`)
    //       .andWhere(`${whereDev}`)
    //       .andWhere(`${whereBeta}`)
    //       .getRawMany()
    //     items.forEach((ele) => {
    //       const obj = {
    //         icon: ele.icon,
    //         slug: ele.name,
    //         _children: []
    //       }
    //       permissions.push(obj)
    //     })
    //     // permission: usrPermissions[parseInt(ele.position) - 1],
    //     const data = []
    //     const obj = {
    //       // propertyID: items.propertyid,
    //       // branchID: items.branchid,
    //       // userID: items.userid,
    //       components: permissions
    //     }
    //     data.push(obj)
    //     console.log(data)
    //     resp.content = data
    //     res.send(resp)
    //     resp.status = '2001'
    //     resp.msg = 'Permission Denied!.'
    //   }
  } catch (error) {
    console.log('err users', error)
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = 'Failer'
    res.send(resp)
  }
})

router.get('/user-management/users', async (req, res, next) => {
  try {
    /*
    const connID = getConnection.createQueryBuilder()
    const maxid = await connID
      .select(`coalesce(MAX(id), 0) +1 as maxid`)
      .from(`${tbName}`)
      .getRawOne()
    console.log('max id', maxid.maxid)
    */
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
    if (uhp !== 'N') {
      if (uhp === 'Y') {
        const connection = getConnection.createQueryBuilder()
        const items = await connection
          .select()
          .from(`${tbName}`)
          .getRawMany()
        resp.content.push(items)
      }
      resp.status = '2000'
      resp.msg = 'Success!'
      res.send(resp)
    } else {
      const userid = usrVerify.sub.user
      const propertyid = usrVerify.sub.property
      const bnc = usrVerify.sub.branch
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
      console.log(data)
      resp.content = data
      res.send(resp)
      resp.status = '2001'
      resp.msg = 'Permission Denied!.'
    }
  } catch (error) {
    console.log('err users', error)
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = 'Failer'
    res.send(resp)
  }
})

router.get('/user-management/users/:id', async (req, res, next) => {
  const id = parseInt(req.params.id)
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
      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .select()
        .from(`${tbName}`)
        .where('usr.id = :id', { id })
        .getRawOne()
      resp.content.push(items)
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
          resp.content.push(data)
          resp.status = '2001'
          resp.msg = 'Permission Denied!.'
        } else {
          resp.status = '2003'
          resp.msg = 'Permission Notset.'
          resp.content.push([])
        }
      } else {
        resp.status = '2003'
        resp.msg = 'Permission Notset.'
      }
      res.send(resp)
    }
  } catch (error) {
    console.log(error)
    resp.content = error
    res.send(resp)
  }
})

router.post('/user-management/users', async (req, res, next) => {
  try {
    const params = req.body
    let fName = params.firstname.trim()
    let lName = params.lastname.trim()
    const age = parseInt(params.age)
    const cnnDup = getConnection.createQueryBuilder()
    const itemsAleady = await cnnDup
      .select(`firstname, lastname`)
      .from(`${tbName}`)
      .where(`firstname = '${fName}'`)
      .andWhere(`lastname = '${lName}'`)
      .getRawOne()
    console.log('already ', itemsAleady)
    if (!itemsAleady) {
      let pwd = new Date().getTime().toString(36)
      const userid = fName.substring(0, 3) + lName.substring(0, 2)
      let usrMsg = `  ID : ${userid}  PASS: ${pwd}`
      console.log(usrMsg)
      pwd = crt
        .createHash('md5', 'revopms')
        .update(pwd)
        .digest('hex')
      let property = params.property ? params.property : 'FSDH'
      let branch = params.branch ? params.branch : 'HQ'
      // Generate รหัสพนักงาน  6 digit ใส่ id auto gen ป้องกันการใส่่เองใน db เพราะ chema ใส่ไว้เป็น int ฉะนั้น id ที่เป็นจุดทสนิยม จะทำให้ระบบไม่สามารถทำงานได้
      // select coalesce(MAX(id), 0) +1 as uu from username
      const username1 = new Username(
        fName,
        lName,
        age,
        params.status_record,
        params.status_marriaged,
        userid,
        pwd,
        property,
        branch
      )
      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .insert()
        .into(`${tbName}`)
        .values([username1])
        .returning([
          'firstname',
          'lastname',
          'age',
          'status_marriaged, userid, property, branch'
        ])
        .updateEntity(false)
        .execute()

      const cnnPerm = getConnection.createQueryBuilder()
      const itemPerm = await cnnPerm
        .insert()
        .into(`usrpermissionmst`)
        .values({
          propertyid: property,
          branchid: branch,
          userid: userid,
          usrpermission: ',,,,,,,',
          dev: 'Y',
          beta: 'N',
          status: 'A'
        })
        .returning(['userid'])
        .updateEntity(false)
        .execute()
      console.log('Default User Permission', itemPerm)
      resp.content.push(items)
      resp.status = '2000'
      resp.msg = `Success!  ${usrMsg}`
    } else {
      resp.status = '1000'
      resp.msg = `Duplicate ${fName}  ${lName}`
      resp.content = []
    }
    res.send(resp)
  } catch (error) {
    console.log(error)
    res.send(resp)
  }
})

router.put('/user-management/users/:id', async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      age,
      status_record,
      status_marraiged
    } = req.body
    const { id } = req.params
    const username1 = new Username(
      id,
      firstname,
      lastname,
      parseInt(age),
      status_record,
      status_marraiged
    )
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .update(`${tbName}`, username1)
      .where({ id: username1.id })
      .returning([
        'id',
        'firstname',
        'lastname',
        'age',
        'status_record',
        'status_marraiged'
      ])
      .updateEntity(true)
      .execute()

    resp.status = '2000'
    resp.msg = 'Success'
    resp.content.push(items)
    res.send(resp)
  } catch (error) {
    console.log('usr err', error)
    resp.content = []
    res.send(resp)
  }
})

router.delete('/user-management/users/:id', async (req, res, next) => {
  try {
    const params = req.params
    const id = params.id
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
        .from('username')
        .where('id = :id', { id })
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

module.exports = router

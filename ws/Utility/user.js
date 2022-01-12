const { _READ, _CREATE, _UPDATE, _DELETE } = require('../sys/service')
const perms = [_CREATE, _READ, _UPDATE, _DELETE]
const ckPerm = function(act, p, usrperm, option) {
  try {
    const arr = usrperm.split(option)
    const currentAct = arr[parseInt(p) - 1]
    return currentAct.includes(act)
  } catch (e) {
    // log
    console.log(e)
  }
}

const permissiosRoles = function(items, components) {
  const roles = []
  items.forEach((ele, i) => {
    let roleObj = {
      id: i + 1,
      name: ele.userid,
      child: []
    }
    ele.usrpermission = ele.usrpermission.split(',')
    const items = []
    ele.usrpermission.forEach((ele, j) => {
      if (ele) {
        let cmp = components.filter((e) => e.position === j + 1)
        if (cmp) {
          const ee = ele.split('')
          let obj = {
            id: j,
            name: cmp[0].name,
            permission: encodePerm(ee)
          }
          items.push(obj)
        }
      }
    })
    roleObj.child = items
    roles.push(roleObj)
  })
  return roles
}

const permissiosRole = function(items, components) {
  const roles = []
  items.forEach((ele, i) => {
    let roleObj = {
      id: i + 1,
      name: ele.name,
      child: []
    }
    ele.usrpermission = ele.usrpermission.split(',')
    const items = []
    ele.usrpermission.forEach((ele, j) => {
      if (ele) {
        let cmp = components.filter((e) => e.position === j + 1)
        cmp = cmp[0]
        if (cmp) {
          const ee = ele.split('')
          let obj = {
            id: j,
            name: cmp.name,
            icon: cmp.icon,
            permission: encodePerm(ee)
          }
          items.push(obj)
        }
      }
    })
    roleObj.child = items
    roles.push(roleObj)
  })
  return roles
}

const decodePerm = function(items) {
  let arrPerm = []
  items.forEach((ele, i) => {
    arrPerm[i] = ele === 'Y' ? perms[i] : ''
  })
  return arrPerm
}

const encodePerm = function(items) {
  let arrPerm = []
  perms.forEach((ele, i) => {
    const k = items.indexOf(ele)
    arrPerm[i] = k > -1 ? 'Y' : 'N'
  })
  return arrPerm
}

const binaryToJson = function(items) {
  return ''
}

const jsonToBinary = function(items) {
  return ''
}

const newPermission = function(){
  return ''
}

module.exports = {
  ckPerm,
  permissiosRoles,
  permissiosRole,
  decodePerm,
  encodePerm,
  jsonToBinary,
  binaryToJson,
  newPermission
}

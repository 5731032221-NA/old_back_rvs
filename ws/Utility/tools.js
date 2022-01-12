const { encodePerm } = require('../Utility/user')
const { ssLimit, ssTimestamp, durationHours } = require('../sys/session')
const makeComponentTree = function(items, option) {
  const tree = []
  const mappedArr = {}
  let arrElem = []
  let mappedElem = {}
  // First map the nodes of the array to an objec -> create a hash table.
  for (let i = 0, len = items.length; i < len; i++) {
    arrElem = items[i]
    const obj = {
      id: arrElem.componentid.trim(),
      parent: arrElem.parent.trim(),
      name: arrElem.name,
      children: []
    }
    mappedArr[arrElem.componentid] = obj
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id]
      if (mappedArr[mappedElem.parent]) {
        if (mappedArr[mappedElem.id] === mappedArr[mappedElem.parent]) {
          mappedArr[mappedElem.parent].name.push(mappedArr[mappedElem.id].name)
        }
        mappedArr[mappedElem.parent].children.push(mappedElem)
      } else {
        tree.push(mappedElem)
      }
    }
  }
  return tree
}

const CompTree = function(items, perm) {
  const tree = []
  const mappedArr = {}
  let arrElem = []
  let mappedElem = {}
  // First map the nodes of the array to an objec -> create a hash table.
  for (let i = 0, len = items.length; i < len; i++) {
    arrElem = items[i]
    const obj = {
      id: i,
      parent: arrElem.parent.trim(),
      name: arrElem.name.trim(),
      permission: perm,
      children: []
    }
    mappedArr[arrElem.componentid.trim()] = obj
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id]
      if (mappedArr[mappedElem.parent.trim()]) {
        mappedArr[mappedElem.parent.trim()].children.push(mappedElem)
      } else {
        tree.push(mappedElem)
      }
    }
  }
  console.log(tree)
  return tree
}

const tokenID = function(clientIp) {
  clientIp = '12456987'
  return clientIp
}

const stampTime = function(clientIp) {
  return new Date().getTime()
}

const userMenus = function(items, perms) {
  const tree = []
  const mappedArr = {}
  let arrElem = []
  let mappedElem = {}
  for (let i = 0, len = items.length; i < len; i++) {
    arrElem = items[i]
    let p = encodePerm(perms[parseInt(arrElem.position) - 1])
    const obj = {
      id: i,
      parent: arrElem.parent.trim(),
      slug: arrElem.slug.trim(),
      icon: arrElem.icon.trim(),
      permission: p,
      children: []
    }
    mappedArr[arrElem.componentid.trim()] = obj
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id]
      if (mappedArr[mappedElem.parent.trim()]) {
        mappedArr[mappedElem.parent.trim()].children.push(mappedElem)
      } else {
        tree.push(mappedElem)
      }
    }
  }
  return tree
}

const resetTime = function(sessionID) {
  sessionID = '11254444'
  let now = new Date()
  now.setMinutes(now.getMinutes() + 30) // timestamp
  now = new Date(now).toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok'
  })
  console.log('now ', now)
  console.log('stamp ', new Date(now).getTime())
  ssTimestamp[sessionID] = now
  let tt = 1601886377000 - 1601886225000
  console.log('time ', tt)
  return now
}


const isSessionLimited = function() {
  return ssLimit <= ssTimestamp.length
}

const readSessionID = function() {}

const releaseMem = function() {
  // clear ever 10 munuts
  // admin clear session id UI
  /*
    timestamp + sessiontimeout < currentTimestamp
    clear record in session json
   */
}

module.exports = {
  makeComponentTree,
  stampTime,
  tokenID,
  CompTree,
  userMenus,
  resetTime,
  releaseMem,
  isSessionLimited
}

const express = require('express')
const rtrCfgMst = express.Router()
const getConnection = require('typeorm')
// const ConfigMaster = require('../model/cfgmst').cfgmst
const Log = require('../Utility/log').Log
const pid = process.pid
const tbName = 'cfgmst'
const tag = '/config-masters'
const logFile = 'logfpath'
rtrCfgMst.get('/', async (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})

function listToTree(arr, options) {
  const tree = []
  const mappedArr = {}
  let arrElem = []
  let mappedElem = {}
  for (let i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i]
    const l = arrElem.description.split('-')
    const obj = {
      _id: arrElem.listname,
      parent: arrElem.parent,
      name: [
        {
          desc: l[0],
          lang: l[1]
        }
      ],
      _children: []
    }

    if (obj._id === obj.parent) {

      // let rr = mappedArr[arrElem.listname].name.find((e) => {

      let rr = mappedArr[obj.parent].name.find((e) => {
        return e.lang === obj.name[0].lang
      })
      if (!rr) {
        mappedArr[arrElem.listname].name.push(obj.name[0])
      }
    } else {
      mappedArr[arrElem.listname] = obj
    }
    mappedArr[arrElem.listname]._children = []
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id]
      if (mappedArr[mappedElem.parent]) {
        mappedArr[mappedElem.parent]._children.push(mappedElem)
      } else {
        tree.push(mappedElem)
      }
    }
  }
  return tree
}

rtrCfgMst.get('/config-masters', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: []
  }

  try {
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .where(`recordstatus != 'D'`)
      .getRawMany()
    const opt = {
      idKey: '_id',
      parentKey: 'parent',
      childrenKey: '_children'
    }
    const arr = listToTree(items, opt)
    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = arr
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(tbName, tag, tag, ' ', ` `, error, logFile)
    console.log(error)
    res.send(resp)
  }
})

rtrCfgMst.get('/config-masters/:id', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denine',
    content: []
  }

  const id = req.params.id.toUpperCase()
  // const userModule = req.rawHeaders['User-Agent'] + ',' + req.url + ',' + req.method
  // var legit = jsc.verify( param.authorization);
  // const strLog = `${userId}|'/user-management/users|${userModule}`
  try {
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .where(`TRIM(parent) = '${id.trim().toUpperCase()}'`)
      .andWhere(`recordstatus != 'D'`)
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
  } catch (error) {
    // data = 'DATABASE'+error
    // method, error number
    // error message ที่มี error number
    // lg = new Log()
    // lg.setLog(data)
    console.log('error', error)
    resp.content = error
    res.send(resp)
  }
})

rtrCfgMst.post('/config-masters', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: []
  }

  try {
    let { listName, parent, description } = req.body
    const arrValues = []
    const arrLangs = []
    listName = listName.trim().toUpperCase()
    const strAnd = ''
    description.forEach((e) => {
      arrValues.push({
        listname: listName,
        parent: parent.trim(),
        description: e.desc.trim() + '-' + e.lang.toUpperCase().trim(),
        category: '',
        value: '',
        recordstatus: 'I'
      })
    })
    const qrb = getConnection.createQueryBuilder()
    const items = await qrb
      .insert()
      .into(`${tbName}`)
      .values(arrValues)
      .returning('*')
      .updateEntity(false)
      .execute()
    resp.status = '2000'
    resp.msg = 'Save Success!'
    resp.content.push(items.raw[0])
    res.send(resp)
  } catch (error) {
    console.log(error)
    const data = `${tag}|${error}`
    const lg = new Log()
    lg.setLog(data)
    resp.msg = error
    res.send(resp)
  }
})

rtrCfgMst.delete('/config-masters/:id/:lang', async (req, res, next) => {
  const params = req.params
  const resp = {
    msg: 'ok',
    content: []
  }
  let id = params.id
  let lang = params.lang
  console.log('delete', params)

  try {
    let data = {
      recordstatus: 'D'
    }
    const cnn = getConnection.createQueryBuilder()
    const result = await cnn
      .createQueryBuilder()
      .update(`${tbName}`)
      .set(data)
      .where('TRIM(listname) = :id', { id })
      .andWhere(`TRIM(description) like '%-${lang.trim()}'`)
      .execute()
    res.send(resp)
  } catch (error) {
    console.log('error', error)
    resp.msg = error
    res.send(resp)
  }
})

rtrCfgMst.put('/config-masters/:id', async (req, res, next) => {
  const params = req.params
  const resp = {
    status: '0000',
    msg: 'ok',
    content: []
  }
  let id = params.id
  let { parent, description, descriptionNewLang } = req.body
  const arrUpdate = []
  const arrNew = []
  let whereUpdate = ''
  console.log('update', req.body)
  let data = req.body
  let valueUpdate = ''

  description.forEach((ele) => {
    console.log(ele)
    arrUpdate.push(
      ele.desc + '-' + ele.lang.toUpperCase()
    )
    valueUpdate = ele.desc + '-' + ele.lang.toUpperCase()
    whereUpdate += `description like '%-${ele.lang.toUpperCase()}'` + ' '
  })

  descriptionNewLang.forEach((ele) => {
    arrNew.push({
      listname: id,
      parent,
      description: ele.desc + '-' + ele.lang.toUpperCase(),
      recordstatus: ele.recordstatus
    })
  })

  try {
    const qrb = getConnection.createQueryBuilder()
    const items = []
    let itemsUpdate = []
    if (arrUpdate.length > 0) {
      console.log('arr update', arrUpdate)
      itemsUpdate = await qrb
        .update(`${tbName}`)
        .set({
          listname: id,
          parent: parent,
          description: arrUpdate[0]
        })
        .where(`TRIM(listname) = '${id}'`)
        .andWhere(whereUpdate)
        .returning('*')
        .updateEntity(true)
        .execute()
      if (itemsUpdate.affected) {
        items.push(itemsUpdate.raw[0])
        resp.msg = 'Update Success!'
      } else {
        resp.msg = 'Update not success!'
      }
    }
    const itemsNew = []
    if (arrNew.length > 0) {
      const itemsNew = await qrb
        .insert()
        .into(`${tbName}`)
        .values(arrNew)
        .returning(['listname', 'parent', 'description', 'category'])
        .updateEntity(false)
        .execute()
      resp.msg = 'Update Success!'
    }

    /* mark delete then insert */


    resp.status = '2000'

    resp.content.push(items)
    res.send(resp)
  } catch (error) {
    console.log(error)
    resp.msg = 'Failer'
    res.send(resp)
  }
})

module.exports = rtrCfgMst

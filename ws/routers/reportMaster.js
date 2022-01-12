const express = require('express')
const rtrCfgMst = express.Router()
const getConnection = require('typeorm')
// const ConfigMaster = require('../model/cfgmst').cfgmst
const Log = require( '../Utility/log' ).Log
const { userAuth } = require('../Utility/verify')
const { usrPerm} = require('../queryparser/user')
const pid = process.pid
const tbName = 'rmmst'
const tag = '/report-masters'
rtrCfgMst.get('/', async (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})
rtrCfgMst.get('/report-masters', async (req, res, next) => {
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
      .getRawMany()

    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = items
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(`${tag}|${error}`)
    console.log(error)
    res.send(resp)
  }
})

rtrCfgMst.get('/report-masters/:id', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denine',
    content: []
  }
  const id = req.params.id.toUpperCase()
  console.log(id)
  // const userModule = req.rawHeaders['User-Agent'] + ',' + req.url + ',' + req.method
  // var legit = jsc.verify( param.authorization);
  // const strLog = `${userId}|'/user-management/users|${userModule}`
  try {
    const connection = getConnection.createQueryBuilder()
    const items = await connection
      .select()
      .from(`${tbName}`)
      .getRawMany()

    resp.status = '2000'
    resp.msg = 'Success!'
    resp.content = items
    res.send(resp)
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

rtrCfgMst.post('/report-masters', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied!',
    content: []
  }

  try {
    // const params = req.body
    //   const { name, parent, desc, categ, lang, rcdStatus } = req.query
    let { listName, parent, description } = req.body
    const arrValues = []
    const arrLangs = []
    listName = listName.trim().toUpperCase()
    description.forEach((e) => {
      arrLangs.push(e.lang.trim().toUpperCase())
      arrValues.push({
        listname: listName,
        parent: parent.trim(),
        description: e.desc.trim() + '-' + e.lang.trim(),
        category: '',
        value: '',
        recordstatus: 'I'
      })
    })
    // arrLangs = "'" + arrLangs.join( "'" )+"'"

    /*
     const cfgMst = {
        listname: listName,
        parents: parent,
        description: arrDesc,
        recordStatus: 'I'
     }
      */
    // check duplicate
    const arrDup = []
    const arr = []

    const qrb = getConnection.createQueryBuilder()
    const dup = await qrb
      .select()
      .from(`${tbName}`)
      .where(`TRIM(listname) = '${listName}'`)
      .andWhere(`TRIM(description) LIKE '%-EN'`)
      .getRawMany()
    console.log('items', dup)

    const strDup = arrDup.join( ',' )

    if (dup.length === 0) {
      const items = await qrb
        .insert()
        .into(`${tbName}`)
        .values(arrValues)
        .returning(['listname', 'parent', 'description', 'category'])
        .updateEntity(false)
        .execute()
      resp.status = '2000'
      resp.msg = 'Save Success!'
      resp.content.push(items)
    } else {
      resp.status = '1000'
      resp.msg = `${listName} : ${strDup}  Already exists.`
    }
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

rtrCfgMst.delete('/report-masters/:id', async (req, res, next) => {
  const params = req.params
  const resp = {
    msg: 'ok',
    content: []
  }
  const id = params.id

  try {
    /**
       const result = await cnn
          .createQueryBuilder()
          .update(`${tbName}`)
          .set({ recordStatus: 'F' })
          .where('TRIM(listname) = :id', { id })
          .execute()
        await cnn.close()
     */
    /*
    const connection = getConnection.createQueryBuilder()
    const items = await connection
    */
    resp.content.push('delete ' + id)
    res.send(resp)
  } catch (error) {
    resp.msg = error
    res.send(resp)
  }
})

rtrCfgMst.put('/report-masters/:id', async (req, res, next) => {
  const params = req.params
  const resp = {
    status: '0000',
    msg: 'ok',
    content: []
  }
  const id = params.id
  const { p, listName, desc, lng, rStatus } = req.query

  /*
  const items = {
    listname: 'COCKTAIL',
    parent: 'WINE',
    desc: 'Cocktail',
    lang: 'EN',
    langs: [
      {
        lang: 'KR',
        desc: '칵테일 유리'
      },
      {
        lang: 'CN',
        desc: '雞尾酒杯。'
      },
      {
        lang: 'JP',
        desc: 'カクテルグラス'
      }
    ]
  }
*/

  const items = []
  const lname = items.listname
  try {
      const connection = getConnection.createQueryBuilder()
      const items = await connection
      .update(`${tbName}`)
      .set({
        listname: items.listname,
        parent: items.parent,
        description: dsc,
        recordstatus: 'A'
      })
      .where('TRIM(listname) = :lname', { lname })
      .returning('*')
      .updateEntity(true)
      .execute()
    const ds = result.raw[0]
    const arr = []
    arr.push({
      listname: ds.listName,
      parent: ds.parent,
      name: [
        {
          desc: ds.description,
          lang: ds.lang
        }
      ]
    })
    const d = []
    items.langs.forEach((ele) => {
      const dsc = ele.desc + '-' + ele.lang.toUpperCase()
      const obj = {
        listname: items.listname,
        parent: items.parent,
        description: dsc,
        recordstatus: 'A'
      }
      d.push(obj)
    })

    if (d.length > 0) {
      const dLang = await cnn
        .createQueryBuilder()
        .insert()
        .into(`${tbName}`)
        .values(d)
        .returning(`*`)
        .execute()
      const l = dLang.description.split('-')
      arr.name.push({
        desc: l[0],
        lang: l[1]
      })
    }
    resp.status = '2000'
    resp.content.push(item)
    res.send(resp)
  } catch (error) {
    resp.msg = error
    res.send(resp)
  }
})

module.exports = rtrCfgMst

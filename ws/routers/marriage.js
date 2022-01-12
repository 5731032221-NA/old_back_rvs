const express = require('express')
const router = express.Router()
const getConnection  = require('typeorm')
const MstMarriageStatus = require('../model/MstMarriageStatus').MstMarriageStatus
const Log = require('../Utility/log').Log
const pid = process.pid
router.get('/', (req, res, next) => {
  res.send(`process-${pid}--say-hi`)
})

router.get('/manage-status/marriage', async (req, res, next) => {
  const resp = {
    msg: 'ok',
    content: []
  }

  try {
    const connection =  getConnection.createQueryBuilder()
    const items = await connection
       .select()
       .from('mst_marriage_status')
       .getRawMany()
    resp.status = '2000'
    resp.msg = 'Success'
    resp.content.push(items)
    res.send(resp)
  } catch (error) {
    const lg = new Log()
    lg.setLog(`READ ERROR: ${error}`)
    console.log(error)
    resp.msg = 'Failer!'
    res.send(resp)
  }
})

router.get('/manage-status/marriage/:id', async (req, res, next) => {
  const resp = {
    msg: 'ok',
    content: []
  }
  console.log(req)
  let id = req.params.id
  id = parseInt(id)
  try {
    const connection =  getConnection.createQueryBuilder()
    const items =  await connection
          .select('u')
          .from('mst_marriage_status', 'u')
          .where('u.id = :id', { id })
          .getOne()
        cnn.close()
        console.log('item', items)
    resp.content.push( { getByID: items } )
    res.send(resp)
  } catch (error) {
     console.log(err)
        resp.content.push(err)
    resp.content = error
    res.send(resp)
  }
})

router.post('/manage-status/marriage/', async (req, res, next) => {
  const resp = {
    status: '0000',
    msg: 'Access Denied',
    content: []
  }
  // const module = '/manage-status/marriage/'
  // const params = req.body
  try {
    const { code, description, status } = req.query
      const connection =  getConnection.createQueryBuilder()
      const mstMar = new MstMarriageStatus(0, code, description, status)
      const items = await connection
        .insert()
        .into(`${tbName}`)
        .values(arrValues)
        .returning(['listname', 'parent', 'description', 'category'])
        .updateEntity(false)
        .execute()
        resp.status = '2000'
        resp.msg = 'Success!'
        resp.content.push(items)
        res.send( resp )
  } catch (error) {
      console.log(error)
      res.send(resp)
  }
})

router.put('/manage-status/marriage/:id', async (req, res, next) => {
  const resp = {
    msg: 'ok',
    content: []
  }

  try {
    // const { description, status } = req.body
    const { code, description, status } = req.query
    const { id } = req.params
    const mstMar = new MstMarriageStatus(id, code, description, status)
    const connection =  getConnection.createQueryBuilder()
    const items = await connection
      .update('mst_marriage_status', mstMar)
      .where({ id: mstMar.id })
      .returning(['id', 'code', 'description', 'status'])
      .updateEntity(true)
      .execute()
      resp.content.push( items )
      res.send(resp)
  } catch (error) {
    resp.content = error
    res.send(resp)
  }
})
router.delete('/manage-status/marriage/:id', async (req, res, next) => {
  const params = req.params
  const resp = {
    msg: 'ok',
    content: []
  }
  const id = params.id

  try {
        const connection =  getConnection.createQueryBuilder()
        const items = await connection
          .delete()
          .from('mst_marriage_status')
          .where('id = :id', { id })
          .execute()
          resp.content.push(items)
  } catch ( error ) {
    resp.content.push('delete ' + err)
    resp.msg = 'Failer!'
    res.send(resp)
  }
})

module.exports = router

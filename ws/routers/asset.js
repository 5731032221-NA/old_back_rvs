const express = require('express')
const router = express.Router()
/*************************************/
const getConnection = require('typeorm')
const cors = require('cors');
/*************************************/
let resp = {
    status: '0000',
    msg: 'Access Denied',
    content: []
  }

router.use(cors({
  origin: '*'
}));

router.get('/login/asset', async (req, res, next) => {
    try {
      resp.content = [];
      const connection = getConnection.createQueryBuilder()
      const asset = await connection
        .from(`asset`)
        .getRawMany()
    
     
      resp.content.push(asset[0])
      resp.status = '2000'
      resp.msg = 'Success'
      res.send(resp)
    } catch (error) {
      console.log(error)
      res.send(resp)
    }
  })

  router.put("/asset", async (req, res, next) => {
    try {
    
     
      const connection = getConnection.createQueryBuilder();
      const update = await connection
        .update("asset", req.body)
        .updateEntity(true)
        .execute();
  
      resp.content.push(update);
      resp.status = "2000";
      resp.msg = "Success";
      res.send(resp);
    } catch (error) {
      console.log(error);
      res.send(resp);
    }
  });

  module.exports = router
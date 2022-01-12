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

router.delete('/computerprinterbyid/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        const connection = getConnection.createQueryBuilder()
        const drop = await connection
            .delete()
            .from('computerprinter')
            .where('id  = :id', { id })
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

router.delete('/registerdhardwarebyid/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        const connection = getConnection.createQueryBuilder()
        const drop = await connection
            .delete()
            .from('registerdhardware')
            .where('id  = :id', { id })
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

router.put('/registerdhardwarebyid/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        const cnnDup = getConnection.createQueryBuilder()
        const  itemsAleady = await cnnDup
         .select(`code`)
         .from(`registerdhardware`)
         .where(`code = '${req.body.code}'`)
         .andWhere(`id != '${id}'`)
         .getRawOne()

      
         if (!itemsAleady) {
        const connection = getConnection.createQueryBuilder()
        const update = await connection
            .update('registerdhardware',req.body)
            .where('id  = :id', { id })
            .updateEntity(true)
            .execute()

        resp.content.push(update)
        resp.status = '2000'
        resp.msg = 'Success'
         }else {
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

router.put('/computerprinterbyid/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        const cnnDup = getConnection.createQueryBuilder()
        const  itemsAleady = await cnnDup
         .select(`username`)
         .from(`computerprinter`)
         .where(`computercode = '${req.body.computercode}'`)
         .andWhere(`username = '${req.body.username}'`)
         .andWhere(`devicecode = '${req.body.devicecode}'`)
         .andWhere(`id != '${id}'`)
         .getRawOne()


         if(!itemsAleady){
            const connection = getConnection.createQueryBuilder()
            const update = await connection
                .update('computerprinter',req.body)
                .where('id  = :id', { id })
                .updateEntity(true)
                .execute()
    
            resp.content.push(update)
            resp.status = '2000'
            resp.msg = 'Success'
         }else{
            resp.status = '1000'
            resp.msg = `Duplicate ${req.body.username} ${req.body.computercode} ${req.body.devicecode}`
            resp.content = []
         }

       
        res.send(resp)
    } catch (error) {
        console.log(error)
        res.send(resp)
    }
})


router.get('/listcomputerprinter', async (req, res, next) => {
    try {


        const connection = getConnection.createQueryBuilder()
        const items = await connection
            .select('id,username,computercode,action,devicecode,tray ,remark,specialstrings,propertycode')
            .from(`computerprinter`)
            .getRawMany()
        resp.content.push(items)
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

router.get('/listregisterdhardware', async (req, res, next) => {
    try {
        const connection = getConnection.createQueryBuilder()
        const items = await connection
            .select('id,propertycode,code,type,name,macaddress,ip')
            .from(`registerdhardware`)
            .getRawMany()
        resp.content.push(items)
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


router.post('/registerdhardware', async (req, res, next) => {
    try {


        const { code } = req.body;

        const cnnDup = getConnection.createQueryBuilder()
        const  itemsAleady = await cnnDup
         .select(`code`)
         .from(`registerdhardware`)
         .where(`code = '${code}'`)
         .getRawOne()

         console.log("itemsAleady:",itemsAleady);

       if(!itemsAleady){
        const connection = getConnection.createQueryBuilder()
        const insertdata = await connection
            .insert()
            .into(`registerdhardware`)
            .values(req.body)
            .updateEntity(false)
            .execute()
        resp.content.push(insertdata)
        // }
        resp.status = '2000'
        resp.msg = 'Success!'
       }else{
        resp.status = '1000'
        resp.msg = `Duplicate`
        resp.content = []
       }
       
        res.send(resp)

    } catch (error) {
        console.log('err users', error)
        // const lg = new Log()
        // lg.setLog(`${tagType}|${error}`)
        resp.msg = 'Failer'
        res.send(resp)
    }
})

router.post('/computerprinter', async (req, res, next) => {
    try {


   
        const cnnDup = getConnection.createQueryBuilder()
        const  itemsAleady = await cnnDup
         .select(`username`)
         .from(`computerprinter`)
         .where(`computercode = '${req.body.computercode}'`)
         .andWhere(`username = '${req.body.username}'`)
         .andWhere(`devicecode = '${req.body.devicecode}'`)
         .getRawOne()


         if(!itemsAleady){
            const connection = getConnection.createQueryBuilder()
            const insertdata = await connection
                .insert()
                .into(`computerprinter`)
                .values(req.body)
                .updateEntity(false)
                .execute()
            resp.content.push(insertdata)
            // }
            resp.status = '2000'
            resp.msg = 'Success!'
         }else{
            resp.status = '1000'
            resp.msg = `Duplicate ${req.body.username} ${req.body.computercode} ${req.body.devicecode}`
            resp.content = []
         }

    
        res.send(resp)

    } catch (error) {
        console.log('err users', error)
        // const lg = new Log()
        // lg.setLog(`${tagType}|${error}`)
        resp.msg = 'Failer'
        res.send(resp)
    }
})

module.exports = router

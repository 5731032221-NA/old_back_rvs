"use strict"
const { getConnection, components, SVC, getMsg } = require('../../config/sysHeader')
const {
    _READ,
    _CREATE,
    _UPDATE,
    _DELETE,
    _SEPARATE
} = require('../../config/service')
const CHK = require('../../queryparser/database').createCheckContraint
const Log = require('../../sys/Log').Log
const _table = components.propertymaster._TABLES.default
const typeModule = 'Property'
const typeFunctions = '/property-masters'
const logFile = 'logfpath'
class PropertyMst {
    constructor() {
        this.result = {
            status: SVC.DEFAULT.code,
            msg: SVC.DEFAULT.msg,
            content: [],
            items: []
        }
    }

    /* 
    explisit: ระบุ type
    implisit: ไม่ระบุ type
    
    รวม 
    1. insert blank record
    2. user auto inrement แล้วนำมา เป็น ref ในการ update
    */
    async add(obj) {
        console.log(obj)
        try {
            /* const connection = getConnection.createQueryBuilder();
            const dup = await connection
                .select('rmno')
                .from(`${_table}`)
                .where(`TRIM(propertycode) = '${obj.rmproperty}'`)
                .andWhere(`TRIM(chaincode) = '${obj.rmno}'`)
                .andWhere(`TRIM(brandcode) = '${obj.rmno}'`)
                .getRawMany();
            if (dup.length === 0) {
            */
            const data = {
                propertycode: obj.propertycode ? obj.propertycode : '*',
                propertyname: obj.propertyname ? obj.propertyname : '',
                customerid: obj.customerid ? obj.customerid : '1',
                chaincode: obj.chaincode ? obj.chaincode : '',
                brandcode: obj.brandcode ? obj.brandcode : '',
                starrating: obj.starrating ? obj.starrating : '',
                city: obj.city ? obj.city : '',
                postalcode: obj.postalcode ? obj.postalcode : '',
                roomcount: obj.roomcount ? obj.roomcount : 0,
                timezone: obj.timezone ? obj.timezone : '',
                streetaddress: obj.streetaddress ? obj.streetaddress : '',
                areacitycode: obj.areacitycode ? obj.areacitycode : '',
                countrycode: obj.countrycode ? obj.countrycode : 'TH',
                propertypicture: obj.propertypicture ? obj.propertypicture : ''
            };
            console.log(data)
            const connection = getConnection.createQueryBuilder();
            const items = await connection
                .insert()
                .into(`${_table}`)
                .values(data)
                .returning('*')
                .updateEntity(true)
                .getSql()
            console.log('items ', items)
            // .execute();
            /*
              .onConflict(`("id") DO NOTHING`)
              .onConflict(`("id") DO UPDATE SET "title" = :title`)
              doesn't work with MySQL.
              use
                .orIgnore()
                .orUpdate()
             */
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_CREATE], obj.propertycode)
            this.result.content = items.raw
            //this.result.content = []
            /* 
              } else {
                  this.result.items.push(obj.rmno);
                  this.result.status = SVC.DUPLICATE.code;
                  this.result.msg = getMsg(SVC.DUPLICATE.msg, `${obj.rmproperty} - ${obj.rmno}`);
              }
               */
            console.log('result', this.result)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _CREATE, 'room master', error, logFile)
            console.log('err rmmst', error)
            return this.result
        }
    }

    /*
    params:
        id เงื่อนไขที่ใช้ในการ select เช่น
            id = '*' คือ retrive ข้อมูล room ทั้งหมด
            id =  8020 คือ retrive ข้อมูล room หมายเลข 8020
        medias ชนิดของ viewpoint(โหมดประหยัดพลังงาน) ใช้ในการกำหนดจำนวน selected เช่น
            medias = mobile คือ select field = ['id',
                                                'firstname',
                                                'lastname',
                                                'age',
                                                'status_record'
                                               ]
     
            medias = desktop คือ selectfield = [
                                            'id',
                                            'firstname',
                                            'lastname',
                                            'age',
                                            'status_record',
                                            'status_marriaged',
                                            'property',
                                            'branch',
                                            'userid'
                                        ]
    */

    async views(chain, brand, property, userid) {
        try {
            /* 
                        const queryRunner = getConnection.createQueryRunner()
                        await queryRunner.connect()
                        table = await queryRunner.getTable('rminv')
                         */
            /*  CHK('username', 'property', `username = 'FSDH' `) */

            /* 
            // Exp.
                cnstr = Mr.
                params = Mrs.            
            */

            // ใช้ * เพื่อ performance
            let where = ' 1=1 '
            /* 
            if (userid !== '*') {
                where += ` AND rmtypeid = '${userid}' `
            }
    
            if (property !== '*') {
                where += ` AND rmproperty = '${property}' `
            }
    
            if (brand !== '*') {
                where += ` AND rmbranchid = '${brand}' `
            }
    
            if (chain !== '*') {
                where += ` AND chainid = '${chain}' `
            } */

            /*
            End where clause 
            where += ` AND  delete = 'NO' `
            */


            // .select(`ฟิลด์ที่จะใช้แบ่งด้วย commar ตามมาตรฐานของ typeORM`)
            /* creat ได้อย่างเดียวแยกเป็นอีก ฟอร์ม create */

            let selectFields = [
                'propertycode',
                'propertyname',
                'chaincode',
                'brandcode',
                'starrating',
                'city',
                'postalcode',
                'roomcount',
                'timezone',
                'streetaddress',
                'areacitycode',
                'propertypicture'
            ]
            // address แปลง / เป็น อักขระพิเศษ $ แทน
            /*
                prevment 
            */
            const connection = getConnection.createQueryBuilder()
            selectFields = selectFields.join(',')
            const items = await connection
                .select(selectFields)
                .from(`${_table}`)
                .where(`${where}`)
                .getRawMany()
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_READ], typeModule)
            this.result.content = items
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _READ, `${chain} ${brand} ${property} ${userid}`, error, logFile)
            console.log('err rmmst', error)
            return this.result
        }
    }

    async update(id, obj) {
        try {
            console.log(id)
            const data = {
                roomcount: obj.roomcount ? parseInt(obj.roomcount) : 0
            };
            const connection = getConnection.createQueryBuilder();
            const items = await connection
                .update(`${_table}`)
                .set(data)
                .where(`propertycode = '${id.trim()}'`)
                .updateEntity(true)
                .execute();
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_UPDATE], id)
            this.result.content = items

            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _UPDATE, `${id}`, error, logFile)
            console.log(error)
            console.log('err rmmst', error)
            return this.result
        }
    }


    async remove(propid) {
        try {
            //  let where = `propertyid = '${propid}' AND rmno = '${roomno}' AND rmstatus <> 'IN'`
            let where = `propertycode = '${propid}'`
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .delete()
                .from('username')
                .where(`${where}`)
                .execute()
            console.log(items)
            resp.content.push(items)
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_DELETE], `${propid}`)
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _DELETE, `${propid}`, error, logFile)
            console.log(error)
            console.log('err rmmsts', error)
            return this.result
        }
    }

}

module.exports = {
    PropertyMst
}
const { getConnection, components, SVC, getMsg } = require('../../config/sysHeader')
const {
    _READ,
    _CREATE,
    _UPDATE,
    _DELETE,
    _SEPARATE
} = require('../../config/service')
const Log = require('../../sys/Log').Log
const _table = components.room.masters._TABLES.default
const typeModule = 'Rooms Inventory'
const typeFunctions = '/room-inv'
const logFile = 'logfpath'
class Inventory {
    constructor() {
        this.result = {
            status: SVC.DEFAULT.code,
            msg: SVC.DEFAULT.msg,
            content: [],
            items: []
        }
    }
    async add(obj) {
        try {
            const connection = getConnection.createQueryBuilder();
            const dup = await connection
                .select('rmno')
                .from(`${_table}`)
                .where(`TRIM(rmproperty) = '${obj.rmproperty}'`)
                .andWhere(`TRIM(rmno) = '${obj.rmno}'`)
                .getRawMany();
            if (dup.length === 0) {
                const data = {
                    rmproperty: obj.rmproperty,
                    rmno: obj.rmno,
                    rmtypeid: obj.rmtypeid,
                    floorid: obj.floorid,
                    wingid: obj.wingid,
                    buildingid: obj.buildingid,
                    exposureid: obj.exposureid,
                    rmdesc: obj.rmdesc ? obj.rmdesc : '',
                    rmsqsize: obj.rmsqsize ? obj.rmsqsize : 0,
                    rmseq: obj.rmseq ? obj.rmseq : 10,
                    rmstatus: obj.rmstatus ? obj.rmstatus : '',
                    rmattribute: obj.rmattribute ? obj.rmattribute : ''
                };

                const items = await connection
                    .insert()
                    .into(`${_table}`)
                    .values(data)
                    .returning('*')
                    .updateEntity(true)
                    .execute();

                this.result.status = SVC.CRUD.code
                this.result.msg = getMsg(SVC.CRUD.msg[_CREATE], obj.rmno)
                this.result.content = items.raw
            } else {
                this.result.items.push(obj.rmno);
                this.result.status = SVC.DUPLICATE.code;
                this.result.msg = getMsg(SVC.DUPLICATE.msg, `${obj.rmproperty} - ${obj.rmno}`);
            }
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

    async views(chain, brand, property, roomtype, roomno) {
        try {
            let where = ' 1=1 '
            if (roomno !== '*') {
                where += ` AND rmno = '${roomno}' `
            }

            if (roomtype !== '*') {
                where += ` AND rmtypeid = '${roomtype}' `
            }

            if (property !== '*') {
                where += ` AND rmproperty = '${property}' `
            }

            if (brand !== '*') {
                where += ` AND rmbranchid = '${brand}' `
            }

            if (chain !== '*') {
                where += ` AND chainid = '${chain}' `
            }


            const connection = getConnection.createQueryBuilder()
            let selectFields = [
                'rmproperty',
                'rmno',
                'rmtypeid',
                'floorid',
                'buildingid',
                'wingid',
                'exposureid',
                'rmdesc',
                'rmsqsize',
                'rmseq',
                'rmstatus',
                'rmattribute'
            ]
            selectFields = selectFields.join(',')
            const items = await connection
                .select(`${selectFields}`)
                .from(`${_table}`)
                .where(`${where}`)
                .getRawMany()
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_READ], typeModule)
            this.result.content = items
            console.log(await this.validate())
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _READ, `${chain} ${brand} ${property} ${roomtype} ${roomno}`, error, logFile)
            console.log('err rmmst', error)
            return this.result
        }
    }

    async update(id, obj) {
        try {
            const connection = getConnection.createQueryBuilder();
            const items = await connection
                .update(`${_table}`)
                .set(obj)
                .where(`rmproperty = '${id.trim()}'`)
                .andWhere(`rmno = '${obj.rmno.trim()}'`)
                .returning([
                    'propertyid',
                    'rmno',
                    'floorid',
                    'wingid',
                    'buildingid',
                    'exposureid',
                    'rmdesc',
                    'rmsqsize',
                    'rmseq',
                    'rmstatus'
                ])
                .updateEntity(true)
                .execute();
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_UPDATE], obj.rmno)
            this.result.content = items
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _UPDATE, `${id} ${obj.rmno}`, error, logFile)
            console.log(error)
            console.log('err rmmsts', error)
            return this.result
        }
    }


    async remove(propid, roomno) {
        try {
            let where = `propertyid = '${propid}' AND rmno = '${roomno}' AND rmstatus <> 'IN'`
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .delete()
                .from('username')
                .where(`${where}`)
                .execute()
            console.log(items)
            resp.content.push(items)
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_DELETE], `${propid} ${roomno}`)
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _DELETE, `${propid} ${roomno}`, error, logFile)
            console.log(error)
            console.log('err rmmsts', error)
            return this.result
        }
    }

    async validate() {
        return await 1 === 1
    }
}

module.exports = {
    Inventory
}
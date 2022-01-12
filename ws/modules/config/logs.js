"use strict"
const { getConnection, components, SVC, getMsg } = require('../../config/sysHeader')
const {
    _READ,
    _CREATE,
    _UPDATE,
    _DELETE,
    _SEPARATE
} = require('../../config/service')
const Log = require('../../sys/Log').Log
const _table = components.logsmaster._TABLES.default
const typeModule = 'Property'
const typeFunctions = '/property-masters'
const logFile = 'logfpath'
class LogMst {
    constructor() {
        this.result = {
            status: SVC.DEFAULT.code,
            msg: SVC.DEFAULT.msg,
            content: [],
            items: []
        }
    }

    async add(obj) {
        console.log(obj)
        try {
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
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_CREATE], obj.propertycode)
            this.result.content = items.raw[0]
            console.log('result', this.result)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _CREATE, 'logs master', error, logFile)
            console.log('err log', error)
            return this.result
        }
    }

    async views(id) {
        try {
            let where = ' 1=1 '
            if (id !== '*') {
                where += `logbid = ${id}`
            }
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
            const connection = getConnection.createQueryBuilder()
            selectFields = selectFields.join(',')
            const items = await connection
                .select()
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
    LogMst
}
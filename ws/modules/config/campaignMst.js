const { getConnection, components, SVC, getMsg } = require('../../config/sysHeader')
const {
    _READ,
    _CREATE,
    _UPDATE,
    _DELETE,
    _SEPARATE
} = require('../../config/service')
const Log = require('../../sys/Log').Log
const CmpgMst = require('../../model/cmpgMst').CmpgMst
const { cmpgMoc } = require('../../Utility/campaignMoc')
const { el } = require('date-fns/locale')
const _table = components.campaign.master._TABLES.default
const typeModule = 'Campaign'
const typeFunctions = '/campaing-masters'
const logFile = 'logfpath'
class CampaignMst {
    constructor() {
        this.result = {
            status: SVC.DEFAULT.code,
            msg: {
                "subject": "Campaign Header",
                "verb": "",
                "obj": "",
                "adj": SVC.DEFAULT.msg,
                "adv": ""
            },
            content: [],
            items: []
        }
    }

    async add(obj) {
        try {
            if (obj.startdate.trim() > obj.enddate.trim()) {
                this.result.msg.obj = obj.startdate
                this.result.msg.adv = "Invalid"
                this.result.items.push(obj.startdate)
                this.result.status = SVC.DUPLICATE.code
            } else {
                let CGMST = new CmpgMst(obj)
                let data = await CGMST.apiToDB()
                const connection = getConnection.createQueryBuilder();
                let items = await connection
                    .insert()
                    .into(`${_table}`)
                    .values(data)
                    .returning('*')
                    .updateEntity(true)
                    .execute();
                this.result.status = SVC.CRUD.code
                this.result.content = items.raw
                this.result.msg.adj = "Fully"
                this.result.msg.adv = "Success"
                console.log('result', this.result)
            }
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _CREATE, 'campaign header', error, logFile)
            console.log('err campaign header', error)
            return this.result
        }
    }

    async views(obj) {
        console.log(obj)
        try {
            /* เพิ่ม check valid parameter of page and limit [*|0-9] */
            let where = ' 1=1 '
            let page = 1
            let limit = 100
            let selectFields = [
                'cmpgmstid',
                'name',
                'detail',
                'strdate',
                'strtime',
                'enddate',
                'endtime',
                'status',
                'qtyeachtime'
            ]

            if (obj.id !== '*') {
                where += ` AND cmpgmstid = '${obj.id}' `
                selectFields = [
                    'cmpgmstid',
                    'name',
                    'detail',
                    'strdate',
                    'strtime',
                    'enddate',
                    'endtime',
                    'status',
                    'qtyeachtime'
                ]
            }

            if (obj.page === '*' || obj.limit === '*') {
                page = 1
                limit = 100
            }

            if (obj.brand !== '*') {
                where += ` AND brandcode = '${obj.brand}'`
            } else {
                where += ` AND brandcode = 'FSDH'`
            }
            where += ` AND remark <> 'D'`
            let cnnCount = getConnection.createQueryBuilder()
            let cnt = await cnnCount.select(`COUNT(cmpgmstid)`, 'count').from(`${_table}`).where(`remark <> 'D'`).getRawOne()
            let connection = getConnection.createQueryBuilder()
            selectFields = selectFields.join(',')
            const items = await connection
                .select(`${selectFields}`)
                .from(`${_table}`)
                .where(`${where}`)
                .orderBy('strdate', 'ASC')
                .getRawMany()
            this.result.status = SVC.CRUD.code
            let msg = {
                "subject": "Campaign Header",
                "verb": "Read",
                "obj": "",
                "adj": "List",
                "adv": "Success"
            }
            this.result.msg = msg
            let CGMST = new CmpgMst()
            this.result.content = await CGMST.dbToAPI(items)
            this.result.total = cnt.count
            return this.result
        } catch (error) {
            // const lg = new Log()
            //lg.setLog(_table, typeModule, typeFunctions, _READ, `${ chain } ${ brand } ${ property } ${ roomtype } ${ roomno }`, error, logFile)
            console.log('err rmmst', error)
            return this.result
        }
    }

    async update(obj) {
        console.log('mst update')
        try {
            if (obj.startdate.trim() > obj.enddate.trim()) {
                let msg = {
                    "subject": "Campaign Header",
                    "verb": "Update",
                    "obj": obj.startdate,
                    "adj": "",
                    "adv": "Invalid"
                }
                this.result.msg = msg
                this.result.items.push(obj.startdate)
                this.result.status = SVC.DUPLICATE.code
            } else {
                let msg = {
                    "subject": "Campaign Header",
                    "verb": "Update",
                    "obj": "",
                    "adj": "Un",
                    "adv": "Success"
                }
                console.log('obj update', obj)
                let CGMST = new CmpgMst(obj)
                let data = await CGMST.apiToDB()
                const connection = getConnection.createQueryBuilder();
                let items = await connection
                    .update(`${_table}`)
                    .set(data)
                    .where(`cmpgmstid = ${obj.campaignID}`)
                    .returning('*')
                    .updateEntity(true)
                    .execute();
                this.result.status = SVC.CRUD.code
                this.result.content = await CGMST.dbToAPI(items.raw)
                if (items.affected === 1) {
                    msg = {
                        "subject": "Campaign Header",
                        "verb": "Update",
                        "obj": "",
                        "adj": "Fully",
                        "adv": "Success"
                    }
                }

                this.result.msg = msg
            }
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _UPDATE, obj, error, logFile)
            console.log(error)
            console.log('err campaign header', error)
            return this.result
        }
    }


    async remove(obj) {
        console.log(obj)
        try {
            let data = {
                status: 'N',
                remark: 'D'
            }
            let msg = ''
            const cnnchild = getConnection.createQueryBuilder()
            const result = await cnnchild.select(`cmpgdtlid`)
                .from(`cmpgdtl`)
                .where(`cmpgmstid = ${obj.id}`)
                .getRawMany()

            if (result.length === 0) {
                const connection = getConnection.createQueryBuilder()
                const items = await connection
                    .update(`${_table}`)
                    .set(data)
                    .where(`cmpgmstid = ${obj.id}`)
                    .returning('*')
                    .updateEntity(true)
                    .execute();
                this.result.content.push(items)
                console.log(items)
                msg = {
                    "subject": "Campaign Header",
                    "verb": "Delete",
                    "obj": "",
                    "adj": "Fully",
                    "adv": "Success"
                }
                this.result.status = SVC.CRUD.code
            } else {
                msg = {
                    "subject": "Campaign Header",
                    "verb": "Delete",
                    "obj": "",
                    "adj": "Un",
                    "adv": "Success"
                }
            }

            this.result.msg = msg

            return this.result
            // this.result.msg = getMsg(SVC.CRUD.msg[_DELETE], `${propid} ${roomno}`)
        } catch (error) {
            /*
                const lg = new Log()
                lg.setLog(_table, typeModule, typeFunctions, _DELETE, `${propid} ${roomno}`, error, logFile)
            */
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
    CampaignMst
}
const { getConnection, components, SVC, getMsg } = require('../../config/sysHeader')
const {
    _READ,
    _CREATE,
    _UPDATE,
    _DELETE,
    _SEPARATE
} = require('../../config/service')
const uri = require('url')
const Log = require('../../sys/Log').Log
const { codeMst } = require('../../model/CodeMst')
const _table = components.campaign.code._TABLES.default
const typeModule = 'Code Master'
const typeFunctions = '/campaign-code'
const logFile = 'logfpath'
class CodeMst {
    constructor() {
        this.result = {
            status: SVC.DEFAULT.code,
            msg: {
                "subject": "Campaign Code",
                "verb": "Access",
                "obj": "",
                "adj": "",
                "adv": "Denied"
            },
            content: {
                page: 1,
                limit: 0,
                total: 0,
                detail: []
            },
            option: [],
            items: []
        }
        /*      
        this.result = {
            status: SVC.DEFAULT.code,
            msg: SVC.DEFAULT.msg,
            content: [],
            option: [],
            items: []
        }
        */
    }

    async add(obj) {
        try {
            console.log(obj)
            this.result.msg = {
                "subject": "Campaign Code",
                "verb": "Creaated",
                "obj": "",
                "adj": "",
                "adv": ""
            }
            if (obj.startdate > obj.enddate) {
                this.result.msg.obj = `The start date must more than`
                this.result.msg.adj = `must more than`
                this.result.msg.adv = `the end date`
            } else {
                const cnnDtlPeriod = getConnection.createQueryBuilder();
                const itemDtl = await cnnDtlPeriod
                    .select(`strdate, enddate`)
                    .from(`cmpgdtl`)
                    .where(`cmpgdtlid = ${obj.campaignDtlID}`)
                    .andWhere(`cmpgdtl.strdate <= '${obj.startdate}'`)
                    .andWhere(`cmpgdtl.enddate >= '${obj.enddate}'`)
                    .getRawMany();
                itemDtl.length = 0
                if (itemDtl.length > 0) {
                    this.result.status = SVC.CRUD.code
                    this.result.msg.obj = `Invalid Date.`
                } else {
                    const connection = getConnection.createQueryBuilder()
                    let CDM = new codeMst(obj)
                    let data = await CDM.apiToDB()
                    const items = await connection
                        .insert()
                        .into(`${_table}`)
                        .values(data)
                        .returning('*')
                        .updateEntity(true)
                        .execute();
                    this.result.status = SVC.CRUD.code
                    this.result.msg.adv = "Fully"
                    let oo = await CDM.dbToAPI(items.raw)
                    console.log(oo)
                }
            }
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _CREATE, 'code master', error, logFile)
            console.log('err code master', error)
            return this.result
        }
    }

    async views(params) {
        try {
            console.log('views', params)
            let cid = params.cid
            let dtlid = params.dtlid
            let extra = params.extra.trim() || ''
            let page = 1
            let limit = 100
            let exts = ''
            let where = ' 1=1 '
            if (extra.trim() && extra.trim() !== '*') {
                exts = uri.parse(`/extra?${extra}`, { parseQueryString: true }).query
                page = exts.page
                limit = exts.limit
            }
            if (cid !== '*') {
                where += ` AND cmstid = '${cid}' `
            }

            if (dtlid !== '*') {
                where += ` AND cmpgdtlid = '${dtlid}' `
            }

            let cnnCount = getConnection.createQueryBuilder()
            let cnt = await cnnCount.select(`COUNT(cmstid)`, 'count').from(`${_table}`).getRawOne()
            let selectFields = [
                'cmstid',
                'cmpgdtlid',
                'promocode',
                'strdate',
                'enddate',
                'mkt',
                'source',
                'channel',
                'profiles',
                'qty',
                'remark',
                'status'
            ]
            selectFields = selectFields.join(',')
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .select(`${selectFields}`)
                .from(`${_table}`)
                .where(`${where}`)
                .andWhere(`status = 'Y'`)
                // .skip(`${parseInt(page)}`).take(`${parseInt(limit)}`)
                .orderBy('strdate')
                .getRawMany()

            this.result.status = SVC.CRUD.code
            // this.result.msg = getMsg(SVC.CRUD.msg[_READ], typeModule)
            let msg = {
                "subject": "Campaign Code",
                "verb": "Read",
                "obj": "",
                "adj": "List",
                "adv": "Success"
            }
            this.result.content.page = page
            this.result.content.limit = limit
            this.result.content.total = cnt.count
            let CDM = new codeMst()
            this.result.content.detail = await CDM.dbToAPI(items)
            this.result.msg = msg
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _READ, `${params}`, error, logFile)
            console.log('err ' + _table, error)
            return this.result
        }
    }

    async update(obj) {
        try {
            console.log('code update', obj)
            this.result.msg.subject = 'Code master'
            this.result.msg.verb = 'Update'
            if (obj.startdate.trim() > obj.enddate.trim()) {
                this.result.msg.obj = 'The Start date'
                this.result.msg.adv = 'Invalid'
            } else {
                let CDM = new codeMst(obj)
                let data = await CDM.apiToDB()
                const connection = getConnection.createQueryBuilder();
                const items = await connection
                    .update(`${_table}`)
                    .set(data)
                    .where(`cmstid = ${obj.codeID}`)
                    .returning('*')
                    .updateEntity(true)
                    .execute()
                console.log('item update', items)
                this.result.status = SVC.CRUD.code
                this.result.content.detail = await CDM.dbToAPI(items.raw)
                this.result.msg.adv = 'Fully'
                this.result.msg.adj = 'Success'
            }
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _UPDATE, `${obj.code}`, error, logFile)
            console.log(error)
            console.log('err code master', error)
            return this.result
        }
    }


    async remove(obj) {
        console.log('remove', obj)
        try {
            let oo = {
                status: 'N',
                remark: 'D'
            }
            this.result.msg.subject = 'Remove'
            this.result.msg.adj = 'Success'
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .update(`${_table}`)
                .set(oo)
                .where(`cmstid = '${obj.id}'`)
                .returning('*')
                .updateEntity(true)
                .execute()
            this.result.msg.adv = 'Fully'
            console.log('items delete', items)
            if (!items.raw[0].affected) {
                this.result.msg.adv = 'Un'
            }
            this.result.status = SVC.CRUD.code
            this.result.content.data = []
            this.result.msg.verb = 'Delete'
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _DELETE, `${obj.id}`, error, logFile)
            console.log(error)
            console.log('err code master', error)
            return this.result
        }
    }

    async validate() {
        return await 1 === 1
    }
}

module.exports = {
    CodeMst
}
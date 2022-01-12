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
const cmpgDtl = require('../../model/cmpgDtl').cmpgDtl
const _table = components.campaign.detail._TABLES.default
const typeModule = 'Campaign Detail'
const typeFunctions = '/campaing-detail'
const logFile = 'logfpath'
class CampaignDtl {
    constructor() {
        this.result = {
            status: SVC.DEFAULT.code,
            msg: SVC.DEFAULT.msg,
            content: {
                page: 1,
                limit: 0,
                total: 0,
                campaignDetail: []
            },
            options: [],
            items: []
        }
    }


    async add(obj) {
        try {
            let msg = ''
            let where = ''
            if (obj.profiles == '*') {
                where += ` profiles = '9999999'`
            } else {
                where += `profiles = '${obj.profile}' `
            }
            let CDT = new cmpgDtl(obj)
            let data = await CDT.apiToDB()
            let connection = getConnection.createQueryBuilder()
            const items = await connection
                .insert()
                .into(`${_table}`)
                .values(data)
                .returning('*')
                .updateEntity(true)
                .execute();
            this.result.status = SVC.CRUD.code
            msg = {
                "subject": "Campaign Detail",
                "verb": "Create",
                "obj": "",
                "adj": "Fully",
                "adv": "Success"
            }
            this.result.msg = msg
            this.result.content = await CDT.objToAPI(items.raw)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _CREATE, 'campaign detail', error, logFile)
            console.log('err campign detail', error)
            return this.result
        }
    }

    async views(params) {
        try {
            console.log(params)
            let hid = params.hid
            let dtlid = params.dtlid
            let extra = params.extra.trim() || ''
            let page = 1
            let limit = 100
            let exts = ''
            let where = ' 1=1 '
            if (extra.trim() && extra.trim() !== '*') {
                exts = uri.parse(`/ extra ? ${extra} `, { parseQueryString: true }).query
                page = exts.page
                limit = exts.limit
            }

            if (hid !== '*') {
                where += ` AND cmpgmstid = '${hid}' `
            }

            if (dtlid !== '*') {
                where += ` AND cmpgmdtlid = '${dtlid}' `
            }

            let cnnCount = getConnection.createQueryBuilder()
            let cnt = await cnnCount.select(`COUNT(cmpgmstid)`, 'count').from(`${_table}`).where(`status = 'Y'`).getRawOne()
            let selectFields = [
                'cmpgmstid',
                'cmpgdtlid',
                'description',
                'qtyforevery',
                'qty',
                'actqty',
                'usedqty',
                'disc',
                'amnt',
                'note',
                'strdate',
                'strtime',
                'enddate',
                'endtime',
                'validfrom',
                'validto',
                'promotype',
                'recurringflag',
                'validoption',
                'onday',
                'onthe',
                'frequency',
                'mkt',
                'source',
                'channel',
                'profiles',
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
                // .skip(`${ parseInt(page) } `).take(`${ parseInt(limit) } `)
                .orderBy('cmpgdtlid')
                .getRawMany()
            this.result.status = SVC.CRUD.code
            let msg = {
                "subject": "Campaign Detail",
                "verb": "Read",
                "obj": "",
                "adj": "List",
                "adv": "Success"
            }
            let CDT = new cmpgDtl()
            this.result.content.campaignDetail = await CDT.objToAPI(items)
            this.result.content.page = page
            this.result.content.limit = limit
            this.result.content.total = cnt.count
            let optWhere = `parent = 'MKT'`
            let CFG = require('../config/master').configMst
            let cfg = new CFG()
            let cfgProfiles = await cfg.views('PROFILES')
            let cfgChannel = await cfg.views('CN')
            let cfgMKT = await cfg.views('MKT')
            this.result.options.push({
                market: [
                    { id: 'EC', name: 'eCommerce' },
                    { id: 'OTA', name: 'OTA' },
                    { id: 'DC', name: 'Direct' }
                ],
                source: [
                    { id: 'AGODA', name: 'AGODA' },
                    { id: 'ATA', name: 'ATA Thailand' },
                    { id: 'WB', name: 'webbooking' },
                    { id: 'SH', name: 'Shopee' },
                    { id: 'TRIP', name: 'Tripadvisor' }

                ],
                channel: [
                    { id: 'WEB', name: 'web' },
                    { id: 'EXB', name: 'exibition' }
                ],
                profile: [
                    { id: '*', name: 'ALL' },
                    { id: 'IV', name: 'Individual' },
                    { id: 'CM', name: 'Company' },
                    { id: 'CB', name: 'Chamber' },
                    { id: 'TA', name: 'Travel Agen' },
                    { id: 'GV', name: 'Government' }
                ]
            })
            /*
            this.result.options.push({
                market: [
                    { id: 'EC', name: 'eCommerce' },
                    { id: 'OTA', name: 'OTA' },
                    { id: 'DC', name: 'Direct' }
                ],
                source: [
                    { id: 'AGODA', name: 'AGODA' },
                    { id: 'ATA', name: 'ATA Thailand' },
                    { id: 'WB', name: 'webbooking' },
                    { id: 'SH', name: 'Shopee' },
                    { id: 'TRIP', name: 'Tripadvisor' }

                ],
                channel: [
                    { id: 'WEB', name: 'web' },
                    { id: 'EXB', name: 'exibition' }
                ],
                profile: [
                    { id: '*', name: 'ALL' },
                    { id: 'IV', name: 'Individual' },
                    { id: 'CM', name: 'Company' },
                    { id: 'CB', name: 'Chamber' },
                    { id: 'TA', name: 'Travel Agen' },
                    { id: 'GV', name: 'Government' }
                ]
            })
            */
            this.result.msg = msg
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _READ, `${params} `, error, logFile)
            console.log('err ' + _table, error)
            return this.result
        }
    }

    async update(obj) {
        // keep old qty , mark delete and insert new records
        try {
            let CDT = new cmpgDtl(obj)
            let data = await CDT.apiToDB()
            const connection = getConnection.createQueryBuilder();
            const items = await connection
                .update(`${_table}`)
                .set(data)
                .where(`cmpgdtlid = '${obj.campaignDtlID}'`)
                .andWhere(`cmpgmstid = '${obj.campaignID}'`)
                .returning('*')
                .updateEntity(true)
                .execute()
            let msg = {
                "subject": "Campaign Detail",
                "verb": "Update",
                "obj": "",
                "adj": "",
                "adv": "Success"
            }
            this.result.status = SVC.CRUD.code
            this.result.msg = msg
            this.result.content = await CDT.objToAPI(items.raw)
            console.log('update dtl', this.result.content)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _UPDATE, obj, error, logFile)
            console.log(error)
            console.log('err campaign detail', error)
            return this.result
        }
    }


    async remove(obj) {
        try {
            let msg = ''
            let data = {
                status: 'N'
            }
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .update(`${_table}`)
                .set(data)
                .where(`cmpgdtlid = ${obj.id} `)
                .returning('*')
                .execute()
            console.log('remove ', items)
            this.result.status = SVC.CRUD.code
            msg = {
                "subject": "Campaign Detail",
                "verb": "Delete",
                "obj": "",
                "adj": "",
                "adv": "Success"
            }

            this.result.msg = msg
            console.log(this.result)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _DELETE, `${obj.id}`, error, logFile)
            console.log(error)
            console.log('err campaign detail', error)
            return this.result
        }
    }
}

module.exports = {
    CampaignDtl
}
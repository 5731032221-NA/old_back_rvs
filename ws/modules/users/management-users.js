const { getConnection, components, SVC, getMsg } = require('../../config/sysHeader')
const crt = require('crypto')
const {
    _READ,
    _CREATE,
    _UPDATE,
    _DELETE,
    _SEPARATE
} = require('../../config/service')
const Log = require('../../sys/Log').Log
const Username = require('../../model/Username').Username
const _table = components.users.management.users._TABLES.default
const typeModule = 'management-users'
const typeFunctions = '/management-users'
const logFile = 'logfpath'
class userMst {
    constructor() {
        this.result = {
            status: SVC.DEFAULT.code,
            msg: SVC.DEFAULT.msg,
            content: [],
            items: []
        }
    }

    async add(obj) {
        console.log('obj', obj)
        try {
            /*
           const username1 = new Username(
               obj.fName ? obj.fName : 'Jon',
               obj.lName ? obj.lName : 'Doe',
               obj.age ? obj.age : 18,
               obj.status_record ? obj.status_records : '',
               obj.status_marriaged ? obj.status_marriaged : '',
               'userid',
               'pwd',
               'FADH',
               'CHR'
           )
           const connection = getConnection.createQueryBuilder()
           const items = await connection
               .insert()
               .into(`${_table}`)
               .values([username1])
               .returning([
                   'firstname',
                   'lastname',
                   'prefix'
               ])
               .updateEntity(false)
               .execute()
           return this.result */

            const connection = getConnection.createQueryBuilder();
            const dup = await connection
                .select(`firstname, lastname`)
                .from(`${_table}`)
                .where(`firstname = '${obj.firstname}'`)
                .andWhere(`lastname = '${obj.lastname}'`)
                .getRawMany()
            if (dup.length === 0) {
                let pwd = new Date().getTime().toString(36)
                const userid = obj.firstname.substring(0, 3) + obj.lastname.substring(0, 2)
                let usrMsg = `ID : ${userid}  PASS: ${pwd}`
                pwd = crt
                    .createHash('md5', 'revopms')
                    .update(pwd)
                    .digest('hex')
                let property = obj.property ? obj.property : 'FSDH'
                let branch = obj.branch ? obj.branch : 'HQ'
                const username1 = new Username(
                    obj.firstname ? obj.firstname : '',
                    obj.lastname ? obj.lastname : '',
                    obj.age ? parseInt(obj.age) : '',
                    obj.status_record ? obj.status_record : '',
                    obj.status_marriaged ? obj.status_marriaged : '',
                    userid,
                    pwd,
                    property,
                    branch
                )

                const connection = getConnection.createQueryBuilder()
                const items = await connection
                    .insert()
                    .into(`${_table}`)
                    .values([username1])
                    .returning([
                        'firstname',
                        'lastname',
                        'age',
                        'status_marriaged, userid, property, branch'
                    ])
                    .updateEntity(false)
                    .execute()

                const cnnPerm = getConnection.createQueryBuilder()
                const itemPerm = await cnnPerm
                    .insert()
                    .into(`usrpermissionmst`)
                    .values({
                        propertyid: property,
                        branchid: branch,
                        userid: userid,
                        usrpermission: ',,,,,,,',
                        dev: 'Y',
                        beta: 'N',
                        status: 'A'
                    })
                    .returning(['userid'])
                    .updateEntity(false)
                    .execute()

                this.result.status = SVC.CRUD.code
                this.result.msg = getMsg(SVC.CRUD.msg[_CREATE], usrMsg)
                this.result.content = items.raw
            } else {
                this.result.status = SVC.DUPLICATE.code;
                this.result.msg = getMsg(SVC.DUPLICATE.msg, `${obj.firstname} - ${obj.lastname}`);
            }
            return this.result

        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _CREATE, `${obj.firstname} ${obj.lastname}`, error, logFile)
            console.log('err management users', error)
            return this.result
        }
    }

    async views(id) {
        try {
            let where = '1=1 '
            if (id !== '*') {
                where += `AND id = '${id}'`
            }
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .select()
                .from(`${_table}`)
                .where(`${where}`)
                .getRawMany()
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_READ], typeModule)
            this.result.content.push(items)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _READ, `${id}`, error, logFile)
            return this.result
        }
    }

    async update(id, obj) {
        try {
            /* For test  id = 999 */
            // id = 999
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .update(`${_table}`, obj)
                .where(`id = ${parseInt(id)}`)
                .updateEntity(true)
                .execute()
            let msg = ''
            if (!items.affected) {
                msg = 'Completed '
            }
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_UPDATE], `${obj.firstname} ${obj.lastname} ${msg} (${items.affected})`)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _READ, `${id}`, error, logFile)
            console.log(typeModule, error)
            return this.result
        }
    }

    async remove(id) {
        try {
            /* For test  id = 999 */
            const connection = getConnection.createQueryBuilder()
            const items = await connection
                .delete()
                .from('username')
                .where('id = :id', { id })
                .execute()
            let msg = ''
            if (!items.affected) {
                msg = 'Completed '
            }
            this.result.status = SVC.CRUD.code
            this.result.msg = getMsg(SVC.CRUD.msg[_DELETE], `${msg} ${items.affected}`)
            return this.result
        } catch (error) {
            const lg = new Log()
            lg.setLog(_table, typeModule, typeFunctions, _READ, `${id}`, error, logFile)
            return this.result
        }
    }
}

module.exports = {
    userMst
}
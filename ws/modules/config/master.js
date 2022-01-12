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
const Username = require('../../model/Username').Username
const _table = components.configmaster._TABLES.default
const typeModule = 'configMaster'
const typeFunctions = '/config-masters'
const logFile = 'logfpath'
class configMst {
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
      let { listName, parent, description } = obj
      const arrValues = []
      const arrLangs = []
      listName = listName.trim().toUpperCase()
      const strAnd = ''
      description.forEach((e) => {
        arrLangs.push(e.lang.trim().toUpperCase())
        arrValues.push({
          listname: listName,
          parent: parent.trim(),
          description: e.desc.trim() + '-' + e.lang.trim(),
          category: '',
          value: '',
          recordstatus: 'I'
        })
      })
      const arrDup = []
      const arr = []
      const qrb = getConnection.createQueryBuilder()
      const dup = await qrb
        .select()
        .from(`${tbName}`)
        .where(`TRIM(listname) = '${listName}'`)
        .andWhere(`TRIM(description) LIKE '%-EN'`)
        .getRawMany()
      const strDup = arrDup.join(',')
      if (dup.length === 0) {
        const items = await qrb
          .insert()
          .into(`${tbName}`)
          .values(arrValues)
          .returning(['listname', 'parent', 'description', 'category'])
          .updateEntity(false)
          .execute()
        this.result.status = SVC.CRUD.code
        this.result.msg = getMsg(SVC.CRUD.msg[_CREATE], usrMsg)
        this.result.content = items.raw
      } else {
        this.result.status = SVC.DUPLICATE.code;
        this.result.msg = getMsg(SVC.DUPLICATE.msg, `${fName} - ${lName}`);
      }
      return this.result
    } catch (error) {
      const lg = new Log()
      lg.setLog(_table, typeModule, typeFunctions, _CREATE, `${fName} ${lName}`, error, logFile)
      console.log(logFile)
      console.log('err management users', error)
      return this.result
    }
  }

  async views(id) {
    console.log('id', id)
    try {
      let where = '1=1 '
      if (id !== '*') {
        where += `AND parent = '${id}'`
      }
      const connection = getConnection.createQueryBuilder()
      const items = await connection
        .select()
        .from(`${_table}`)
        .where(`${where}`)
        .andWhere(`recordstatus = 'A'`)
        .getRawMany()
      const opt = {
        idKey: '_id',
        parentKey: 'parent',
        childrenKey: '_children'
      }
      /*
      let w = await this.tree(items)
      this.result.status = SVC.CRUD.code
      this.result.msg = getMsg(SVC.CRUD.msg[_READ], typeModule)
      */
      //this.result.content = await this.listToTree(items, opt)
      this.result.msg = getMsg(SVC.CRUD.msg[_READ], typeModule)
      this.result.status = SVC.CRUD.code
      this.result.content = items
      return this.result
    } catch (error) {
      const lg = new Log()
      console.log('views ', error)
      lg.setLog(_table, typeModule, typeFunctions, _READ, `${id}`, error, logFile)
      return this.result
    }
  }

  async update(id, obj) {
    try {
      console.log('obj', obj)
      let { listName, parent, description, descriptionNewLang } = obj
      let arrUpdate = []
      let arrNew = []
      description.forEach((ele) => {
        arrUpdate.push({
          listname: listName,
          parent: ele.lang === 'EN' ? parent : listName,
          description: ele.desc + '-' + ele.lang
        })
      })
      console.log('update', arrUpdate)
      /*
        where parent = '2010'
        and listname = '2010'
        and description like '%-TH'
      */

      descriptionNewLang.forEach((ele) => {
        arrNew.push({
          listname: listName,
          parent: listName,
          description: ele.desc + '-' + ele.lang.toUpperCase(),
          recordstatus: 'I'
        })
      })
      console.log('new', arrNew)

      let items = []
      let itemsUpdate = []
      if (arrUpdate) {
        const qrb = getConnection.createQueryBuilder()
        itemsUpdate = await qrb
          .update(`${_table}`)
          .set(arrUpdate[0])
          .where(`TRIM(listname) = '${listName.trim()}'`)
          .updateEntity(true)
          .execute()
        console.log('itemUpdate', itemsUpdate)
        items.push(itemsUpdate)
      }
      const itemsNew = []
      if (arrNew.length > 0) {
        const cnn = getConnection.createQueryBuilder()
        const itemsNew = await cnn
          .insert()
          .into(`${_table}`)
          .values(arrNew)
          .updateEntity(false)
          .execute()
        console.log('itemsNew ', itemsNew)
      }

      let msg = ''
      if (itemsNew.affected) {
        msg = 'Completed'
      }

      this.result.status = SVC.CRUD.code
      this.result.msg = getMsg(SVC.CRUD.msg[_UPDATE], `${obj.firstname} ${obj.lastname} (${items.affected})`)

      return this.result
    } catch (error) {
      console.log('error', error)
      const lg = new Log()
      lg.setLog(_table, typeModule, typeFunctions, _READ, `${id}`, error, logFile)
      return this.result
    }
  }

  async remove(id) {
    try {
      /*
       const params = req.params
       const id = params.id
       const result = await cnn
           .createQueryBuilder()
           .update(`${tbName}`)
           .set({ recordStatus: 'F' })
           .where('TRIM(listname) = :id', { id })
           .execute()
         await cnn.close()
     */
      this.result.status = SVC.CRUD.code
      this.result.msg = getMsg(SVC.CRUD.msg[_DELETE], `${items.affected}`)
      return this.result
    } catch (error) {
      const lg = new Log()
      lg.setLog(_table, typeModule, typeFunctions, _READ, `${id}`, error, logFile)
      return this.result
    }
  }

  async tree(arr) {
    let root;
    let objTree = []
    try {
      const idMapping = arr.reduce((acc, el, i) => {
        acc[el.parent] = i;
        return acc;
      }, {});

      arr.forEach(el => {
        /* 
         arrElem = arr[i]
         const l = arrElem.description.split('-')
         const obj = {
           _id: arrElem.listname,
           parent: arrElem.parent,
           name: [
             {
               desc: l[0],
               lang: l[1]
             }
           ],
           _children: []
         }
       */

        let obj = {
          _id: el.listname,
          parent: el.parent,
          description: el.description,
          name: [
            {
              desc: el.description
            }
          ],
          children: []
        }
        el = obj
        // Handle the root element
        if (el.parent === null) {
          root = el;
          return;
        }

        // Use our mapping to locate the parent element in our data array
        const parentEl = arr[idMapping[el.parent]];
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el];
        objTree.push(parentEl)
      });

      return objTree
    } catch (error) {
      console.log('tree ', error)
      return root
    }
  }
  /*
    async listToTree(arr, options) {
      const tree = []
      try {
        const mappedArr = []
        let arrElem = []
        let mappedElem = {}
  
        for (let i = 0, len = arr.length; i < len; i++) {
          arrElem = arr[i]
          const l = arrElem.description.split('-')
          const obj = {
            _id: arrElem.listname,
            parent: arrElem.parent,
            name: [
              {
                desc: l[0],
                lang: l[1]
              }
            ],
            _children: []
          }
          mappedArr.push(arrElem)
          if (obj._id === obj.parent) {
            let rr = mappedArr[arrElem.listname].name.find((e) => {
              return e.lang === obj.name[0].lang
            })
            if (!rr) {
              mappedArr[arrElem.listname].name.push(obj.name[0])
              // console.log('#lang', mappedArr[arrElem.listname])
            }
          } else {
            mappedArr[arrElem.listname] = obj
          }
          //  console.log(mappedArr[arrElem.listname])
          mappedArr[arrElem.listname]._children = []
        }
  
        for (const id in mappedArr) {
          if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id]
            if (mappedArr[mappedElem.parent]) {
              mappedArr[mappedElem.parent]._children.push(mappedElem)
            } else {
              tree.push(mappedElem)
            }
          }
        }
        return tree
      } catch (error) {
        console.log('error', error)
        return tree
      }
    }
    */
}

module.exports = {
  configMst
}
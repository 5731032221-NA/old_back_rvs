const getConnection = require('typeorm')
const { ckPerm } = require('../Utility/user')
const usrPerm = async function(cmpID, action, usr, property, branchid, option) {
  let hasPerm = false
  const permcnn = getConnection.createQueryBuilder()
  const perm = await permcnn
    .select('usrpermission')
    .from(`usrpermissionmst`)
    .where(`propertyid = '${property.trim()}'`)
    .andWhere(`branchid = '${branchid.trim()}'`)
    .andWhere(`userid = '${usr.trim()}'`)
    .getRawOne()
  if (perm) {
    const connection = getConnection.createQueryBuilder()
    const comPositions = await connection
      .select(`componentid, position`)
      .from(`componentmst`)
      .where(`componentid = '${cmpID}'`)
      .getRawOne()
    if (comPositions) {
      hasPerm = await ckPerm(
        action,
        comPositions.position,
        perm.usrpermission,
        option
      )
    }
  }
  return await hasPerm
}

const componentsUsr = async function(where) {
  const connComponent = getConnection.createQueryBuilder()
  const components = await connComponent
    .select('componentid, parent, name, position')
    .from('componentmst')
    .where(`position IN (${where})`)
    .orderBy('seq', 'ASC')
    .getRawMany()
  return components
}

module.exports = {
  usrPerm,
  componentsUsr
}

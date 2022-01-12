const getConnection = require('typeorm')
const usrPerm = async function(cmpID, action, usr, property, branchid, option) {
  let hasPerm = 'N'
  // API Version Control Checke
  const connection = getConnection.createQueryBuilder()
  const comPositions = await connection
    .select(`componentid, position`)
    .from(`componentmst`)
    .where(`componentid = '${cmpID}'`)
    .getRawOne()
  if (comPositions) {
    const permcnn = getConnection.createQueryBuilder()
    const perm = await permcnn
      .select(
        `split_part(usrpermission, ',', ${comPositions.position}) as usrpermission,userid`
      )
      .from(`usrpermissionmst`)
      .where(`propertyid = '${property.trim()}'`)
      .andWhere(`branchid = '${branchid.trim()}'`)
      .andWhere(`userid = '${usr.trim()}'`)
      .getRawOne()
    if (perm.usrpermission !== '') {
      hasPerm = perm.usrpermission.includes(action) ? 'Y' : 'O'
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

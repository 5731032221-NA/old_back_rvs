class Username {
  constructor(
    fname,
    lname,
    a,
    record,
    marraiged,
    userid,
    pwd,
    property,
    branch
  ) {
    this.firstname = fname
    this.lastname = lname
    this.age = a
    this.status_record = record
    this.status_marriaged = marraiged
    this.userid = userid
    this.password = pwd
    this.property = property
    this.branch = branch
  }
}

module.exports = {
  Username
}

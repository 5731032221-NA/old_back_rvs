class Account {
    constructor(
        fName,
        lName,
        code,
        pwd,
        position,
        status,
        adaccount
    ) {
      this.firstname = fName
      this.lastname = lName
      this.username = code
      this.password = pwd
      this.position = position
      this.status = status
      this.adaccount = adaccount
    }
  }
  
  module.exports = {
    Account
  }
  
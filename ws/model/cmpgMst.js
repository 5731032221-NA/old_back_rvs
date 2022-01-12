class CmpgMst {
  constructor(info) {
    this.defaultTimezone = '00:00:00+07'
    if (info) {
      this.data = {
        name: info.campaignName,
        detail: info.campaignDetail,
        strdate: new Date(info.startdate),
        enddate: new Date(info.enddate),
        strtime: this.defaultTimezone,
        endtime: this.defaultTimezone,
        status: info.status || 'N',
        qtyeachtime: parseInt(info.qty),
        indefinitely: info.noenddate || false,
        remark: info.note || ' '
      }
    }
    this.result = []
  }

  async dbToAPI(items) {
    items.forEach(ele => {
      let obj = {
        campaignID: ele.cmpgmstid,
        campaignName: ele.name,
        campaignDetail: ele.detail,
        startdate: new Date(ele.strdate).toISOString().substring(0, 10),
        enddate: new Date(ele.enddate).toISOString().substring(0, 10),
        strtime: this.defaultTimezone,
        endtime: this.defaultTimezone,
        status: ele.status,
        qty: parseInt(ele.qtyeachtime),
        noenddate: ele.indefinitely,
        nodte: ele.remark
      }
      this.result.push(obj)
    })
    return this.result
  }

  async apiToDB() {
    return this.data
  }

}

module.exports = {
  CmpgMst
}

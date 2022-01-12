class codeMst {
  constructor(info) {
    if (info) {
      this.data = {
        promocode: info.code,
        strdate: new Date(info.startdate),
        enddate: new Date(info.enddate),
        qty: parseInt(info.quantity) || 0,
        status: info.status || 'N',
        remark: info.remark || ' ',
        cmpgdtlid: parseInt(info.campaignDtlID),
        source: info.source,
        mkt: info.market,
        channel: info.channel,
        profiles: info.profile
      }
    }
    this.result = []
  }

  async dbToAPI(items) {
    items.forEach(ele => {
      let obj = {
        codeID: ele.cmstid,
        code: ele.promocode,
        startdate: new Date(ele.strdate).toISOString().substring(0, 10),
        enddate: new Date(ele.enddate).toISOString().substring(0, 10),
        quantity: ele.qty,
        market: ele.mkt,
        source: ele.source,
        channel: ele.channel,
        profile: ele.profiles,
        status: ele.status,
        remark: ele.remark,
        campaignDtlID: parseInt(ele.cmpgdtlid)
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
  codeMst
}

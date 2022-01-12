class cmpgDtl {
  constructor(info) {
    this.result = []
    let defaultTimezone = '00:00:00+07'
    if (info) {
      if (info.recurringFlag === 'M') {
        let dtlDate = new Date(info.enddate)
        info.validOption = dtlDate.getDate()
        info.onday = this.getDateName(info.startdate)
      }

      if (info.recurringFlag === 'Y' && info.onthe !== -1) {
        let dtlDate = info.startdate.split('-')
        info.onday = `${dtlDate[1]}-${dtlDate[2]}`
        info.validoption = ''
      }

      if (info.onthe !== -1) {
        info.validoption = this.getDateName(info.startdate)
      }



      this.data = {
        description: info.description || ' ',
        strdate: new Date(info.startdate),
        enddate: new Date(info.enddate),
        strtime: info.starttime || defaultTimezone,
        endtime: info.endtime || defaultTimezone,
        validfrom: info.EffectiveFrom,
        validto: info.EffectiveTo,
        note: info.note,
        promotype: info.campaignType,
        disc: parseInt(info.discp) || 0,
        amnt: parseInt(info.amount) || 0,
        maxpurchase: parseInt(info.maximumPurchase) || 0,
        minpurchase: parseInt(info.minimumPurchase) || 0,
        maxamnt: parseInt(info.maximumAmount) || 0,
        minamnt: parseInt(info.minimumAmount) || 0,
        recurringflag: info.recurringflag || 'N',
        validoption: info.validOption,
        frequency: parseInt(info.every) || 0,
        onday: info.onday || ' ',
        onthe: info.onthe || 0,
        mkt: info.market,
        source: info.source,
        channel: info.channel,
        profiles: info.profile,
        qty: parseInt(info.qtyEachTime) || 0,
        qtyforevery: parseInt(info.qtyForEvery) || 0,
        actqty: parseInt(info.activeQty) || 0,
        usedqty: parseInt(info.usedQty) || 0,
        status: info.status,
        remark: info.remark || ' ',
        cmpgmstid: parseInt(info.campaignID) || 0,
        indefinitely: info.noendate
      }
    }
  }

  async objToAPI(items) {
    items.forEach(ele => {
      let obj = {
        campaignID: ele.cmpgmstid,
        campaignDtlID: ele.cmpgdtlid,
        description: ele.description,
        campaignDetail: ele.note,
        startdate: new Date(ele.strdate).toISOString().substring(0, 10),
        enddate: new Date(ele.enddate).toISOString().substring(0, 10),
        starttime: ele.strtime,
        endtime: ele.endtime,
        EffectiveFrom: new Date(ele.validfrom).toISOString().substring(0, 10),
        EffectiveTo: new Date(ele.validto).toISOString().substring(0, 10),
        recurringFlag: ele.recurringflag,
        qtyEachTime: parseInt(ele.qty),
        qtyForEvery: parseInt(ele.qtyforevery),
        activeQty: parseInt(ele.actqty),
        usedQty: parseInt(ele.usedqty),
        discp: ele.disc,
        amount: ele.amnt,
        campaignType: ele.promotype,
        validOption: ele.validoption,
        onday: ele.onday,
        onthe: parseInt(ele.onthe),
        every: parseInt(ele.frequency),
        market: ele.mkt,
        source: ele.source,
        channel: ele.channel,
        profile: ele.profiles,
        status: ele.status,
        detail: ele.note,
        noenddate: ele.indefinitely,
        brand: ele.brandcode,
        remark: ele.remark
      }
      this.result.push(obj)
    })
    return this.result
  }

  async apiToDB() {
    return this.data
  }


  async getDateName(strtDate) {
    let date = new Date(strtDate.trim());
    return date.toLocaleString('en-US', {
      weekday: 'short',
    }).substring(0, 2).toLocaleLowerCase()
  }
}

module.exports = {
  cmpgDtl
}


// "use strict";
// const { router, getConnection, SVC } = require("../config/sysHeader");
// const Log = require("../sys/Log").Log;
// const RMMST = require("../modules/rooms/masters").Masters;
// // Global Constance

// var resp = {
//   status: "0000",
//   msg: "Access Denied",
//   content: [],
// };
// /*
//  * GET Pattern
//  */

// router.get("/", async (req, res, next) => {
//   let resp = {
//     status: SVC.DEFAULT.code,
//     msg: SVC.DEFAULT.msg,
//     content: [],
//   };
//   res.send(resp);
// });

// router.post("/companyprofile", async (req, res, next) => {
//   try {
//     const {
//         nameOne,nameTwo,
//         CompanyTypeCode, 
//         Abbreviation, 
//         GuaranteeMethodCode,
//         Property,
//         Currency,
//         CreditRating,
//         IATA, 
//         Status,
//         StreetAddress,
//         Chooseacountry, 
//         City,
//         State,
//         Postal,
//         BStreetAddress,
//         BChooseacountry,
//         BCity,
//         BState,
//         BPostal,
//         TaxID,
//         TaxID2,
//         Communication, 
//         Relationship,
//         CreditCardNumber,
//         OutstandingAmount,
//         FloatingDepositionAmount, 
//         ARNumber, 
//         SalesUserName,
//         Industry,
//         MarketSegment,
//         SourceOfBusiness,
//         TrackCode,
//         ReasonForStay, 
//         Geographic
//     } = req.body;

//     console.log("Body post :", req.body);

//     const cnnDup = getConnection.createQueryBuilder();
//     const itemsAleady = await cnnDup
//       .select(`name`)
//       .from(`companyprofile`)
//       .where(`name = '${nameOne}'`)
//       .getRawOne();
//     console.log("already ", itemsAleady);

//     if (!itemsAleady) {
//       const connection = getConnection.createQueryBuilder();
//       const items = await connection
//         .insert()
//         .into(`companyprofile`)
//         .values({
//             name: nameOne,
//             name2: nameTwo,
//             abbreviation: Abbreviation,
//             salesusername:SalesUserName,
//             // guaranteemethodcode:GuaranteeMethodCode,
//             // // companytypecode: CompanyTypeCode,
//             // property: Property,
//             // currencycode:Currency,
//             // creditrating: CreditRating, //new
//             // // iata: IATA,
//             // // statuscode: Status,
//             // address: StreetAddress,
//             // countrycode:Chooseacountry,
//             // city:City,
//             // stateprovince:State,
//             // postalcode:Postal,
//             // billingaddress:BStreetAddress,
//             // billingcity:BCity,
//             // billingstateprovince:BState,
//             // billingcountrycode:BChooseacountry,
//             // billingpostalcode:BPostal,
//             // taxid:TaxID,
//             // taxid2:TaxID2,
//             // ar_number:ARNumber,
//             // creditcardid:CreditCardNumber, 
//             // outstandingamout: OutstandingAmount,
//             // floatingdepositamount: FloatingDepositionAmount,
//             // industrycode:Industry,
//             // marketsegmentcode:MarketSegment,
//             // sourceofbusinesscode:SourceOfBusiness,
//             // trackcode:TrackCode,
//             // reasonforstaycode:ReasonForStay,
//             // geographiccode:Geographic


//         })
//         .returning([
//           "name",

//         ])
//         .updateEntity(false)
//         .execute();

//         console.log("items:",items);
//       resp.content.push(items);
//       resp.status = "2000";
//       resp.msg = `Success!  `;
//       res.send(resp);
//     } else {
//       resp.status = "1000";
//       resp.msg = `Duplicate ${nameOne} `;
//       resp.content = [];
//       res.send(resp);
//     }
//   } catch (error) {
//     console.log(error);
//     res.send(resp);
//   }
// });



// module.exports = router;


"use strict";
const { router, getConnection, SVC } = require("../config/sysHeader");
const Log = require("../sys/Log").Log;
const RMMST = require("../modules/rooms/masters").Masters;
// Global Constance

var resp = {
  status: "0000",
  msg: "Access Denied",
  content: [],
};
/*
 * GET Pattern
 */

router.get("/", async (req, res, next) => {
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg,
    content: [],
  };
  res.send(resp);
});


router.get("/companyprofilecommunication/:id", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        `nameid,
        communication,
        value`
      )
      .from(`companycommunications`)
      .where("cast(nameid as int) = :id", {
        id: req.params.id,
      })
      .getRawMany();
    console.log(items);
    resp.contents = [];
    resp.contents.push(items);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    resp.status = "1000";
    res.send(resp);
  }
});

router.get("/companyprofilerelation/:id", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        `nameid,
        relation,
        value,
        note`
      )
      .from(`companyrelations`)
      .where("cast(nameid as int) = :id", {
        id: req.params.id,
      })
      .getRawMany();
    console.log(items);
    resp.contents = [];
    resp.contents.push(items);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/taprofile", async (req, res, next) => {
  try {
    resp.content = [];
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("*")
      .from(`companyprofile`)
      .where("recordtype = 'T'")
      .orderBy("companyprofile.id")
      .getRawMany();
    const connection2 = getConnection.createQueryBuilder();
    const www = await connection2
      .select("*")
      .from(`companycommunications`)
      .where("communication = 'www'")
      .getRawMany();
    console.log("www", www)
    items.forEach(element => {
      let index = www.findIndex((x) => x.nameid == element.id);
      console.log(index)
      if (index != -1) element.www = www[index].value
      // element.www = www[index].value
    });
    console.log("companyprofile", items);
    resp.content.push(items);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/taprofile/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("*")
      .from(`companyprofile`)
      .where("id = :id", {
        id: req.params.id,
      })
      .andWhere("recordtype = 'T'")
      .orderBy("id")
      .getRawOne();
    console.log(items);
    resp.content = [];
    resp.content.push(items);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/companyprofile", async (req, res, next) => {
  try {
    resp.content = [];
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("*")
      .from(`companyprofile`)
      .where("recordtype = 'C'")
      .orderBy("companyprofile.id")
      .getRawMany();
    const connection2 = getConnection.createQueryBuilder();
    const www = await connection2
      .select("*")
      .from(`companycommunications`)
      .where("communication = 'www'")
      .getRawMany();
    console.log("www", www)
    items.forEach(element => {
      let index = www.findIndex((x) => x.nameid == element.id);
      console.log(index)
      if (index != -1) element.www = www[index].value
      // element.www = www[index].value
    });
    console.log("companyprofile", items);
    resp.content.push(items);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    resp.status = "1000";
    res.send(resp);
  }
});

router.get("/companyprofile/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("*")
      .from(`companyprofile`)
      .where("id = :id", {
        id: req.params.id,
      })
      .andWhere("recordtype = 'C'")
      .orderBy("id")
      .getRawOne();
    console.log(items);
    resp.content = [];
    resp.content.push(items);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.put("/companyprofile/:id", async (req, res, next) => {
  const id = req.params.id;
  console.log("guestnameinfoid for put :", id);
  try {
    const {
      recordtype,
      nameOne, nameTwo,
      companyTypeCode,
      abbreviation,
      guaranteeMethodCode,
      property,
      currency,
      creditRating,
      IATA,
      status,
      streetAddress,
      chooseCountry,
      city,
      stateProvince,
      postal,
      BStreetAddress,
      BChooseacountry,
      BCity,
      BState,
      BPostal,
      TaxID,
      TaxID2,
      communications,
      relations,
      creditCardNumber,
      outstandingAmount,
      floatingDepositionAmount,
      ARNumber,
      salesUserName,
      industry,
      marketSegment,
      sourceOfBusiness,
      trackCode,
      reasonForStay,
      geographic,
      negotiatedratesonly,
      ratecontractcode
    } = req.body;
    console.log(req.body);
    communications
    const delconnectioncommunication = getConnection.createQueryBuilder();
    console.log("id", id)
    const delcommunication = await delconnectioncommunication
      .delete()
      .from("companycommunications")
      .where(`cast(nameid AS INT) =${id} `)
      .execute();

    const delconnectionrelations = getConnection.createQueryBuilder();
    const delrelation = await delconnectionrelations
      .delete()
      .from("companyrelations")
      .where(`cast(nameid AS INT) =${id} `)
      .execute();

    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .update(`companyprofile`)
      .set({
        recordtype: recordtype,
          name: nameOne,
          name2: nameTwo,
          iata: IATA,
          abbreviation: abbreviation,
          salesusername: salesUserName,
          guaranteemethodcode: guaranteeMethodCode,
          companytypecode: companyTypeCode,
          property: property,
          currencycode: currency,
          creditrating: Number(creditRating) ? Number(creditRating) : 0, //new
          statuscode: status,
          address: streetAddress,
          countrycode: chooseCountry,
          city: city,
          stateprovince: stateProvince,
          postalcode: Number(postal) ?  Number(postal) : 0,
          billingaddress: BStreetAddress,
          billingcity: BCity,
          billingstateprovince: BState,
          billingcountrycode: BChooseacountry,
          billingpostalcode: Number(BPostal) ? Number(BPostal) : 0,
          taxid: TaxID,
          taxid2: TaxID2,
          ar_number: Number(ARNumber) ? Number(ARNumber): 0,
          creditcardid: Number(creditCardNumber) ? Number(creditCardNumber): 0,
          outstandingamout: parseFloat(outstandingAmount) ? parseFloat(outstandingAmount) : 0,
          floatingdepositamount: parseFloat(floatingDepositionAmount) ? parseFloat(floatingDepositionAmount) : 0,
          industrycode: industry,
          marketsegmentcode: marketSegment,
          sourceofbusinesscode: sourceOfBusiness,
          trackcode: trackCode,
          reasonforstaycode: reasonForStay,
          geographiccode: geographic,
          negotiatedratesonly: negotiatedratesonly,
          ratecontractcode: ratecontractcode
      })
      .where(`id = ${id}`)
      .returning([
        "recordtype",
        "name",
        "name2",
        "iata",
        "abbreviation",
        "salesusername",
        "countrycode",
        "guaranteemethodcode",
        "companytypecode",
        "property",
        "currencycode",
        "creditrating", //new
        "statuscode",
        "address",
        "countrycode",
        "city",
        "stateprovince",
        "postalcode",
        "billingaddress",
        "billingcity",
        "billingstateprovince",
        "billingcountrycode",
        "billingpostalcode",
        "taxid",
        "taxid2",
        "ar_number",
        "creditcardid",
        "outstandingamout",
        "floatingdepositamount",
        "industrycode",
        "marketsegmentcode",
        "sourceofbusinesscode",
        "trackcode",
        "reasonforstaycode",
        "geographiccode"

      ])
      .updateEntity(true)
      .execute();


    console.log("communications", communications);
    console.log("relations", relations);
    let communicationsDatas = []

    for (var key in communications) {
      if (key % 2 == 0) communicationsDatas.push({
        nameid: id.toString(),
        communication: communications[key - 1],
        value: communications[key]
      })
    }
    const connection_communication = getConnection.createQueryBuilder();
    const insert_communication = await connection_communication
      .insert()
      .into(`companycommunications`)
      .values(communicationsDatas).updateEntity(false)
      .execute();

    let relationsDatas = []
    for (var key in relations) {
      if (key % 3 == 0) relationsDatas.push({
        nameid: id.toString(),
        relation: relations[key - 1],
        value: relations[key - 2],
        note: relations[key]
      })
    }
    const connection_relations = getConnection.createQueryBuilder();
    const insert_relations = await connection_relations
      .insert()
      .into(`companyrelations`)
      .values(relationsDatas).updateEntity(false)
      .execute();



    resp.status = "2000";
    resp.msg = "Success!";
    resp.content.push(items);
    console.log("put companyprofile", items);
    res.send(resp);
  } catch (error) {
    console.log("error", error);
    resp.status = "1000";
    resp.msg = ` ${error} `;
    resp.content = [];
    res.send(resp);
  }
});

router.post("/companyprofile", async (req, res, next) => {
  try {
    const {
      recordtype,
      nameOne, nameTwo,
      companyTypeCode,
      abbreviation,
      guaranteeMethodCode,
      property,
      currency,
      creditRating,
      IATA,
      status,
      streetAddress,
      chooseCountry,
      city,
      stateProvince,
      postal,
      BStreetAddress,
      BChooseacountry,
      BCity,
      BState,
      BPostal,
      TaxID,
      TaxID2,
      communications,
      relations,
      creditCardNumber,
      outstandingAmount,
      floatingDepositionAmount,
      ARNumber,
      salesUserName,
      industry,
      marketSegment,
      sourceOfBusiness,
      trackCode,
      reasonForStay,
      geographic,
      negotiatedratesonly,
      ratecontractcode
    } = req.body;

    console.log("Body post :", req.body);

    const cnnDup = getConnection.createQueryBuilder();
    const itemsAleady = await cnnDup
      .select(`name`)
      .from(`companyprofile`)
      .where(`name = '${nameOne}'`)
      .getRawOne();
    console.log("already ", itemsAleady);

    if (!itemsAleady) {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .insert()
        .into(`companyprofile`)
        .values({
          recordtype: recordtype,
          name: nameOne,
          name2: nameTwo,
          iata: IATA,
          abbreviation: abbreviation,
          salesusername: salesUserName,
          guaranteemethodcode: guaranteeMethodCode,
          companytypecode: companyTypeCode,
          property: property,
          currencycode: currency,
          creditrating: Number(creditRating) ? Number(creditRating) : 0, //new
          statuscode: status,
          address: streetAddress,
          countrycode: chooseCountry,
          city: city,
          stateprovince: stateProvince,
          postalcode: Number(postal) ?  Number(postal) : 0,
          billingaddress: BStreetAddress,
          billingcity: BCity,
          billingstateprovince: BState,
          billingcountrycode: BChooseacountry,
          billingpostalcode: Number(BPostal) ? Number(BPostal) : 0,
          taxid: TaxID,
          taxid2: TaxID2,
          ar_number: Number(ARNumber) ? Number(ARNumber): 0,
          creditcardid: Number(creditCardNumber) ? Number(creditCardNumber): 0,
          outstandingamout: parseFloat(outstandingAmount) ? parseFloat(outstandingAmount) : 0,
          floatingdepositamount: parseFloat(floatingDepositionAmount) ? parseFloat(floatingDepositionAmount) : 0,
          industrycode: industry,
          marketsegmentcode: marketSegment,
          sourceofbusinesscode: sourceOfBusiness,
          trackcode: trackCode,
          reasonforstaycode: reasonForStay,
          geographiccode: geographic,
          negotiatedratesonly: negotiatedratesonly,
          ratecontractcode: ratecontractcode
        })
        .returning([
          "recordtype",
          "name",
          "name2",
          "iata",
          "abbreviation",
          "salesusername",
          "countrycode",
          "guaranteemethodcode",
          "companytypecode",
          "property",
          "currencycode",
          "creditrating", //new
          "statuscode",
          "address",
          "countrycode",
          "city",
          "stateprovince",
          "postalcode",
          "billingaddress",
          "billingcity",
          "billingstateprovince",
          "billingcountrycode",
          "billingpostalcode",
          "taxid",
          "taxid2",
          "ar_number",
          "creditcardid",
          "outstandingamout",
          "floatingdepositamount",
          // "industrycode",
          "marketsegmentcode",
          "sourceofbusinesscode",
          "trackcode",
          "reasonforstaycode",
          "geographiccode"

        ])
        .updateEntity(false)
        .execute();
      const connectionid = getConnection.createQueryBuilder();
      const id = await connectionid
        .select(
          "max(id)"
        )
        .from(`companyprofile`)
        .getRawOne();
      let newID = id.max
      console.log("communications", communications);
      console.log("relations", relations);
      let communicationsDatas = [
        // {
        //   nameid: newID,
        //   communication: "email",
        //   value: communications.email
        // },
        // {
        //   nameid: newID,
        //   communication: "mobile",
        //   value: communications.mobile
        // }
      ]
      for (var key in communications) {
        if (key % 2 == 0) communicationsDatas.push({
          nameid: newID,
          communication: communications[key - 1],
          value: communications[key]
        })
      }
      const connection_communication = getConnection.createQueryBuilder();
      const insert_communication = await connection_communication
        .insert()
        .into(`companycommunications`)
        .values(communicationsDatas).updateEntity(false)
        .execute();

      let relationsDatas = []
      for (var key in relations) {
        if (key % 3 == 0) relationsDatas.push({
          nameid: newID,
          relation: relations[key - 1],
          value: relations[key - 2],
          note: relations[key]
        })
      }
      const connection_relations = getConnection.createQueryBuilder();
      const insert_relations = await connection_relations
        .insert()
        .into(`companyrelations`)
        .values(relationsDatas).updateEntity(false)
        .execute();


      console.log("items:", items);
      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success!  `;
      res.send(resp);
    } else {
      resp.status = "1000";
      resp.msg = `Duplicate ${nameOne} `;
      resp.content = [];
      res.send(resp);
    }
  } catch (error) {
    console.log(error);

    resp.status = "1000";
    resp.msg = ` ${error} `;
    resp.content = [];
    res.send(resp);
  }
});

router.delete("/companyprofile/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  console.log("req.params == ", id);
  try {

    console.log("=======Delete=========");
    const delconnectioncommunication = getConnection.createQueryBuilder();
    const delcommunication = await delconnectioncommunication
      .delete()
      .from("companycommunications")
      .where(`cast(nameid AS INT) =${id} `)
      .execute();

    const delconnectionrelations = getConnection.createQueryBuilder();
    const delrelation = await delconnectionrelations
      .delete()
      .from("companyrelations")
      .where(`cast(nameid AS INT) =${id} `)
      .execute();

    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .delete()
      .from("companyprofile")
      .where(`id =${id} `)
      .execute();
    console.log("items", items);
    resp.content = [];
    resp.content.push(items);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);


  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.msg = "Failer";
    resp.content = [];
    res.send(resp);
  }
});

module.exports = router;





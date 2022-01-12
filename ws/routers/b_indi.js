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

router.get("/individualprofile", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        `nameid,
      nametitle,
    firstname,
    lastname,
    nameprefix,
    namesuffix,
    middleinitial,
    gender,
    religion,
    organization,
    provinceofresidence,
    bordercrossingentryplace,
    bordercrossingentrydate,
    address,
    address1,
    address2,
    conuty,
    city,
    stateprovince,
    postal,
    nopost,
    nrg,
    guestcategory,
    vvip,
    birthregion,
    birthprovince,
    guesttype,
    idcheck,
    idtype,
    idnumber,
    nationality,
    dateofbirth,
    idissueddate,
    idexpirationdate,
    passportvisacheck,
    visatype,
    visaname,
    visanumber,
    visaissueddate,
    visabegindate,
    visaexpirationdate,
    visastatus,
    visanotes,
    rank,
    grade,
    guestidentity`
      )
      .from(`individualprofile`)
      .orderBy("id")
      .getRawMany();
    console.log(items);
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

router.get("/individualprofile/:id", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        `nameid,
        nametitle,
      firstname,
      lastname,
      nameprefix,
      namesuffix,
      middleinitial,
      gender,
      religion,
      organization,
      provinceofresidence,
      bordercrossingentryplace,
      bordercrossingentrydate,
      address,
      address1,
      address2,
      conuty,
      city,
      stateprovince,
      postal,
      nopost,
      nrg,
      guestcategory,
      vvip,
      birthregion,
      birthprovince,
      guesttype,
      idcheck,
      idtype,
      idnumber,
      nationality,
      dateofbirth,
      idissueddate,
      idexpirationdate,
      passportvisacheck,
      visatype,
      visaname,
      visanumber,
      visaissueddate,
      visabegindate,
      visaexpirationdate,
      visastatus,
      visanotes,
      rank,
      grade,
      guestidentity`
      )
      .from(`individualprofile`)
      .where("nameid = :id", {
        id: req.params.id,
      })
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

router.get("/individualprofilecommunication/:id", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        `nameid,
        communication,
        value`
      )
      .from(`communications`)
      .where("nameid = :id", {
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

router.get("/individualprofilerelation/:id", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        `nameid,
        relation,
        value,
        note`
      )
      .from(`relations`)
      .where("nameid = :id", {
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

router.put("/individualprofile/:id", async (req, res, next) => {
  const id = req.params.id;
  console.log("nameid for put :", id);
  try {
    const {
      nametitle,
      firstname,
      lastname,
      nameprefix,
      namesuffix,
      middleinitial,
      gender,
      religion,
      organization,
      provinceofresidence,
      bordercrossingentryplace,
      bordercrossingentrydate,
      address,
      address1,
      address2,
      conuty,
      city,
      stateprovince,
      postal,
      nopost,
      nrg,
      guestcategory,
      vvip,
      birthregion,
      birthprovince,
      guesttype,
      idcheck,
      idtype,
      idnumber,
      nationality,
      dateofbirth,
      idissueddate,
      idexpirationdate,
      passportvisacheck,
      visatype,
      visaname,
      visanumber,
      visaissueddate,
      visabegindate,
      visaexpirationdate,
      visastatus,
      visanotes,
      rank,
      grade,
      guestidentity,
    } = req.body;
    console.log(req.body);

    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .update(`individualprofile`)
      .set({
        nametitle: nametitle,
        firstname: firstname,
        lastname: lastname,
        nameprefix: nameprefix,
        namesuffix: namesuffix,
        middleinitial: middleinitial,
        gender: gender,
        religion: religion,
        organization: organization,
        provinceofresidence: provinceofresidence,
        bordercrossingentryplace: bordercrossingentryplace,
        bordercrossingentrydate: bordercrossingentrydate,
        address: address,
        address1: address1,
        address2: address2,
        conuty: conuty,
        city: city,
        stateprovince: stateprovince,
        postal: postal,
        nopost: nopost,
        nrg: nrg,
        guestcategory: guestcategory,
        vvip: vvip,
        birthregion: birthregion,
        birthprovince: birthprovince,
        guesttype: guesttype,
        idcheck: idcheck,
        idtype: idtype,
        idnumber: idnumber,
        nationality: nationality,
        dateofbirth: dateofbirth,
        idissueddate: idissueddate,
        idexpirationdate: idexpirationdate,
        passportvisacheck: passportvisacheck,
        visatype: visatype,
        visaname: visaname,
        visanumber: visanumber,
        visaissueddate: visaissueddate,
        visabegindate: visabegindate,
        visaexpirationdate: visaexpirationdate,
        visastatus: visastatus,
        visanotes: visanotes,
        rank: rank,
        grade: grade,
        guestidentity: guestidentity,
      })
      .where(`nameid = ${id}`)
      .returning([
        "nameid",
        "nametitle",
        "firstname",
        "lastname",
        "nameprefix",
        "namesuffix",
        "middleinitial",
        "gender",
        "religion",
        "organization",
        "provinceofresidence",
        "bordercrossingentryplace",
        "bordercrossingentrydate",
        "address",
        "address1",
        "address2",
        "conuty",
        "city",
        "stateprovince",
        "postal",
        "nopost",
        "nrg",
        "guestcategory",
        "vvip",
        "birthregion",
        "birthprovince",
        "guesttype",
        "idcheck",
        "idtype",
        "idnumber",
        "nationality",
        "dateofbirth",
        "idissueddate",
        "idexpirationdate",
        "passportvisacheck",
        "visatype",
        "visaname",
        "visanumber",
        "visaissueddate",
        "visabegindate",
        "visaexpirationdate",
        "visastatus",
        "visanotes",
        "rank",
        "grade",
        "guestidentity",
      ])
      .updateEntity(true)
      .execute();

    resp.status = "2000";
    resp.msg = "Success!";
    resp.content.push(items);
    console.log("put individualprofile", items);
    res.send(resp);
  } catch (error) {
    console.log("error", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.post("/individualprofile", async (req, res, next) => {
  try {
    const {
      nametitle,
      firstname,
      lastname,
      nameprefix,
      namesuffix,
      middleinitial,
      gender,
      religion,
      organization,
      provinceofresidence,
      bordercrossingentryplace,
      bordercrossingentrydate,
      address,
      address1,
      address2,
      conuty,
      city,
      stateprovince,
      postal,
      nopost,
      nrg,
      guestcategory,
      vvip,
      birthregion,
      birthprovince,
      guesttype,
      idcheck,
      idtype,
      idnumber,
      nationality,
      dateofbirth,
      idissueddate,
      idexpirationdate,
      passportvisacheck,
      visatype,
      visaname,
      visanumber,
      visaissueddate,
      visabegindate,
      visaexpirationdate,
      visastatus,
      visanotes,
      rank,
      grade,
      guestidentity,
      communications,
      relations
    } = req.body;

    function ranDomID() {
      return Math.floor(Math.random() * (10000 - 99 + 1) + 99);
    }

    var newID = ranDomID();

    console.log("Body post :", req.body);

    const cnnDup = getConnection.createQueryBuilder();
    const itemsAleady = await cnnDup
      .select(`nameid`)
      .from(`individualprofile`)
      .where(`nameid = '${newID}'`)
      .getRawOne();
    console.log("already ", itemsAleady);

    if (itemsAleady) {
      var newID = ranDomID();
    } else {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .insert()
        .into(`individualprofile`)
        .values({
          nameid: newID,
          nametitle: nametitle,
          firstname: firstname,
          lastname: lastname,
          nameprefix: nameprefix,
          namesuffix: namesuffix,
          middleinitial: middleinitial,
          gender: gender,
          religion: religion,
          organization: organization,
          provinceofresidence: provinceofresidence,
          bordercrossingentryplace: bordercrossingentryplace,
          bordercrossingentrydate: bordercrossingentrydate,
          address: address,
          address1: address1,
          address2: address2,
          conuty: conuty,
          city: city,
          stateprovince: stateprovince,
          postal: postal,
          nopost: nopost,
          nrg: nrg,
          guestcategory: guestcategory,
          vvip: vvip,
          birthregion: birthregion,
          birthprovince: birthprovince,
          guesttype: guesttype,
          idcheck: idcheck,
          idtype: idtype,
          idnumber: idnumber,
          nationality: nationality,
          dateofbirth: dateofbirth,
          idissueddate: idissueddate,
          idexpirationdate: idexpirationdate,
          passportvisacheck: passportvisacheck,
          visatype: visatype,
          visaname: visaname,
          visanumber: visanumber,
          visaissueddate: visaissueddate,
          visabegindate: visabegindate,
          visaexpirationdate: visaexpirationdate,
          visastatus: visastatus,
          visanotes: visanotes,
          rank: rank,
          grade: grade,
          guestidentity: guestidentity,
        })
        .returning([
          "nameid",
          "nametitle",
          "firstname",
          "lastname",
          "nameprefix",
          "namesuffix",
          "middleinitial",
          "gender",
          "religion",
          "organization",
          "provinceofresidence",
          "bordercrossingentryplace",
          "bordercrossingentrydate",
          "address",
          "address1",
          "address2",
          "conuty",
          "city",
          "stateprovince",
          "postal",
          "nopost",
          "nrg",
          "guestcategory",
          "vvip",
          "birthregion",
          "birthprovince",
          "guesttype",
          "idcheck",
          "idtype",
          "idnumber",
          "nationality",
          "dateofbirth",
          "idissueddate",
          "idexpirationdate",
          "passportvisacheck",
          "visatype",
          "visaname",
          "visanumber",
          "visaissueddate",
          "visabegindate",
          "visaexpirationdate",
          "visastatus",
          "visanotes",
          "rank",
          "grade",
          "guestidentity",
        ])
        .updateEntity(false)
        .execute();
      console.log("communications", communications);
      console.log("relations", relations);
      let communicationsDatas = [
        {
          nameid: newID,
          communication: "email",
          value: communications.email
        },
        {
          nameid: newID,
          communication: "mobile",
          value: communications.mobile
        }
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
        .into(`communications`)
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
        .into(`relations`)
        .values(relationsDatas).updateEntity(false)
        .execute();


      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success!  `;
      res.send(resp);
    }
    // else {
    //     resp.status = "1000";
    //     resp.msg = `Duplicate ${nameid} `;
    //     resp.content = [];
    //     res.send(resp);
    //   }
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.post("/individualprofilecommunication", async (req, res, next) => {

});

router.post("/individualprofilerelation", async (req, res, next) => {

});


router.delete("/individualprofile/:id", async (req, res, next) => {
  const nameid = parseInt(req.params.id);
  console.log("req.params == ", nameid);
  try {
    console.log("=======Delete=========");
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .delete()
      .from("individualprofile")
      .where(`nameid =${nameid} `)
      .execute();
    console.log("items", items);
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

module.exports = router;
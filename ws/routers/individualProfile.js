const express = require("express");
const router = express.Router();
const getConnection = require("typeorm");

var resp = {
  status: "1000",
  msg: "Access Denied",
  content: [],
};

router.get("/individualprofile", async (req, res, next) => {
  resp.content = [];
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
    statusprofile,
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
    // console.log(items);
    // resp.content.push(items);
    resp.content = items;
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.msg = "Failure";
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
      statusprofile,
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
    console.log("items", items);
    if (items) {
      resp.content = [];
      resp.content = items;
      resp.status = "2000";
      resp.msg = "Success";
    } else {
      resp.content = [];
      resp.status = "1000";
      resp.msg = "Failure";
    }
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.content = [];
    resp.msg = "Failure";
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
    if (Object.keys(items).length !== 0) {
      resp.content = [];
      resp.content = items;
      resp.status = "2000";
      resp.msg = "Success";
    } else {
      resp.status = "1000";
      resp.content = [];
      resp.msg = "Failure";
    }
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.content = [];
    resp.msg = "Failure";
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
    if (Object.keys(items).length !== 0) {
      resp.content = [];
      resp.content = items;
      resp.status = "2000";
      resp.msg = "Success";
    } else {
      resp.status = "1000";
      resp.content = [];
      resp.msg = "Failure";
    }
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.content = [];
    resp.msg = "Failure";
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
      statusprofile,
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
      relations,
      createdby,
    } = req.body;

    const connectionID = getConnection.createQueryBuilder();
    const id = await connectionID
      .select("max(nameid)")
      .from(`individualprofile`)
      .getRawOne();
    var newID = id.max + 1;

    console.log("Body post :", req.body);
    console.log("newID", newID);
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
        statusprofile: statusprofile,
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
        createdby: createdby,
      })
      .returning("*")
      .updateEntity(false)
      .execute();

    console.log("communications", communications);
    console.log("relations", relations);
    if (communications) {
      let communicationsDatas = [
        {
          nameid: newID,
          communication: "email",
          value: communications.email,
        },
        {
          nameid: newID,
          communication: "mobile",
          value: communications.mobile,
        },
      ];
      for (var key in communications) {
        if (key % 2 == 0)
          communicationsDatas.push({
            nameid: newID,
            communication: communications[key - 1],
            value: communications[key],
          });
      }

      const connection_communication = getConnection.createQueryBuilder();
      const insert_communication = await connection_communication
        .insert()
        .into(`communications`)
        .values(communicationsDatas)
        .updateEntity(false)
        .execute();
    }
    if (relations) {
      let relationsDatas = [];
      for (var key in relations) {
        // console.log("KEY post :::", key);
        if (key % 3 == 0)
          relationsDatas.push({
            nameid: id,
            relation: relations[key - 2],
            value: relations[key - 1],
            note: relations[key],
          });
        // console.log("relationsDatas == ", relationsDatas);
      }
      const connection_relations = getConnection.createQueryBuilder();
      const insert_relations = await connection_relations
        .insert()
        .into(`relations`)
        .values(relationsDatas)
        .updateEntity(false)
        .execute();
    }

    console.log("post items::", items);
    resp.content = [];
    resp.content = items.raw;
    // resp.content.push(items.raw);
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.content = [];
    resp.msg = "Failure";
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
      statusprofile,
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
      relations,
      updatedby,
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
        statusprofile: statusprofile,
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
        updatedby: updatedby,
      })
      .where(`nameid = ${id}`)
      .returning("*")
      .updateEntity(true)
      .execute();

    console.log("communications", communications);
    console.log("relations", relations);
    if (communications) {
      let communicationsDatas = [
        {
          nameid: id,
          communication: "email",
          value: communications.email,
        },
        {
          nameid: id,
          communication: "mobile",
          value: communications.mobile,
        },
      ];
      for (var key in communications) {
        if (key % 2 == 0)
          communicationsDatas.push({
            nameid: id,
            communication: communications[key - 1],
            value: communications[key],
          });
      }

      const connection_communication = getConnection.createQueryBuilder();
      const insert_communication = await connection_communication
        .insert()
        .into(`communications`)
        .values(communicationsDatas)
        .updateEntity(false)
        .execute();
    }

    if (relations) {
      let relationsDatas = [];
      for (var key in relations) {
        // console.log("KEY edit:::", key);
        if (key % 3 == 0)
          relationsDatas.push({
            nameid: id,
            relation: relations[key - 2],
            value: relations[key - 1],
            note: relations[key],
          });
        // console.log("relationsDatas == ", relationsDatas);
      }
      const connection_relations = getConnection.createQueryBuilder();
      const insert_relations = await connection_relations
        .insert()
        .into(`relations`)
        .values(relationsDatas)
        .updateEntity(false)
        .execute();
    }
    console.log("put individualprofile", items);
    if (items.affected !== 0) {
      resp.content = [];
      resp.content = items.raw;
      // resp.content.push(items.raw);
      resp.status = "2000";
      resp.msg = "Success";
    } else {
      resp.status = "1000";
      resp.content = [];
      resp.msg = "Failure";
    }
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.content = [];
    resp.msg = "Failure";
    res.send(resp);
  }
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
      .where(`nameid =${nameid}`)
      .returning("*")
      .execute();

    console.log("items", items);
    if (items.affected !== 0) {
      resp.content = [];
      resp.content = items.raw;
      // resp.content.push(items.raw);
      resp.status = "2000";
      resp.msg = "Success";
    } else {
      resp.status = "1000";
      resp.content = [];
      resp.msg = "Failure";
    }
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.status = "1000";
    resp.content = [];
    resp.msg = "Failure";
    res.send(resp);
  }
});

module.exports = router;

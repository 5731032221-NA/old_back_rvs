"use strict";
/*
 *System
 */
const {
  router,
  getConnection,
  SVC,
  getMsg,
  usrPerm,
  componentsUsr,
  userAuth,
} = require("../config/sysHeader");
/*
Biz
*/
// Optional
// ใช้ในการ R/W Logs
const Log = require("../sys/Log").Log;
const RMMST = require("../modules/rooms/masters").Masters;
// Global Constance
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE,
} = require("../config/service");
const pid = process.pid;
/*
 * Declaration
 */
const tbName = "roommst";
const typeModule = "Config";
const typeFunctions = "/room-masters";
const _COMPONENTID = "RM-MST-00892254";
const tbLogsName = "logsb";
const logFile = "logfpath";
const enpoint = "/room-masters";
/* ------------------------------------------------- */
// Global Variable
/* ============================== */
// eslint-disable-next-line require-await
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

/* router.get(`${enpointName}/:${id}`, async (req, res, next) => {
/* ตัวแปล enpoint ที่ */
router.get("/room-masters", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("*")
      .from(`roommst`)
      .orderBy("id")
      .getRawMany();
    // console.log(items);
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

router.get("/room-masters/:id", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("*")
      .from(`roommst`)

      .where("no = :id", {
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

router.get("/room-masters-keySearch/:keySearch", async (req, res, next) => {
  const Ksearch = req.params.keySearch;
  console.log("req.params.keySearch :", req.params.keySearch);
  try {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("*")
      .from(`roommst`)
      .where("no like :keySearch", {
        keySearch: `%${Ksearch}%`,
      })
      .orWhere("LOWER(propertycode) like LOWER(:keySearch)", {
        keySearch: `%${Ksearch}%`,
      })
      .orWhere("LOWER(type) like LOWER(:keySearch)", {
        keySearch: `%${Ksearch}%`,
      })
      .orWhere("LOWER(floor) like LOWER(:keySearch)", {
        keySearch: `%${Ksearch}%`,
      })
      .orWhere("LOWER(building) like LOWER(:keySearch)", {
        keySearch: `%${Ksearch}%`,
      })
      .orWhere("LOWER(description) like LOWER(:keySearch)", {
        keySearch: `%${Ksearch}%`,
      })
      .orWhere("LOWER(status) like LOWER(:keySearch)", {
        keySearch: `%${Ksearch}%`,
      })
      .orWhere("LOWER(attribute) like LOWER(:keySearch)", {
        keySearch: `%${Ksearch}%`,
      })
      .orderBy("id")
      .getRawMany();
    // console.log(items);
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

router.put("/room-masters/:id", async (req, res, next) => {
  const idforPut = req.params.id;
  console.log("======req.params.id at PUT by id :", req.params.id);
  try {
    const {
      roomNo,
      propertyDialog,
      roomTypeDialog,
      buildingDialog,
      wingDialog,
      exposureDialog,
      roomSizeDialog,
      roomSegDialog,
      roomStatusDialog,
      chipAttributeDialog,
      roomDesc,
      roomFloor,
    } = req.body;

    const cnn = getConnection.createQueryBuilder();
    const item = await cnn
      .select(`no`)
      .from(`roommst`)
      .where(`id = '${req.params.id}'`)
      .getRawOne();
    if (item.no != roomNo) {
      const cnnDup = getConnection.createQueryBuilder();
      const itemsAleady = await cnnDup
        .select(`no`)
        .from(`roommst`)
        .where(`no = '${roomNo}'`)
        .andWhere(`propertycode = '${propertyDialog}'`)
        .getRawOne();
      console.log("already ", itemsAleady);
      if (!itemsAleady) {
        const connection = getConnection.createQueryBuilder();
        const items = await connection
          .update(`roommst`)
          .set({
            propertycode: propertyDialog,
            no: roomNo,
            type: roomTypeDialog,
            wing: wingDialog,
            floor: roomFloor,
            building: buildingDialog,
            exposure: exposureDialog,
            description: roomDesc,
            sqsize: roomSizeDialog,
            seq: roomSegDialog,
            status: roomStatusDialog,
            attribute: chipAttributeDialog,
          })
          .where({
            id: req.params.id,
          })
          .returning([
            "propertycode",
            "no",
            "type",
            "wing",
            "floor",
            "building",
            "exposure",
            "description",
            "sqsize",
            "seq",
            "status",
            "attribute",
          ])
          .updateEntity(true)
          .execute();

        resp.status = "2000";
        resp.msg = "Success!";
        resp.content.push(items);
        console.log("put roommaster", items);
        res.send(resp);
      } else {
        resp.status = "1000";
        resp.msg = `Duplicate ${roomNo} `;
        resp.content = [];
        res.send(resp);
      }
    } else {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .update(`roommst`)
        .set({
          propertycode: propertyDialog,
          no: roomNo,
          type: roomTypeDialog,
          wing: wingDialog,
          floor: roomFloor,
          building: buildingDialog,
          exposure: exposureDialog,
          description: roomDesc,
          sqsize: roomSizeDialog,
          seq: roomSegDialog,
          status: roomStatusDialog,
          attribute: chipAttributeDialog,
        })
        .where({
          id: req.params.id,
        })
        .returning([
          "propertycode",
          "no",
          "type",
          "wing",
          "floor",
          "building",
          "exposure",
          "description",
          "sqsize",
          "seq",
          "status",
          "attribute",
        ])
        .updateEntity(true)
        .execute();

      resp.status = "2000";
      resp.msg = "Success!";
      resp.content.push(items);
      console.log("put roommaster", items);
      res.send(resp);
    }
  } catch (error) {
    const lg = new Log();
    lg.setLog(`${tag}|${error}`);
    console.log(error);
    res.send(resp);
  }
});

router.post("/room-masters", async (req, res, next) => {
  try {
    const {
      roomNo,
      propertyDialog,
      roomTypeDialog,
      buildingDialog,
      wingDialog,
      exposureDialog,
      roomSizeDialog,
      roomSegDialog,
      roomStatusDialog,
      chipAttributeDialog,
      roomDesc,
      roomFloor,
    } = req.body;

    console.log(`
      roomNo : ${roomNo},
      propertyDialog : ${propertyDialog},
      roomTypeDialog : ${roomTypeDialog},
      buildingDialog : ${buildingDialog},
      wingDialog : ${wingDialog},
      exposureDialog : ${exposureDialog},
      roomSizeDialog : ${roomSizeDialog},
      roomSegDialog : ${roomSegDialog},
      roomStatusDialog : ${roomStatusDialog},
      chipAttributeDialog : ${chipAttributeDialog},
      roomDesc : ${roomDesc},
      roomFloor : ${roomFloor}`);

    const cnnDup = getConnection.createQueryBuilder();
    const itemsAleady = await cnnDup
      .select(`no`)
      .from(`roommst`)
      .where(`no = '${roomNo}'`)
      .andWhere(`propertycode = '${propertyDialog}'`)
      .getRawOne();
    console.log("already ", itemsAleady);
    if (!itemsAleady) {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .insert()
        .into(`roommst`)
        .values({
          propertycode: propertyDialog,
          no: roomNo,
          type: roomTypeDialog,
          wing: wingDialog,
          floor: roomFloor,
          building: buildingDialog,
          exposure: exposureDialog,
          description: roomDesc,
          sqsize: roomSizeDialog,
          seq: roomSegDialog,
          status: roomStatusDialog,
          attribute: chipAttributeDialog,
        })
        .returning([
          "propertycode",
          "no",
          "type",
          "wing",
          "floor",
          "building",
          "exposure",
          "description",
          "sqsize",
          "seq",
          "status",
          "attribute",
        ])
        .updateEntity(false)
        .execute();

      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success!  `;
      res.send(resp);
    } else {
      resp.status = "1000";
      resp.msg = `Duplicate ${roomNo} `;
      resp.content = [];
      res.send(resp);
    }
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.delete("/room-masters/:roomnum", async (req, res, next) => {
  const roomnum = req.params.roomnum;
  try {
    console.log("=======Delete=========");
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .delete()
      .from("roommst")
      .where("no = :roomnum", { roomnum })
      .execute();
    console.log(items);
    // resp.content = [];
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

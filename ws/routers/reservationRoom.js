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
const tbName = "reservation";
const typeModule = "Config";
// const typeFunctions = "/room-masters";
const _COMPONENTID = "RM-MST-00892254";
const tbLogsName = "logsb";
const logFile = "logfpath";
// const enpoint = "/room-masters";
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
router.get("/reservation-room", async (req, res, next) => {
  try {
    const tkn = req.headers.authorization;
    // let usrVerify = userAuth(tkn, _COMPONENTID);
    let usrVerify = true;
    resp.content = [];
    console.log(usrVerify,_COMPONENTID);
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    } else {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .select("*")
        .from(`reservation`)
        .orderBy("id")
        .getRawMany();
      // console.log(items);
      resp.content.push(items);
      resp.status = "2000";
      resp.msg = "Success!";
      res.send(resp);
      // console.log(resp.content);
    }
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/reservation-room/:roomno", async (req, res, next) => {
  let resp = {
    status: SVC.DEFAULT.code,
    msg: SVC.DEFAULT.msg,
  };

  try {
    const tkn = req.headers.authorization;
    let usrVerify = userAuth(tkn, _COMPONENTID);
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    } else {
      console.log("================");
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .select("*")
        .from(`reservation`)

        .where("roomno = :roomno", {
          roomno: req.params.roomno,
        })
        .orderBy("id")
        .getRawOne();
      console.log(items);
      resp.content = [];
      resp.content.push(items);
      resp.status = "2000";
      resp.msg = "Success!";
      res.send(resp);
    }
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.put("/reservation-room/:roomno", async (req, res, next) => {
  console.log("======req.params.id at PUT by id :", req.params.roomno);
  try {
    const tkn = req.headers.authorization;
    let usrVerify = userAuth(tkn, _COMPONENTID);
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    } else {
      const { id, title, start, end } = req.body;
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .update(`reservation`)
        .set({
          roomno: id,
          startdate: start,
          enddate: end,
          description: title,
        })
        .where({
          roomno: req.params.roomno,
        })
        .returning(["roomno", "startdate", "enddate", "description"])
        .updateEntity(true)
        .execute();

      resp.status = "2000";
      resp.msg = "Success!";
      resp.content.push(items);
      console.log("put reservation room", items);
      res.send(resp);
    }
  } catch (error) {
    const lg = new Log();
    lg.setLog(`${tag}|${error}`);
    console.log(error);
    res.send(resp);
  }
});

router.post("/reservation-room", async (req, res, next) => {
  const roomno = parseInt(req.body.roomno);
  const { startdate, enddate, description ,firstname,lastname,phone,email} = req.body;
  try {
    const tkn = req.headers.authorization;
    // let usrVerify = userAuth(tkn, _COMPONENTID);
    let usrVerify = true;
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    } else {
      console.log(`
      roomno : ${roomno},
      startdate : ${startdate},
      enddate : ${enddate},
      description : ${description}`);

      const cnnDup = getConnection.createQueryBuilder();
      const itemsAleady = await cnnDup
        .select(`roomno`)
        .from(`reservation`)
        .where(`roomno = '${roomno}'`)
        .getRawOne();
      console.log("already ", itemsAleady);
      if (!itemsAleady) {
        const connection = getConnection.createQueryBuilder();
        const items = await connection
          .insert()
          .into(`reservation`)
          .values({
            roomno: roomno,
            startdate: startdate,
            enddate: enddate,
            description: description,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            email: email
          })
          .returning(["roomno", "startdate", "enddate", "description","firstname","lastname","phone","email"])
          .updateEntity(false)
          .execute();

        resp.content.push(items);
        resp.status = "2000";
        resp.msg = `Success!  `;
        res.send(resp);
      } else {
        resp.status = "1000";
        resp.msg = `Duplicate ${roomno} `;
        resp.content = [];
        res.send(resp);
      }
    }
  } catch (error) {
    console.log("error:",error);
    res.send(error);
  }
});

router.delete("/reservation-room/:roomno", async (req, res, next) => {
  const roomno = req.params.roomno;
  try {
    const tkn = req.headers.authorization;
    let usrVerify = userAuth(tkn, _COMPONENTID);
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    } else {
      console.log("=======Delete=========");
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .delete()
        .from("reservation")
        .where("roomno = :roomno", { roomno })
        .execute();
      console.log(items);
      // resp.content = [];
      resp.content.push(items);
      resp.status = "2000";
      resp.msg = "Success!";
      res.send(resp);
    }
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

module.exports = router;

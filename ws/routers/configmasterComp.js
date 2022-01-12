const express = require("express");
const router = express.Router();
/*************************************/
const getConnection = require("typeorm");
const crt = require("crypto");
const Log = require("../Utility/log").Log;
const { usrPerm, componentsUsr } = require("../queryparser/user");
const { userAuth } = require("../Utility/verify");
const Username = require("../model/Username").Username;
const Account = require("../model/Account").Account;
/*************************************/
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE,
} = require("../sys/service");
const pid = process.pid;
const tbName = "username";
const tagType = "user-management/users";
const _COMPONENTID = "UR-00845678";
/* ------------------------------------------------- */
let resp = {
  status: "0000",
  msg: "Access Denied",
  content: [],
};
/* ============================== */
router.get("/", (req, res, next) => {
  res.send(`process-${pid}--say-hi`);
});

function decodeToken(str) {
  if (str) {
    str = str.split(".")[1];

    str = str.replace("/-/g", "+");
    str = str.replace("/_/g", "/");
    switch (str.length % 4) {
      case 0:
        break;
      case 2:
        str += "==";
        break;
      case 3:
        str += "=";
        break;
      default:
        throw new Error("Invalid token");
    }

    str = (str + "===").slice(0, str.length + (str.length % 4));
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    str = decodeURIComponent(
      escape(Buffer.from(str, "base64").toString("binary"))
    );

    str = JSON.parse(str);
    return str;
  }
}

router.delete("/configmasterbyidcomp/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const connection = getConnection.createQueryBuilder();
    const drop = await connection
      .delete()
      .from("configmaster")
      .where("id  = :id", { id })
      .execute();

    resp.content.push(drop);
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.put("/updateconfigmasterbyidcomp/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const connection = getConnection.createQueryBuilder();
    const update = await connection
      .update("configmaster", req.body)
      .where("id  = :id", { id })
      .updateEntity(true)
      .execute();

    resp.content.push(update);
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get("/listconfigmastercomp", async (req, res, next) => {
  try {


    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("id,name,config")
      .from(`configmaster`)
      .getRawMany();
    resp.content.push(items);
    // }
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.post("/insertconfigmastercopm", async (req, res, next) => {
  try {
    console.log(req.body);
    const connection = getConnection.createQueryBuilder();
    const insertdata = await connection
      .insert()
      .into(`configmaster`)
      .values(req.body)
      .updateEntity(false)
      .execute();
    resp.content.push(insertdata);
    // }
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = "Failer";
    res.send(resp);
  }
});


module.exports = router;

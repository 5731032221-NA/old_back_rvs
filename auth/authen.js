const express = require("express");
const getConnection = require("typeorm");
const Log = require("../ws/Utility/log").Log;
/*************************************/
const { userMenus } = require("../ws/Utility/tools");
const { mdwAuth } = require("./mdwAuth");
const oauth = require("./tools/token");

const crt = require("crypto");
/*************************************/
const lgn = express.Router();
const pid = process.pid;
/* ------------------------------------------------- */
const tbName = "username";
const tagType = "/authen";
// const resp = {
//   status: '0000',
//   msg: 'Access Denied!',
//   contents: [],
//   items: []
// }
let clientIP = "";
/* ============================== */
/*
  reate by : Suthaphas Jindawhong
  Date Create : 28/09/2020
  function :  ตรวจสอบการมีสิทธิ์เข้าใช้งานและการให้สิทธิ์ตามที่กำหนด
 */

lgn.get("/", async (req, res, next) => {
  res.send(`process-${pid}--say-hi`);
});

/* POST: /login
 * Enpoint
 *	 login
 * Params:
 *   username      - format string [4-20]
 *   password      - format string [8-16][A-Za-z0-9^#$&@]
 * Return:
 *	 components 	 - JSON for render menu
 */

lgn.get("/refresh-token", async (req, res, next) => { });

lgn.get("/ad", async (req, res, next) => {
  res.send("hello world;")
});

lgn.get("/ldap", async (req, res, next) => {
  console.log(req.headers)
  let username = req.headers['x-credential-username']
  // Authorization = Authorization.replace('ldap ', '');
  // let buff = Buffer.from(Authorization, 'base64');
  // let username = buff.toString('ascii').split(':')[0];
  let resp = {
    status: "0000",
    msg: "Access Denied!",
    contents: [],
    items: [],
  };
  const connUsr = getConnection.createQueryBuilder();
  console
  const usr = await connUsr
    .select(
      `account.username, firstname, lastname, string_agg(distinct propertycode.propertycode, ',') property`
    )
    .from(`account`)
    .where(`account.adaccount = '${username.trim()}'`)
    .andWhere(`account.status = 'Active'`)
    .leftJoin(
      "grantproperty",
      "propertycode",
      "propertycode.username = account.username"
    )
    .groupBy("account.username ,firstname ,lastname")
    .getRawOne();
    
  if (usr) {
    console.log("usr", usr);
    let token = await oauth.gettoken(usr.username.trim());
    // console.log("token ======", token);
    if (usr.property.includes("*ALL")) {
      let allprop = await getConnection
        .createQueryBuilder()
        .select(` string_agg(distinct propertycode, ',') property`)
        .from(`grantproperty`)
        .where(`propertycode != '*ALL'`)
        .getRawOne();
      usr.property = allprop.property;
    }
    console.log("usr", usr);

    // const tkn = mdwAuth(usr);
    resp.status = "2000";
    resp.msg = "Success!";
    res.set("authorization", token);
    res.set("refreshToken", token);
    resp.contents.push({ refreshToken: token });
    resp.contents.push(usr);
  } else {
    resp.status = "2001";
    resp.msg = "Don't have permission";
  }
  res.send(resp);
  // let token = await oauth.gettoken("TESTLDAP");
  // resp.status = "2000";
  //     resp.msg = "Success!";
  //     res.set("authorization", token);
  //     res.set("refreshToken", token);
  //     resp.contents.push({ refreshToken: token });
  //     resp.contents.push({});
  // res.send(resp);
});


lgn.get("/login/ad", async (req, res, next) => {

  res.send("hello world;")
});

lgn.post("/login", async (req, res, next) => {
  let resp = {
    status: "0000",
    msg: "Access Denied!",
    contents: [],
    items: [],
  };
  try {
    const { username, password } = req.body.user;
    const pwd = crt
      .createHash("md5", "revopms")
      .update(password.trim())
      .digest("hex");
    // check regular expression
    const connUsr = getConnection.createQueryBuilder();
    console.log(`${username.trim()}`);
    console.log(`${pwd}`);
    const usr = await connUsr
      .select(
        `account.username, firstname, lastname, string_agg(distinct propertycode.propertycode, ',') property`
      )
      .from(`account`)
      .where(`account.username = '${username.trim()}'`)
      .andWhere(`password = '${pwd}'`)
      .andWhere(`status = 'Active'`)
      .leftJoin(
        "grantproperty",
        "propertycode",
        "propertycode.username = account.username"
      )
      .groupBy("account.username ,firstname ,lastname")
      .getRawOne();

    if (usr) {
      console.log("usr", usr);
      let token = await oauth.gettoken(username.trim());
      // console.log("token ======", token);
      if (usr.property.includes("*ALL")) {
        let allprop = await getConnection
          .createQueryBuilder()
          .select(` string_agg(distinct propertycode, ',') property`)
          .from(`grantproperty`)
          .where(`propertycode != '*ALL'`)
          .getRawOne();
        usr.property = allprop.property;
      }
      console.log("usr", usr);

      // const tkn = mdwAuth(usr);
      resp.status = "2000";
      resp.msg = "Success!";
      res.set("authorization", token);
      res.set("refreshToken", token);
      resp.contents.push({ refreshToken: token });
      resp.contents.push(usr);
    } else {
      resp.status = "2002";
      resp.msg = "Invalid Username or Password";
    }
    res.send(resp);
  } catch (error) {
    console.log("login ", error);
    resp.contents.push(error);
    res.send(resp);
  }
});

lgn.post("/oldlogin", async (req, res, next) => {
  console.log("called login");
  try {
    const { username, password } = req.body.user;
    const pwd = crt
      .createHash("md5", "revopms")
      .update(password.trim())
      .digest("hex");
    // check regular expression
    const connUsr = getConnection.createQueryBuilder();
    console.log(`${username.trim()}`);
    console.log(`${pwd}`);
    const usr = await connUsr
      .select(`userid, property, branch, firstname, lastname, role`)
      .from(`${tbName}`)
      .where(`userid = '${username.trim()}'`)
      .andWhere(`password = '${pwd}'`)
      .getRawOne();
    if (usr) {
      const whereDev = "dev = 'Y'";
      const whereBeta = "beta = 'N'";
      const status = "status = 'A'";
      const connPerm = getConnection.createQueryBuilder();
      let usrPerm = await connPerm
        .select(`userid, usrpermission, propertyid, branchid`)
        .from(`usrpermissionmst`)
        .where(`propertyid = '${usr.property}'`)
        .andWhere(`branchid = '${usr.branch}'`)
        .where(`userid = '${usr.userid.trim()}'`)
        .andWhere(`${status}`)
        // .andWhere(`${whereDev}`)
        // .andWhere(`${whereBeta}`)
        .getRawMany();
      let dataCon = [];
      console.log("usr", usrPerm);
      const hqPerm = usrPerm.filter((ele) => {
        // ("branchid",ele.branchid)
        if (ele.branchid === "HQ") {
          return ele.branchid;
        }
      });
      console.log(hqPerm);
      delete usrPerm[{ branchid: hqPerm[0].branchid }];
      if (hqPerm !== undefined) {
        let perms = hqPerm[0].usrpermission.split(",");
        const arrPosition = [];
        for (let i = 0; i < perms.length; i++) {
          if (perms[i] !== "") {
            arrPosition.push(i + 1);
          }
        }
        if (arrPosition.length > 0) {
          const where = arrPosition.join(",");
          const connComp = getConnection.createQueryBuilder();
          const usrComp = await connComp
            .select(`componentid, parent, icon, slug, position`)
            .from(`componentmst`)
            .where(`position IN (${where})`)
            .orderBy("seq", "ASC")
            .getRawMany();
          const obj = {
            propertyID: usr.property,
            branchID: usr.branch,
            userID: username,
            firstname: usr.firstname,
            lastname: usr.lastname.substring(0, 1),
            role: usr.role,
            components: userMenus(usrComp, perms),
          };
          dataCon.push(obj);
        }
      }
      const data = {
        user: username,
        property: usr.property,
        branch: usr.branch,
        role: usr.role,
      };
      const tkn = mdwAuth(data);
      resp.status = "2000";
      resp.msg = "Success!";
      res.set("authorization", tkn.accessToken);
      res.set("refreshToken", tkn.refreshToken);
      resp.contents.push(tkn);
      resp.contents.push(dataCon);
    } else {
      /*
        timpstamp,
        app/module (mailer) ,
        function (profile management),
        action/method (view/edit/delete),
        user, designation (workstation id/name, IP)
      */
      /*
      let lg = new Log()
      lg.setLog(
        `${tagType}|Authenticaion|login|${clientIP}|${username} ${password}`
      )
      */
      // Log.release(lg)
      resp.status = "2002";
      resp.msg = "Invalid Username or Password";
    }
    res.send(resp);
  } catch (error) {
    console.log("login ", error);
    resp.contents.push(error);
    res.send(resp);
  }
});

lgn.delete("/login", (req, res, next) => {
  const resp = {
    status: "0000",
    msg: "Access Denied!",
    contents: [],
    items: [],
  };
  resp.status = "2000";
  resp.msg = "Logout success";
  resp.contents = [];
  try {
    // clear headers
    delete req.headers.authorization;
    delete req.headers.refreshToken;
    res.send(resp);
  } catch (error) {
    resp.content.push(error);
    res.send(resp);
  }
});

module.exports = lgn;

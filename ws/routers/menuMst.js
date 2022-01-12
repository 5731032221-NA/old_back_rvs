const express = require("express");
const rtr = express.Router();
const getConnection = require("typeorm");
const Log = require("../Utility/log").Log;
const { usrPerm } = require("../queryparser/user");
const { userAuth } = require("../Utility/verify");
const { encodePerm } = require("../Utility/user");
const { CompTree } = require("../Utility/tools");
const { _READ, _SEPARATE } = require("../sys/service");
const pid = process.pid;
const tbName = "componentmst";
const tag = "/menu-master";
const _COMPONENTID = "MN-MASTER-00892254";
const cors = require("cors");
rtr.use(
  cors({
    origin: "*",
  })
);
const resp = {
  status: "0000",
  msg: "Access Denied!",
  content: [],
  items: [],
};
let mCall = 0;
rtr.get("/", async (req, res, next) => {
  res.send(`process-${pid}--say-hi`);
});
rtr.get("/menuproperty", async (req, res, next) => {
  try {
    console.log("client Call", mCall++);

    const tkn = req.headers.authorization;
    console.log("tkn ===", tkn);
    const { swProperty, swBranch } = req.body;
    let usrVerify = userAuth(tkn, tbName);
    if (usrVerify && parseInt(usrVerify.status) !== 3000) {
      const userid = usrVerify.sub.user;
      const property =
        swProperty !== undefined ? swProperty : usrVerify.sub.property;
      const branch = swBranch !== undefined ? swBranch : usrVerify.sub.branch;
      const whereDev = "dev = 'Y'";
      const whereBeta = "beta = 'N'";
      const status = "status = 'A'";
      let data = {};
      const cnnPermission = getConnection.createQueryBuilder();
      const items = await cnnPermission
        .select("userid,usrpermission, propertyid, branchid")
        .from(`usrpermissionmst`)
        .where(`branchid = '${branch}'`)
        .andWhere(`userid = '${userid}'`)
        .andWhere(`${status}`)
        .andWhere(`${whereDev}`)
        .andWhere(`${whereBeta}`)
        .getRawMany();

      resp.status = "2000";
      resp.content = items;
    } else {
      resp.status = usrVerify.status;
      resp.msg = usrVerify.msg;
      console.log("resp ", resp);
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

rtr.post("/menus", async (req, res, next) => {
  try {
    console.log("client Call", mCall++);
    const tkn = req.headers.authorization;
    console.log("req", req);
    // const { swProperty, swBranch } = req.body
    const swProperty = req.body.property;
    const swBranch = undefined;
    console.log("swProperty", swProperty);

    let usrVerify = userAuth(tkn, tbName);
    if (usrVerify && parseInt(usrVerify.status) !== 3000) {
      // const connection = getConnection.createQueryBuilder()
      /*
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _READ,
        usrVerify.sub.user,
        usrVerify.sub.role.propertyid,
        _SEPARATE
      )
      */
      const userid = usrVerify.sub.user;
      const property =
        swProperty !== undefined ? swProperty : usrVerify.sub.property;
      const branch = swBranch !== undefined ? swBranch : usrVerify.sub.branch;
      const whereDev = "dev = 'Y'";
      const whereBeta = "beta = 'N'";
      const status = "status = 'A'";
      let data = {};
      const cnnPermission = getConnection.createQueryBuilder();
      const items = await cnnPermission
        .select("userid,usrpermission, propertyid, branchid")
        .from(`usrpermissionmst`)
        .where(`propertyid = '${property}'`)
        .andWhere(`branchid = '${branch}'`)
        .andWhere(`userid = '${userid}'`)
        .andWhere(`${status}`)
        .andWhere(`${whereDev}`)
        .andWhere(`${whereBeta}`)
        .getRawOne();
      if (items !== undefined) {
        const usrPermissions = items.usrpermission.split(_SEPARATE);
        const arrPosition = [];
        for (let i = 0; i < usrPermissions.length; i++) {
          if (usrPermissions[i] !== "") {
            arrPosition.push(i + 1);
          }
        }
        if (arrPosition.length > 0) {
          const where$ = arrPosition.join(",");
          const connComponent = getConnection.createQueryBuilder();
          const components = await connComponent
            .select("componentid, name, icon, parent, position")
            .from(`${tbName}`)
            .where(`position IN (${where$})`)
            .getRawMany();

          const permissions = [];
          components.forEach((ele) => {
            const obj = {
              icon: ele.icon,
              slug: ele.name,
              permission: encodePerm(
                usrPermissions[parseInt(ele.position) - 1]
              ),
              _children: [],
            };
            permissions.push(obj);
          });
          const obj = {
            propertyID: items.propertyid,
            branchID: items.branchid,
            userID: items.userid,
            components: permissions,
          };

          data = obj;
          console.log(data);
          resp.msg = "Success!";
        }
        resp.msg = "Welcome New Member!";
      } else {
        resp.msg = "Welcome New Member!";
      }
      resp.status = "2000";
      resp.content = data;
    } else {
      resp.status = usrVerify.status;
      resp.msg = usrVerify.msg;
      console.log("resp ", resp);
    }
    res.send(resp);
  } catch (error) {
    /*
    const lg = new Log()
    lg.setLog( `${ tag }|${ error }` )
    */
    console.log(error);
    res.send(resp);
  }
});

rtr.get("/menus", async (req, res, next) => {
  try {
    console.log("client Call", mCall++);
    const tkn = req.headers.authorization;
    const { swProperty, swBranch } = req.body;
    let usrVerify = userAuth(tkn, tbName);
    if (usrVerify && parseInt(usrVerify.status) !== 3000) {
      // const connection = getConnection.createQueryBuilder()
      /*
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _READ,
        usrVerify.sub.user,
        usrVerify.sub.role.propertyid,
        _SEPARATE
      )
      */
      const userid = usrVerify.sub.user;
      const property =
        swProperty !== undefined ? swProperty : usrVerify.sub.property;
      const branch = swBranch !== undefined ? swBranch : usrVerify.sub.branch;
      const whereDev = "dev = 'Y'";
      const whereBeta = "beta = 'N'";
      const status = "status = 'A'";
      let data = {};
      const cnnPermission = getConnection.createQueryBuilder();
      const items = await cnnPermission
        .select("userid,usrpermission, propertyid, branchid")
        .from(`usrpermissionmst`)
        .where(`propertyid = '${property}'`)
        .andWhere(`branchid = '${branch}'`)
        .andWhere(`userid = '${userid}'`)
        .andWhere(`${status}`)
        .andWhere(`${whereDev}`)
        .andWhere(`${whereBeta}`)
        .getRawOne();
      if (items !== undefined) {
        const usrPermissions = items.usrpermission.split(_SEPARATE);
        const arrPosition = [];
        for (let i = 0; i < usrPermissions.length; i++) {
          if (usrPermissions[i] !== "") {
            arrPosition.push(i + 1);
          }
        }
        if (arrPosition.length > 0) {
          const where$ = arrPosition.join(",");
          const connComponent = getConnection.createQueryBuilder();
          const components = await connComponent
            .select("componentid, name, icon, parent, position")
            .from(`${tbName}`)
            .where(`position IN (${where$})`)
            .getRawMany();

          const permissions = [];
          components.forEach((ele) => {
            const obj = {
              icon: ele.icon,
              slug: ele.name,
              permission: encodePerm(
                usrPermissions[parseInt(ele.position) - 1]
              ),
              _children: [],
            };
            permissions.push(obj);
          });
          const obj = {
            propertyID: items.propertyid,
            branchID: items.branchid,
            userID: items.userid,
            components: permissions,
          };

          data = obj;
          console.log(data);
          resp.msg = "Success!";
        }
        resp.msg = "Welcome New Member!";
      } else {
        resp.msg = "Welcome New Member!";
      }
      resp.status = "2000";
      resp.content = data;
    } else {
      resp.status = usrVerify.status;
      resp.msg = usrVerify.msg;
      console.log("resp ", resp);
    }
    res.send(resp);
  } catch (error) {
    /*
    const lg = new Log()
    lg.setLog( `${ tag }|${ error }` )
    */
    console.log(error);
    res.send(resp);
  }
});

module.exports = rtr;

const express = require("express");
const rtr = express.Router();
const getConnection = require("typeorm");
const Log = require("../Utility/log").Log;
const { usrPerm } = require("../queryparser/user");
const { userAuth } = require("../Utility/verify");
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE,
} = require("../sys/service");
const pid = process.pid;
const tbName = "componentmst";
const tag = "/component-master";
const _COMPONENTID = "CN-MASTER-00892254";
const resp = {
  status: "0000",
  msg: "Access Denied!",
  content: [],
  items: [],
};
// eslint-disable-next-line require-await
rtr.get("/", async (req, res, next) => {
  res.send(`process-${pid}--say-hi`);
});
rtr.get("/components", async (req, res, next) => {
  try {
    const tkn = req.headers.authorization;
    colsole.log("tkn =================", tkn);
    //  const usrVerify = userAuth(tkn)
    const usrVerify = true;
    if (usrVerify) {
      const connection = getConnection.createQueryBuilder();
      /*
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _READ,
        usrVerify.sub.user.toUpperCase(),
        usrVerify.sub.role.propertyid.toUpperCase(),
        _SEPARATE
      )
      */
      const uhp = true;
      if (uhp) {
        const items = await connection.select().from(`${tbName}`).getRawMany();
        resp.status = "2000";
        resp.msg = "Success!";
        resp.content = items;
      } else {
        resp.status = "2001";
        resp.msg = "Permission Denined.";
      }
    } else {
      resp.status = "2002";
    }

    res.send(resp);
  } catch (error) {
    const lg = new Log();
    lg.setLog(`${tag}|${error}`);
    console.log(error);
    res.send(resp);
  }
});

rtr.post("/usr-permissions", async (req, res, next) => {
  try {
    const {
      rmproperty,
      rmno,
      rmtypeid,
      wingid,
      floorid,
      buildingid,
      exposureid,
      rmdesc,
      rmsqsize,
      rmseq,
      rmstatus,
      rmattribute,
    } = req.body;
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    if (usrVerify) {
      const connection = getConnection.createQueryBuilder();
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _CREATE,
        usrVerify.sub.user.toUpperCase(),
        usrVerify.sub.role.propertyid.toUpperCase(),
        _SEPARATE
      );
      if (uhp) {
        const dup = await connection
          .select()
          .from(`${tbName}`)
          .where(`TRIM(rmproperty) = '${rmproperty}'`)
          .andWhere(`TRIM(rmno) = '${rmno}'`)
          .getRawMany();
        if (dup.length === 0) {
          const obj = {
            rmproperty,
            rmno,
            rmtypeid,
            floorid,
            wingid,
            buildingid,
            exposureid,
            rmdesc,
            rmsqsize,
            rmseq,
            rmstatus,
            rmattribute,
          };
          const items = await connection
            .insert()
            .into(`${tbName}`)
            .values(obj)
            .returning([
              "rmproperty",
              "rmno",
              "rmtypeid",
              "floorid",
              "rmdesc",
              "rmdesc",
              "rmsqsize",
              "rmseq",
              "rmstatus",
              "rmattribute",
            ])
            .updateEntity(false)
            .execute();
          resp.status = "2000";
          resp.msg = "Save Success!";
          resp.content.push(items);
        } else {
          resp.items.push(rmproperty);
          resp.items.push(rmno);
          resp.status = "1000";
          resp.msg = `${rmproperty} - ${rmno} :  Already exists.`;
        }
      } else {
        resp.status = "2001";
        resp.msg = "Permission Denied.";
      }
    } else {
      resp.status = "2002";
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    const data = `${tag}|${error}`;
    const lg = new Log();
    lg.setLog(data);
    resp.msg = error;
    res.send(resp);
  }
});

rtr.put("/usr-permissions/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      rmproperty,
      rmno,
      rmtypeid,
      wingid,
      floorid,
      buildingid,
      exposureid,
      rmdesc,
      rmsqsize,
      rmseq,
      rmstatus,
      rmattribute,
    } = req.body;
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    if (usrVerify) {
      const connection = getConnection.createQueryBuilder();
      // propertyid, userID
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _UPDATE,
        usrVerify.sub.user.toUpperCase(),
        usrVerify.sub.role.propertyid.toUpperCase(),
        _SEPARATE
      );
      if (uhp) {
        const obj = {
          rmtypeid: rmproperty,
          rmno,
          floorid,
          wingid,
          buildingid,
          exposureid,
          rmdesc,
          rmsqsize,
          rmseq,
          rmstatus,
          rmattribute,
        };
        const items = await connection
          .update(`${tbName}`)
          .set(obj)
          .where(`rmproperty = '${id.trim()}'`)
          .andWhere(`rmno = '${rmno.trim()}'`)
          .returning([
            "propertyid",
            "rmno",
            "floorid",
            "wingid",
            "buildingid",
            "exposureid",
            "rmdesc",
            "rmsqsize",
            "rmseq",
            "rmstatus",
          ])
          .updateEntity(true)
          .execute();

        resp.status = "2000";
        resp.msg = `Create ${rmno} : Success!`;
        resp.content = items;
      } else {
        resp.status = "2001";
        resp.msg = "Permission Denied.";
      }
    } else {
      resp.status = "2002";
    }
    res.send(resp);
  } catch (e) {
    const data = `${tag} |${e}`;
    // method, error number
    // error message ที่มี error number
    console.log(e);
    const lg = new Log();
    lg.setLog(data);
    res.send(resp);
  }
});

rtr.delete("/compponents/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { componentid, componentName, position, seq, state } = req.body;
    const tkn = req.headers.authorization;
    const usrVerify = userAuth(tkn);
    if (usrVerify) {
      const connection = getConnection.createQueryBuilder();
      // propertyid, userID
      const uhp = await usrPerm(
        connection,
        _COMPONENTID,
        _CREATE,
        usrVerify.sub.user.toUpperCase(),
        usrVerify.sub.role.propertyid.toUpperCase(),
        _SEPARATE
      );
      if (uhp) {
        const obj = {
          componentid,
          name: componentName,
          position: parseInt(position),
          seq: parseInt(seq),
          state,
        };
        const items = await connection
          .update(`${tbName}`)
          .set(obj)
          .where(`rmproperty = '${id.trim()}'`)
          .andWhere(`rmno = '${rmno.trim()}'`)
          .returning([
            "propertyid",
            "rmno",
            "floorid",
            "wingid",
            "buildingid",
            "exposureid",
            "rmdesc",
            "rmsqsize",
            "rmseq",
            "rmstatus",
          ])
          .updateEntity(true)
          .execute();

        resp.status = "2000";
        resp.msg = `Create ${rmno} : Success!`;
        resp.content = items;
      } else {
        resp.status = "2001";
        resp.msg = "Permission Denied.";
      }
    } else {
      resp.status = "2002";
    }
    res.send(resp);
  } catch (error) {
    const data = `${tag} |${e}`;
    // method, error number
    // error message ที่มี error number
    console.log(e);
    const lg = new Log();
    lg.setLog(data);
    res.send(resp);
  }
});

module.exports = rtr;

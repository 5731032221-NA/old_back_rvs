const express = require("express");
const router = express.Router();
const axios = require("axios");
const https = require("https");
const { exec } = require("child_process");

/*************************************/
const getConnection = require("typeorm");
const crt = require("crypto");
const Log = require("../Utility/log").Log;
const {
  usrPerm,
  componentsUsr
} = require("../queryparser/user");
const {
  userAuth
} = require("../Utility/verify");
const Username = require("../model/Username").Username;
const Account = require("../model/Account").Account;
const cors = require("cors");
/*************************************/
const {
  _READ,
  _CREATE,
  _UPDATE,
  _DELETE,
  _SEPARATE,
} = require("../sys/service");
const e = require("express");
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

router.use(
  cors({
    origin: "*",
  })
);
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

async function kickuser(username) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get("http://localhost:8001/consumers/" + username + "/oauth2/")
        .then((resclient) => {
          console.log(resclient.data.data);
          if (resclient.data.data.length > 0) {
            axios
              .get(
                "http://localhost:8001/oauth2/" +
                resclient.data.data[0].client_id +
                "/oauth2_tokens"
              )
              .then((restokens) => {
                console.log(restokens.data.data);
                if (restokens.data.data.length > 0) {
                  restokens.data.data.forEach((element) =>
                    axios.delete(
                      "http://localhost:8001/oauth2_tokens/" + element.id
                    )
                  );
                  resolve(true);
                } else {
                  resolve(true);
                }
              });
          } else {
            resolve(true);
          }
        });
    } catch (err) {
      resolve(true);
    }
  });
}

router.get("/changestatus/:username/:status", async (req, res, next) => {
  try {
    if (req.params.status == "Active") {
      console.log("kick", req.params.username);
      const connection = getConnection.createQueryBuilder();
      const updateconfig = await connection
        .update(`account`, {
          status: "Inactive",
        })
        .where({
          username: req.params.username,
        })
        .updateEntity(true)
        .execute();
      try {
        kickuser(req.params.username);
      } catch (err) {
        resp.status = "2000";
        resp.msg = "Success";
        res.send(resp);
      }
      resp.status = "2000";
      resp.msg = "Success";
      res.send(resp);
    } else {
      console.log("active");
      const connection = getConnection.createQueryBuilder();
      const updateconfig = await connection
        .update(`account`, {
          status: "Active",
        })
        .where({
          username: req.params.username,
        })
        .updateEntity(true)
        .execute();
      resp.status = "2000";
      resp.msg = "Success";
      res.send(resp);
    }
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.post("/rolegroup", async (req, res, next) => {
  try {
    const params = req.body;
    console.log("params", params);
    let rolecode = params.rolecode.trim();
    let rolename = params.rolename.trim();
    let description = params.description.trim();
    let applyproperty = params.applyproperty;
    let applyGroup = params.applyGroup;
    let status = params.status;
    console.log("applyproperty", applyproperty);
    const cnnDup = getConnection.createQueryBuilder();
    const itemsAleady = await cnnDup
      .select(`rolecode`)
      .from(`rolegroup`)
      .where(`rolecode = '${rolecode}'`)
      // .andWhere(`lastname = '${lName}'`)
      .getRawOne();
    console.log("already ", itemsAleady);
    if (!itemsAleady) {
      console.log("permission", req.body.permission);
      const permconnection = getConnection.createQueryBuilder();
      const perm = await permconnection
        .insert()
        .into(`rolepermission`)
        .values(req.body.permission)
        .updateEntity(false)
        .execute();

      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .insert()
        .into(`rolegroup`)
        .values({
          rolecode: rolecode,
          rolename: rolename,
          description: description,
          applypropertys: applyproperty,
          applygroups: applyGroup,
          status: status,
        })
        .updateEntity(false)
        .execute();

      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success! `;
    } else {
      resp.status = "1000";
      resp.msg = `Duplicate`;
      resp.content = [];
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.put("/rolegroup", async (req, res, next) => {
  try {
    console.log("put role");
    const params = req.body;
    console.log("params", params);
    let oldrolecode = params.oldrolecode.trim();
    let rolecode = params.rolecode.trim();
    let rolename = params.rolename.trim();
    let description = params.description.trim();
    let applyproperty = params.applyproperty;
    let applyGroup = params.applyGroup;
    let status = params.status;
    console.log("applyproperty", applyproperty);
    let itemsAleady = null;

    if (oldrolecode !== rolecode) {
      const cnnDup = getConnection.createQueryBuilder();
      itemsAleady = await cnnDup
        .select(`rolecode`)
        .from(`rolegroup`)
        .where(`rolecode = '${rolecode}'`)
        .getRawOne();
    }

    if (!itemsAleady) {
      const connectiondrop = getConnection.createQueryBuilder();
      const drop = await connectiondrop
        .delete()
        .from("rolepermission")
        .where("rolecode  = :oldrolecode", {
          oldrolecode,
        })
        .execute();
      console.log("drop", drop);
      if (drop) {
        const permconnection = getConnection.createQueryBuilder();
        const perm = await permconnection
          .insert()
          .into(`rolepermission`)
          .values(req.body.permission)
          .updateEntity(false)
          .execute();
        console.log("perm", perm);
      }
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .update(`rolegroup`, {
          rolecode: rolecode,
          rolename: rolename,
          description: description,
          applypropertys: applyproperty,
          applygroups: applyGroup,
          status: status,
        })
        .where({
          rolecode: oldrolecode,
        })
        .updateEntity(true)
        .execute();

      console.log("items", items);

      if ((status = "Inactive")) {
        const dropconnection = getConnection.createQueryBuilder();
        const drop = await dropconnection
          .delete()
          .from("userrole")
          .where("rolecode  = :oldrolecode", {
            oldrolecode,
          })
          .execute();
      } else {
        const connectionrolerelation = getConnection.createQueryBuilder();
        const updaterolerelation = await connectionrolerelation
          .update(`userrole`, {
            rolecode: rolecode,
          })
          .where({
            rolecode: oldrolecode,
          })
          .updateEntity(true)
          .execute();
      }

      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success! `;
    } else {
      resp.status = "1000";
      resp.msg = `Duplicate`;
      resp.content = [];
    }

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.delete("/rolegroup/:rolecode", async (req, res, next) => {
  try {
    let rolecode = req.params.rolecode;
    const connection = getConnection.createQueryBuilder();
    const drop = await connection
      .delete()
      .from("rolegroup")
      .where("rolecode  = :rolecode", {
        rolecode,
      })
      .execute();

    const connectionper = getConnection.createQueryBuilder();
    const dropper = await connectionper
      .delete()
      .from("rolepermission")
      .where("rolecode  = :rolecode", {
        rolecode,
      })
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

router.delete("/user/:username", async (req, res, next) => {
  try {
    let username = req.params.username;
    const connection = getConnection.createQueryBuilder();
    const drop = await connection
      .delete()
      .from("account")
      .where("username  = :username", {
        username,
      })
      .execute();

    const connectionper = getConnection.createQueryBuilder();
    const dropper = await connectionper
      .delete()
      .from("userpermission")
      .where("username  = :username", {
        username,
      })
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

router.get("/userpermissionbyusername/:username", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const rolepermission = await connection
      .select(
        ` componentcode ,permissioncreate,permissionread, permissionupdate,permissiondelete `
      )
      .from(`userpermission`)
      .where(`username = '${req.params.username}'`)
      .getRawMany();
    resdata = {};
    rolepermission.forEach(async (ele) => {
      resdata[ele.componentcode] = {
        permissioncreate: ele.permissioncreate,
        permissionread: ele.permissionread,
        permissionupdate: ele.permissionupdate,
        permissiondelete: ele.permissiondelete,
      };
    });
    resp.content.push(resdata);
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get(
  "/configurationbypropertycode/:propertycode",
  async (req, res, next) => {
    try {
      let authorization = req.headers["Authorization"];
      // http://localhost:8001/oauth2_tokens/LegWw9MBjt5WoCevgQOTvdp0a2ocA1GY
      const connection = getConnection.createQueryBuilder();
      const configuration = await connection
        .select(` configuration `)
        .from(`configuration`)
        .where(`propertycode = '${req.params.propertycode}'`)
        .getRawOne();
      // console.log("configuration1",configuration)
      console.log("configuration", configuration.configuration);
      resp.content.push(configuration.configuration);
      resp.status = "2000";
      resp.msg = "Success";
      res.send(resp);
    } catch (error) {
      console.log(error);
      res.send(resp);
    }
  }
);

let isAreadycofCode = null;
let isAreadycofName = null;
async function checkDuplicateData(data, checkdata) {
  if (checkdata.type) {
    const s = checkdata.RefNo.split(".");
    let ab = "";
    let isc = 0;
    for (const sm in s) {
      if (isc == 0) {
        ab += s[sm];
      } else if (s.length - 1 > isc) {
        ab += "." + s[sm];
      }
      isc += 1;
    }

    await data.forEach((element) => {
      if (ab == element.RefNo) {
        let checkdu = null;
        for (let xs = 0; xs < element.children.length; xs++) {
          if (
            element.children[xs].RefNo != checkdata.RefNo &&
            element.children[xs].name_en == checkdata.name
          ) {
            isAreadycofName = element.children[xs].name_en;
          }
        }
      } else if (element.children) {
        checkDuplicateData(element.children, checkdata);
      }
    });
  } else {
    await data.forEach((element) => {
      if (checkdata.RefNo == element.RefNo) {
        // console.log("tes2:",element.children);

        if (element.children) {
          for (let i = 0; i < element.children.length; i++) {
            if (checkdata.code === element.children[i].code) {
              isAreadycofCode = element.children[i].code;
            }
            if (checkdata.name === element.children[i].name_en) {
              isAreadycofName = element.children[i].name_en;
            }
          }
        }
      } else if (element.children) {
        checkDuplicateData(element.children, checkdata);
      }
    });
  }
}

router.put("/configuration", async (req, res, next) => {
  try {
    // console.log("propertycheckduplicate:",req.body.propertycheckduplicate);
    isAreadycofCode = null;
    isAreadycofName = null;
    if (req.body.propertycheckduplicate) {
      const connectionselect = getConnection.createQueryBuilder();
      const configuration = await connectionselect
        .select(` configuration `)
        .from(`configuration`)
        .where(`propertycode = '${req.body.propertycode}'`)
        .getRawOne();

      await checkDuplicateData(
        configuration.configuration,
        req.body.propertycheckduplicate
      );
    }

    if (isAreadycofCode) {
      console.log("isAreadycofCode:", isAreadycofCode);
      resp.status = "1000";
      resp.msg = `Duplicate Code: ${isAreadycofCode}`;
      resp.content = [];
    } else if (isAreadycofName) {
      console.log("isAreadycofName:", isAreadycofName);
      resp.status = "1000";
      resp.msg = `Duplicate Name: ${isAreadycofName}`;
      resp.content = [];
    } else {
      const connection = getConnection.createQueryBuilder();
      const updateconfig = await connection
        .update(`configuration`, {
          configuration: JSON.stringify(req.body.configuration, null, 1),
        })
        .where({
          propertycode: req.body.propertycode,
        })
        .updateEntity(true)
        .execute();

      resp.content.push(updateconfig);
      resp.status = "2000";
      resp.msg = "Success";
    }

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get("/userpermissionbyusername/:username", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const rolepermission = await connection
      .select(
        ` componentcode ,permissioncreate,permissionread, permissionupdate,permissiondelete `
      )
      .from(`userpermission`)
      .where(`username = '${req.params.username}'`)
      .getRawMany();
    resdata = {};
    rolepermission.forEach(async (ele) => {
      resdata[ele.componentcode] = {
        permissioncreate: ele.permissioncreate,
        permissionread: ele.permissionread,
        permissionupdate: ele.permissionupdate,
        permissiondelete: ele.permissiondelete,
      };
    });
    resp.content.push(resdata);
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.post("/rolepermissionbyrole", async (req, res, next) => {
  try {
    console.log("roles", req.body.roles);
    // req.body.roles.forEach(async (ele) => {
    //   let cnnProperty = getConnection.createQueryBuilder()
    //   let insertProperty = await cnnProperty
    //     .insert()
    //     .into(`grantproperty`)
    //     .values({
    //       username: code,
    //       propertycode: ele
    //     })
    //     .updateEntity(false)
    //     .execute()
    // })
    let arrayrole = "('" + req.body.roles.join("','") + "')";
    const connection = getConnection.createQueryBuilder();
    const rolepermission = await connection
      .select(
        ` componentcode ,sum(permissioncreate) permissioncreate,sum(permissionread) permissionread,sum(permissionupdate) permissionupdate,sum(permissiondelete) permissiondelete `
      )
      .from(`rolepermission`)
      .where(`rolecode IN ${arrayrole}`)
      .groupBy("componentcode")
      .getRawMany();
    resdata = {};
    rolepermission.forEach(async (ele) => {
      resdata[ele.componentcode] = {
        permissioncreate: ele.permissioncreate,
        permissionread: ele.permissionread,
        permissionupdate: ele.permissionupdate,
        permissiondelete: ele.permissiondelete,
      };
    });
    resp.content.push(resdata);
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.post("/user", async (req, res, next) => {
  try {
    const params = req.body;
    console.log("params", params);
    let fName = params.firstname.trim();
    let lName = params.lastname.trim();
    let code = params.code.trim();
    let position = params.position.trim();
    let grantproperty = params.userproperty;
    let roles = params.role;
    let status = params.status;
    let ad = params.adaccount;
    console.log("roles", roles);

    console.log("permission", req.body.permission);
    const permconnection = getConnection.createQueryBuilder();
    const perm = await permconnection
      .insert()
      .into(`userpermission`)
      .values(req.body.permission)
      .updateEntity(false)
      .execute();

    grantproperty.split(",").forEach(async (ele) => {
      let cnnProperty = getConnection.createQueryBuilder();
      let insertProperty = await cnnProperty
        .insert()
        .into(`grantproperty`)
        .values({
          username: code,
          propertycode: ele,
        })
        .updateEntity(false)
        .execute();
    });

    roles.split(",").forEach(async (ele) => {
      let cnnRole = getConnection.createQueryBuilder();
      let insertRole = await cnnRole
        .insert()
        .into(`userrole`)
        .values({
          username: code,
          rolecode: ele,
        })
        .updateEntity(false)
        .execute();
    });

    const cnnDup = getConnection.createQueryBuilder();
    const itemsAleady = await cnnDup
      .select(`username`)
      .from(`account`)
      .where(`username = '${code}'`)
      // .andWhere(`lastname = '${lName}'`)
      .getRawOne();
    console.log("already ", itemsAleady);
    if (!itemsAleady) {
      let pwd = new Date().getTime().toString(36);
      const userid = fName.substring(0, 3) + lName.substring(0, 2);
      let usrMsg = `  ID : ${userid}  PASS: ${pwd}`;
      console.log(usrMsg);
      pwd = crt.createHash("md5", "revopms").update(pwd).digest("hex");

      // Generate รหัสพนักงาน  6 digit ใส่ id auto gen ป้องกันการใส่่เองใน db เพราะ chema ใส่ไว้เป็น int ฉะนั้น id ที่เป็นจุดทสนิยม จะทำให้ระบบไม่สามารถทำงานได้
      // select coalesce(MAX(id), 0) +1 as uu from username
      const username1 = new Account(
        fName,
        lName,
        code,
        pwd,
        position,
        status,
        ad
      );
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .insert()
        .into(`account`)
        .values([username1])
        .returning([
          "firstname",
          "lastname",
          "username",
          "pwd",
          "position",
          "status",
          "adaccount",
        ])
        .updateEntity(false)
        .execute();

      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success!  ${usrMsg}`;
    } else {
      resp.status = "1000";
      resp.msg = `Duplicate ${code}`;
      resp.content = [];
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get("/usernamebyproperty/:property", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const grantproperty = await connection
      .select(` string_agg(distinct username, ',') usernames`)
      .from(`grantproperty`)
      .where(`propertycode = '${req.params.property}'`)
      .getRawOne();

    resp.content.push(grantproperty.usernames);
    resp.status = "2000";
    resp.msg = `Success!`;

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get("/userpropertybyusername/:username", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const grantproperty = await connection
      .select(` username ,string_agg(distinct propertycode, ',') propertycodes`)
      .from(`grantproperty`)
      .where(`username = '${req.params.username}'`)
      .groupBy("username")
      .getRawOne();

    resp.content.push(grantproperty.propertycodes);
    resp.status = "2000";
    resp.msg = `Success!`;

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get("/userrolebyusername/:username", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const userrole = await connection
      .select(` username ,string_agg(distinct role.rolename, ',') rn`)
      .from(`userrole`)
      .innerJoin("rolegroup", "role", "userrole.rolecode = role.rolecode")
      .where(`username = '${req.params.username}'`)
      .groupBy("username")
      .getRawOne();
    if (userrole) {
      resp.content.push(userrole.rn);
      resp.status = "2000";
      resp.msg = `Success!`;
    } else {
      resp.content.push("");
      resp.status = "2000";
      resp.msg = `Success!`;
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get("/position", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const position = await connection
      .select(`position.position`)
      .from(`position`)
      .getRawMany();

    resp.content.push(position);
    resp.status = "2000";
    resp.msg = `Success! `;

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.post("/position", async (req, res, next) => {
  try {
    const connection = getConnection.createQueryBuilder();
    const position = await connection
      .insert()
      .into(`position`)
      .values(req.body)
      .updateEntity(false)
      .execute();

    resp.content.push(position);
    resp.status = "2000";
    resp.msg = `Success! `;

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.put("/user", async (req, res, next) => {
  try {
    const params = req.body;
    console.log("params", params);
    let fName = params.firstname.trim();
    let lName = params.lastname.trim();
    let code = params.code.trim();
    let position = params.position.trim();
    let grantproperty = params.userproperty;
    let roles = params.role;
    let status = params.status;
    let ad = params.adaccount;
    let oldUserName = params.oldUserName.trim();
    console.log("roles", roles);
    let userAleady = null;

    if (oldUserName !== code) {
      const checkDup = getConnection.createQueryBuilder();
      userAleady = await checkDup
        .select(`username`)
        .from(`account`)
        .where(`username = '${code}'`)
        .getRawOne();
    }

    if (!userAleady) {
      const connectiondrop3 = getConnection.createQueryBuilder();
      const drop3 = await connectiondrop3
        .delete()
        .from("userpermission")
        .where("username  = :oldUserName", {
          oldUserName,
        })
        .execute();
      console.log("drop3", drop3);
      if (drop3) {
        console.log("permission", req.body.permission);
        const permconnection = getConnection.createQueryBuilder();
        const perm = await permconnection
          .insert()
          .into(`userpermission`)
          .values(req.body.permission)
          .updateEntity(false)
          .execute();
      }

      const connectiondrop = getConnection.createQueryBuilder();
      const drop = await connectiondrop
        .delete()
        .from("grantproperty")
        .where("username  = :oldUserName", {
          oldUserName,
        })
        .execute();
      console.log("drop", drop);
      if (drop) {
        grantproperty.split(",").forEach(async (ele) => {
          let cnnProperty = getConnection.createQueryBuilder();
          let insertProperty = await cnnProperty
            .insert()
            .into(`grantproperty`)
            .values({
              username: code,
              propertycode: ele,
            })
            .updateEntity(false)
            .execute();
        });
      }
      const connectiondrop2 = getConnection.createQueryBuilder();
      const drop2 = await connectiondrop2
        .delete()
        .from("userrole")
        .where("username  = :oldUserName", {
          oldUserName,
        })
        .execute();
      console.log("drop2", drop2);
      if (drop2) {
        roles.split(",").forEach(async (ele) => {
          let cnnRole = getConnection.createQueryBuilder();
          let insertRole = await cnnRole
            .insert()
            .into(`userrole`)
            .values({
              username: code,
              rolecode: ele,
            })
            .updateEntity(false)
            .execute();
        });
      }

      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .update(`account`, {
          firstname: fName,
          lastname: lName,
          username: code,
          position: position,
          status: status,
          adaccount: ad,
        })
        .where({
          username: oldUserName,
        })
        .updateEntity(true)
        .execute();

      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success!`;
    } else {
      resp.status = "1000";
      resp.msg = `Duplicate ${code}`;
      resp.content = [];
    }

    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.get("/propertyrole/:property/:username", async (req, res, next) => {
  try {
    console.log("propertyrole");
    console.log("prop", req.params.property);
    // const tkn = req.headers.authorization;
    // const decoded = decodeToken(tkn)
    // console.log("tkn", decoded);
    if (req.params.username == "ADMIN") resp.content.push("Administrator");
    if (req.params.username == "root" || req.params.username == "Root")
      resp.content.push("Root");
    else {
      console.log("property", req.params.property);
      const connection = getConnection.createQueryBuilder();
      const roleper = await connection
        .select("string_agg(distinct roleper.rolename, ',') rn")
        .from(`userrole`)
        // .where(`userrole.username = '${decoded.sub.username}'`)
        .innerJoin(
          "rolegroup",
          "roleper",
          "userrole.rolecode = roleper.rolecode"
        )
        .where(
          `userrole.username = '${req.params.username}' and (roleper.applypropertys LIKE '%${req.params.property}%' or roleper.applypropertys = '*ALL')`
        )
        .getRawOne();
      console.log("roleper", roleper);
      resp.content.push(roleper.rn.split(","));
    }

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
const compmaster = {
  DB: "C01",
  RV: "C02",
  FD: "C03",
  CS: "C04",
  PF: "C05",
  NA: "C06",
  HK: "C07",
  EN: "C08",
  RS: "C09",
  CF: "C10",
  ST: "C11",
};
router.get(
  "/propertypermission/:property/:username",
  async (req, res, next) => {
    try {
      console.log("propertypermission");
      console.log("prop", req.params.property);
      // const tkn = req.headers.authorization;
      // const decoded = decodeToken(tkn)
      // console.log("tkn", decoded);
      if (req.params.username == "ADMIN" || req.params.username == "root")
        resp.content.push(["*ALL"]);
      else {
        console.log("property", req.params.property);
        // const connection = getConnection.createQueryBuilder()
        // const roleper = await connection
        //   .select("string_agg(distinct per.componentcode, ',') compper")
        //   .from(`userrole`)
        //   .innerJoin("rolegroup", "roleper", "userrole.rolecode = roleper.rolecode")
        //   .innerJoin("rolepermission", "per", "userrole.rolecode = per.rolecode")
        //   .where(`userrole.username = '${decoded.sub.username}' and (roleper.applypropertys LIKE '%${req.params.property}%' or roleper.applypropertys = '*ALL')`)
        //   .getRawOne()
        // console.log("roleper", roleper)

        // let setlist = new Set();
        // roleper.compper.split(",").forEach(async ele => setlist.add(ele));
        // roleper.compper.split(",").forEach(async ele => setlist.add(compmaster[ele.substring(0, 2)]));
        const connection = getConnection.createQueryBuilder();
        const roleper2 = await connection
          .select(
            "componentcode, MAX(permissioncreate) permissioncreate, max(permissionread) permissionread, max(permissionupdate) permissionupdate, max(permissiondelete) permissiondelete"
          )
          .from(`userrole`)
          .innerJoin(
            "rolegroup",
            "roleper",
            "userrole.rolecode = roleper.rolecode"
          )
          .innerJoin(
            "rolepermission",
            "per",
            "userrole.rolecode = per.rolecode"
          )
          .where(
            `userrole.username = '${req.params.username}' and (roleper.applypropertys LIKE '%${req.params.property}%' or roleper.applypropertys = '*ALL')`
          )
          .groupBy("per.componentcode")
          .getRawMany();
        console.log("roleper2", roleper2);

        const connection2 = getConnection.createQueryBuilder();
        const userper = await connection2
          .select(
            "componentcode, permissioncreate, permissionread,  permissionupdate,  permissiondelete"
          )
          .from(`userpermission`)
          .where(`username = '${req.params.username}'`)
          .getRawMany();
        console.log("userper", userper);

        let objArr = roleper2.concat(userper);
        var temp = {};
        var obj = null;
        for (var i = 0; i < objArr.length; i++) {
          obj = objArr[i];

          if (!temp[obj.componentcode]) {
            temp[obj.componentcode] = obj;
          } else {
            temp[obj.componentcode].permissioncreate += obj.permissioncreate;
            temp[obj.componentcode].permissionread += obj.permissionread;
            temp[obj.componentcode].permissionupdate += obj.permissionupdate;
            temp[obj.componentcode].permissiondelete += obj.permissiondelete;
          }
        }
        var result = [];
        for (var prop in temp) {
          console.log("temp", temp);
          if (
            temp[prop].permissioncreate > 0 ||
            temp[prop].permissionread > 0 ||
            temp[prop].permissionupdate > 0 ||
            temp[prop].permissiondelete > 0
          )
            result.push(temp[prop].componentcode);
        }

        // console.log("setlist", setlist);

        // resp.content.push(Array.from(setlist))
        resp.content.push(result);
      }

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
  }
);

router.get("/listuser", async (req, res, next) => {
  try {
    // const tkn = req.headers.authorization
    // let usrVerify = userAuth(tkn, _COMPONENTID)
    // if (!usrVerify) {
    //   resp.status = '2002'
    //   resp.msg = 'Invalid Token.'
    //   res.send(resp)
    // }
    // const userid = usrVerify.sub.user
    // const uhp = await usrPerm(
    //   _COMPONENTID,
    //   _READ,
    //   userid,
    //   usrVerify.sub.property,
    //   usrVerify.sub.branch,
    //   _SEPARATE
    // )
    // if (uhp !== 'N') {
    //   if (uhp === 'Y') {
    // const connection = getConnection.createQueryBuilder()
    // const items = await connection
    //   .select("id,username ,firstname ,lastname ,status, position, GROUP_CONCAT(rolecode SEPARATOR ', ')")
    //   .from(`account`)
    //   .getRawMany()
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        "id,account.username ,firstname ,lastname ,status, position, string_agg(distinct rolecode.rolecode, ', ') roles, string_agg(distinct propertycode.propertycode, ', ') property,adaccount"
      )
      .from(`account`)
      .leftJoin("userrole", "rolecode", "rolecode.username = account.username")
      .leftJoin(
        "grantproperty",
        "propertycode",
        "propertycode.username = account.username"
      )
      .groupBy(
        "id,account.username ,firstname ,lastname ,status, position,adaccount"
      )
      .getRawMany();
    console.log(items);
    resp.content.push(items);
    // }
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
    // } else {
    //   const userid = usrVerify.sub.user
    //   const propertyid = usrVerify.sub.property
    //   const bnc = usrVerify.sub.branch
    //   const whereDev = "dev = 'Y'"
    //   const whereBeta = "beta = 'N'"
    //   const status = "status = 'A'"
    //   const cnnPermission = getConnection.createQueryBuilder()
    //   const items = await cnnPermission
    //     .select('rolecode,status,rolename')
    //     .from(`rolegroup`)
    //     .where(`propertyid = '${propertyid}'`)
    //     .andWhere(`branchid = '${bnc}'`)
    //     .andWhere(`userid = '${userid}'`)
    //     .andWhere(`${status}`)
    //     .andWhere(`${whereDev}`)
    //     .andWhere(`${whereBeta}`)
    //     .getRawMany()
    //   items.forEach((ele) => {
    //     const obj = {
    //       icon: ele.icon,
    //       slug: ele.name,
    //       _children: []
    //     }
    //     permissions.push(obj)
    //   })
    //   // permission: usrPermissions[parseInt(ele.position) - 1],
    //   const data = []
    //   const obj = {
    //     // propertyID: items.propertyid,
    //     // branchID: items.branchid,
    //     // userID: items.userid,
    //     components: permissions
    //   }
    //   data.push(obj)
    //   console.log(data)
    //   resp.content = data
    //   res.send(resp)
    //   resp.status = '2001'
    //   resp.msg = 'Permission Denied!.'
    // }
  } catch (error) {
    console.log("err users", error);
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.post("/listpropertybyroles", async (req, res, next) => {
  try {
    // const tkn = req.headers.authorization
    // let usrVerify = userAuth(tkn, _COMPONENTID)
    // if (!usrVerify) {
    //   resp.status = '2002'
    //   resp.msg = 'Invalid Token.'
    //   res.send(resp)
    // }
    // const userid = usrVerify.sub.user
    // const uhp = await usrPerm(
    //   _COMPONENTID,
    //   _READ,
    //   userid,
    //   usrVerify.sub.property,
    //   usrVerify.sub.branch,
    //   _SEPARATE
    // )
    // if (uhp !== 'N') {
    //   if (uhp === 'Y') {
    console.log("listpropertybyroles body", req.body);
    let arrayrole = "('" + req.body.roles.join("','") + "')";
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select("string_agg(rolegroup.applypropertys, ',') applypropertys")
      .from(`rolegroup`)
      .where(`rolecode IN ${arrayrole}`)
      .getRawOne();
    console.log("listpropertybyroles", items);
    if (items.applypropertys) {
      if (items.applypropertys.indexOf("*ALL") >= 0) {
        let allconnection = getConnection.createQueryBuilder();
        let allitems = await allconnection
          .select("string_agg(rolegroup.applypropertys, ',') applypropertys")
          .from(`rolegroup`)
          .where(`applypropertys != '*ALL'`)
          .getRawOne();
        console.log(allitems.applypropertys);
        resp.content.push(allitems.applypropertys);
      } else {
        resp.content.push(items.applypropertys);
      }
    } else resp.content.push("");
    // }
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
    // }
    //   else {
    //     console.log("hihi")
    //     const userid = usrVerify.sub.user
    //     const propertyid = usrVerify.sub.property
    //     const bnc = usrVerify.sub.branch
    //     const whereDev = "dev = 'Y'"
    //     const whereBeta = "beta = 'N'"
    //     const status = "status = 'A'"
    //     const cnnPermission = getConnection.createQueryBuilder()
    //     const items = await cnnPermission
    //       .select('rolecode,status,rolename')
    //       .from(`rolegroup`)
    //       .where(`propertyid = '${propertyid}'`)
    //       .andWhere(`branchid = '${bnc}'`)
    //       .andWhere(`userid = '${userid}'`)
    //       .andWhere(`${status}`)
    //       .andWhere(`${whereDev}`)
    //       .andWhere(`${whereBeta}`)
    //       .getRawMany()
    //     items.forEach((ele) => {
    //       const obj = {
    //         icon: ele.icon,
    //         slug: ele.name,
    //         _children: []
    //       }
    //       permissions.push(obj)
    //     })
    //     // permission: usrPermissions[parseInt(ele.position) - 1],
    //     const data = []
    //     const obj = {
    //       // propertyID: items.propertyid,
    //       // branchID: items.branchid,
    //       // userID: items.userid,
    //       components: permissions
    //     }
    //     data.push(obj)
    //     console.log(data)
    //     resp.content = data
    //     res.send(resp)
    //     resp.status = '2001'
    //     resp.msg = 'Permission Denied!.'
    //   }
  } catch (error) {
    console.log("err users", error);
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/listallproperty", async (req, res, next) => {
  try {
    let allconnection = getConnection.createQueryBuilder();
    let allitems = await allconnection
      .select("string_agg(rolegroup.applypropertys, ',') applypropertys")
      .from(`rolegroup`)
      .where(`applypropertys != '*ALL'`)
      .getRawOne();
    console.log(allitems.applypropertys);
    resp.content.push(allitems.applypropertys);
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/getADGroups", async (req, res, next) => {
  try {
    exec(`ldapsearch -x -b "CN=users,DC=LDAP,DC=local" -D "CN=administrator,CN=users,DC=LDAP,DC=local" -w "d3v@MSC!" -H ldap://hms.hismsc.com "(objectclass=group)" | grep "cn: "`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      //console.log(`stdout: ${stdout}`);
      arr = stdout.replace(new RegExp("cn: ", "g"), "").split("\n");
      resp.content.push(arr.filter(e => e));
      resp.status = "2000";
      resp.msg = "Success!";
      res.send(resp);
    })

  } catch (error) {
    console.log("err users", error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/listrole", async (req, res, next) => {
  try {
    // const tkn = req.headers.authorization
    // let usrVerify = userAuth(tkn, _COMPONENTID)
    // if (!usrVerify) {
    //   resp.status = '2002'
    //   resp.msg = 'Invalid Token.'
    //   res.send(resp)
    // }
    // const userid = usrVerify.sub.user
    // const uhp = await usrPerm(
    //   _COMPONENTID,
    //   _READ,
    //   userid,
    //   usrVerify.sub.property,
    //   usrVerify.sub.branch,
    //   _SEPARATE
    // )
    // if (uhp !== 'N') {
    //   if (uhp === 'Y') {
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .select(
        "rolegroup.rolecode rolecode,rolename,description,status,applypropertys applyproperty,applygroups applygroup,COUNT(DISTINCT rolecode.username) count"
      )
      .from(`rolegroup`)
      .leftJoin(
        "userrole",
        "rolecode",
        "rolegroup.rolecode = rolecode.rolecode"
      )
      .groupBy("rolegroup.rolecode,rolename,description,applypropertys,applygroups,status")
      .getRawMany();
    resp.content.push(items);
    // }
    resp.status = "2000";
    resp.msg = "Success!";
    res.send(resp);
    // }
    //   else {
    //     console.log("hihi")
    //     const userid = usrVerify.sub.user
    //     const propertyid = usrVerify.sub.property
    //     const bnc = usrVerify.sub.branch
    //     const whereDev = "dev = 'Y'"
    //     const whereBeta = "beta = 'N'"
    //     const status = "status = 'A'"
    //     const cnnPermission = getConnection.createQueryBuilder()
    //     const items = await cnnPermission
    //       .select('rolecode,status,rolename')
    //       .from(`rolegroup`)
    //       .where(`propertyid = '${propertyid}'`)
    //       .andWhere(`branchid = '${bnc}'`)
    //       .andWhere(`userid = '${userid}'`)
    //       .andWhere(`${status}`)
    //       .andWhere(`${whereDev}`)
    //       .andWhere(`${whereBeta}`)
    //       .getRawMany()
    //     items.forEach((ele) => {
    //       const obj = {
    //         icon: ele.icon,
    //         slug: ele.name,
    //         _children: []
    //       }
    //       permissions.push(obj)
    //     })
    //     // permission: usrPermissions[parseInt(ele.position) - 1],
    //     const data = []
    //     const obj = {
    //       // propertyID: items.propertyid,
    //       // branchID: items.branchid,
    //       // userID: items.userid,
    //       components: permissions
    //     }
    //     data.push(obj)
    //     console.log(data)
    //     resp.content = data
    //     res.send(resp)
    //     resp.status = '2001'
    //     resp.msg = 'Permission Denied!.'
    //   }
  } catch (error) {
    console.log("err users", error);
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/user-management/users", async (req, res, next) => {
  try {
    /*
    const connID = getConnection.createQueryBuilder()
    const maxid = await connID
      .select(`coalesce(MAX(id), 0) +1 as maxid`)
      .from(`${tbName}`)
      .getRawOne()
    console.log('max id', maxid.maxid)
    */
    const tkn = req.headers.authorization;
    let usrVerify = userAuth(tkn, _COMPONENTID);
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    }
    const userid = usrVerify.sub.user;
    const uhp = await usrPerm(
      _COMPONENTID,
      _READ,
      userid,
      usrVerify.sub.property,
      usrVerify.sub.branch,
      _SEPARATE
    );
    if (uhp !== "N") {
      if (uhp === "Y") {
        const connection = getConnection.createQueryBuilder();
        const items = await connection.select().from(`${tbName}`).getRawMany();
        resp.content.push(items);
      }
      resp.status = "2000";
      resp.msg = "Success!";
      res.send(resp);
    } else {
      const userid = usrVerify.sub.user;
      const propertyid = usrVerify.sub.property;
      const bnc = usrVerify.sub.branch;
      const whereDev = "dev = 'Y'";
      const whereBeta = "beta = 'N'";
      const status = "status = 'A'";
      const cnnPermission = getConnection.createQueryBuilder();
      const items = await cnnPermission
        .select("userid,usrpermission")
        .from(`usrpermissionmst`)
        .where(`propertyid = '${propertyid}'`)
        .andWhere(`branchid = '${bnc}'`)
        .andWhere(`userid = '${userid}'`)
        .andWhere(`${status}`)
        .andWhere(`${whereDev}`)
        .andWhere(`${whereBeta}`)
        .getRawOne();
      const usrPermissions = items.usrpermission.split(_SEPARATE);
      const arrPosition = [];
      for (let i = 0; i < usrPermissions.length; i++) {
        if (usrPermissions[i] !== "") {
          arrPosition.push(i + 1);
        }
      }
      const where$ = arrPosition.join(",");
      const connComponent = getConnection.createQueryBuilder();
      const components = await connComponent
        .select("componentid, name, icon, parent")
        .from("componentmst")
        .where(`position IN (${where$})`)
        .getRawMany();
      const permissions = [];
      components.forEach((ele) => {
        const obj = {
          icon: ele.icon,
          slug: ele.name,
          _children: [],
        };
        permissions.push(obj);
      });
      // permission: usrPermissions[parseInt(ele.position) - 1],
      const data = [];
      const obj = {
        propertyID: items.propertyid,
        branchID: items.branchid,
        userID: items.userid,
        components: permissions,
      };
      data.push(obj);
      console.log(data);
      resp.content = data;
      res.send(resp);
      resp.status = "2001";
      resp.msg = "Permission Denied!.";
    }
  } catch (error) {
    console.log("err users", error);
    // const lg = new Log()
    // lg.setLog(`${tagType}|${error}`)
    resp.msg = "Failer";
    res.send(resp);
  }
});

router.get("/user-management/users/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const tkn = req.headers.authorization;
    let usrVerify = userAuth(tkn, _COMPONENTID);
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    }
    const userid = usrVerify.sub.user;
    const uhp = await usrPerm(
      _COMPONENTID,
      _READ,
      userid,
      usrVerify.sub.property,
      usrVerify.sub.branch,
      _SEPARATE
    );
    const propertyid = usrVerify.sub.property;
    const id = usrVerify.sub.user;
    const bnc = usrVerify.sub.branch;
    if (uhp) {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .select()
        .from(`${tbName}`)
        .where("usr.id = :id", {
          id,
        })
        .getRawOne();
      resp.content.push(items);
      resp.status = "2000";
      resp.msg = "Success!";
      res.send(resp);
    } else {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .select("userid, usrpermission")
        .from(`usrpermissionmst`)
        .where(`propertyid = '${propertyid}'`)
        .andWhere(`branchid = '${bnc}'`)
        .andWhere(`userid = '${id}'`)
        .getRawOne();
      if (items) {
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
            .select()
            .from("componentmst")
            .where(`position IN (${where$})`)
            .andWhere(`state = 'dev'`)
            .getRawMany();
          const permissions = [];
          components.forEach((ele) => {
            const obj = {
              permission: usrPermissions[parseInt(ele.position) - 1],
              icon: ele.icon,
              slug: ele.slug,
            };
            permissions.push(obj);
          });
          const data = [];
          const obj = {
            components: permissions,
          };
          data.push(obj);
          resp.content.push(data);
          resp.status = "2001";
          resp.msg = "Permission Denied!.";
        } else {
          resp.status = "2003";
          resp.msg = "Permission Notset.";
          resp.content.push([]);
        }
      } else {
        resp.status = "2003";
        resp.msg = "Permission Notset.";
      }
      res.send(resp);
    }
  } catch (error) {
    console.log(error);
    resp.content = error;
    res.send(resp);
  }
});

router.post("/user-management/users", async (req, res, next) => {
  try {
    const params = req.body;
    let fName = params.firstname.trim();
    let lName = params.lastname.trim();
    const age = parseInt(params.age);
    const cnnDup = getConnection.createQueryBuilder();
    const itemsAleady = await cnnDup
      .select(`firstname, lastname`)
      .from(`${tbName}`)
      .where(`firstname = '${fName}'`)
      .andWhere(`lastname = '${lName}'`)
      .getRawOne();
    console.log("already ", itemsAleady);
    if (!itemsAleady) {
      let pwd = new Date().getTime().toString(36);
      const userid = fName.substring(0, 3) + lName.substring(0, 2);
      let usrMsg = `  ID : ${userid}  PASS: ${pwd}`;
      console.log(usrMsg);
      pwd = crt.createHash("md5", "revopms").update(pwd).digest("hex");
      let property = params.property ? params.property : "FSDH";
      let branch = params.branch ? params.branch : "HQ";
      // Generate รหัสพนักงาน  6 digit ใส่ id auto gen ป้องกันการใส่่เองใน db เพราะ chema ใส่ไว้เป็น int ฉะนั้น id ที่เป็นจุดทสนิยม จะทำให้ระบบไม่สามารถทำงานได้
      // select coalesce(MAX(id), 0) +1 as uu from username
      const username1 = new Username(
        fName,
        lName,
        age,
        params.status_record,
        params.status_marriaged,
        userid,
        pwd,
        property,
        branch
      );
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .insert()
        .into(`${tbName}`)
        .values([username1])
        .returning([
          "firstname",
          "lastname",
          "age",
          "status_marriaged, userid, property, branch",
        ])
        .updateEntity(false)
        .execute();

      const cnnPerm = getConnection.createQueryBuilder();
      const itemPerm = await cnnPerm
        .insert()
        .into(`usrpermissionmst`)
        .values({
          propertyid: property,
          branchid: branch,
          userid: userid,
          usrpermission: ",,,,,,,",
          dev: "Y",
          beta: "N",
          status: "A",
        })
        .returning(["userid"])
        .updateEntity(false)
        .execute();
      console.log("Default User Permission", itemPerm);
      resp.content.push(items);
      resp.status = "2000";
      resp.msg = `Success!  ${usrMsg}`;
    } else {
      resp.status = "1000";
      resp.msg = `Duplicate ${fName}  ${lName}`;
      resp.content = [];
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

router.put("/user-management/users/:id", async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      age,
      status_record,
      status_marraiged
    } =
      req.body;
    const {
      id
    } = req.params;
    const username1 = new Username(
      id,
      firstname,
      lastname,
      parseInt(age),
      status_record,
      status_marraiged
    );
    const connection = getConnection.createQueryBuilder();
    const items = await connection
      .update(`${tbName}`, username1)
      .where({
        id: username1.id,
      })
      .returning([
        "id",
        "firstname",
        "lastname",
        "age",
        "status_record",
        "status_marraiged",
      ])
      .updateEntity(true)
      .execute();

    resp.status = "2000";
    resp.msg = "Success";
    resp.content.push(items);
    res.send(resp);
  } catch (error) {
    console.log("usr err", error);
    resp.content = [];
    res.send(resp);
  }
});

router.delete("/user-management/users/:id", async (req, res, next) => {
  try {
    const params = req.params;
    const id = params.id;
    const tkn = req.headers.authorization;
    let usrVerify = userAuth(tkn, _COMPONENTID);
    if (!usrVerify) {
      resp.status = "2002";
      resp.msg = "Invalid Token.";
      res.send(resp);
    }
    const userid = usrVerify.sub.user;
    const uhp = await usrPerm(
      _COMPONENTID,
      _DELETE,
      userid,
      usrVerify.sub.property,
      usrVerify.sub.branch,
      _SEPARATE
    );
    if (uhp !== "N") {
      const connection = getConnection.createQueryBuilder();
      const items = await connection
        .delete()
        .from("username")
        .where("id = :id", {
          id,
        })
        .execute();
      resp.content.push(items);
      resp.status = "2000";
      resp.msg = "Success";
      res.send(resp);
    } else {
      resp.content = [];
      resp.status = "2001";
      resp.msg = "Permission Denied";
      res.send(resp);
    }
  } catch (error) {
    console.log(error);
    resp.msg = "Failer";
    res.send(resp);
  }
});

module.exports = router;
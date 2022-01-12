const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
// app.disable("x-power-by");
const { getDBConf } = require("./db/dbConfig");
const DbConnect = require("./db/dbConnect").DbConnect;
const DBCnf = getDBConf();
const deviceRouter = require("./routers/device");
const userRouter = require("./routers/users");
const configMaster = require("./routers/configMaster");
const roomInventory = require("./routers/roomInventory");
const roomRack = require("./routers/roomRack");
const roomMaster = require("./routers/roomMaster");
const componentMaster = require("./routers/componentMst");
const usrPermission = require("./routers/usrPermission");
const menus = require("./routers/menuMst");
const logsb = require("./routers/logsbMst");
const campaignMst = require("./routers/campaignMaster");
const campaignDtl = require("./routers/campaignDetail");
const reservationRoom = require("./routers/reservationRoom");
const configmasterRouter = require("./routers/configmasterComp");
const assetRouter = require("./routers/asset");
const individualProfileRouter = require("./routers/individualProfile");
const companyProfileRouter = require("./routers/companyProfile");
const port = require("./sys/configPort");
const Log = require("./Utility/log").Log;
const codeMst = require("./routers/codeMst");
const typeOwner = "RVS";
const typeApp = "APP";
const logFile = "logbpath";
const serve = app.listen(port.proof, () => {
  console.log("Server listening on ", port.proof);
});

try {
  const dbConn = new DbConnect(DBCnf).getCnn();
  dbConn
    .then(async () => {
      app.use(configMaster);
      app.use(deviceRouter);
      app.use(userRouter);
      app.use(roomInventory);
      app.use(roomRack);
      app.use(roomMaster);
      app.use(configmasterRouter);
      app.use(componentMaster);
      app.use(usrPermission);
      app.use(menus);
      app.use(logsb);
      app.use(campaignMst);
      app.use(campaignDtl);
      app.use(codeMst);
      app.use(assetRouter);
      app.use(individualProfileRouter);
      app.use(reservationRoom);
      app.use(companyProfileRouter);

      const lg = new Log(logFile);
      lg.setLog(typeOwner, typeApp, "Start", port.proof, "", "", logFile);
    })
    .catch((error) => {
      // method, error number
      // error message ที่มี error number
      const lg = new Log(logFile);
      lg.setLog(typeOwner, typeApp, "ORM CONNECTION", error, "", "", logFile);
      console.log("ORM connection error: ", error);
    });
} catch (error) {
  // method, error number
  // error message ที่มี error number
  const lg = new Log(logFile);
  lg.setLog(typeOwner, typeApp, "ORM CREATE", error, "", "", logFile);
}

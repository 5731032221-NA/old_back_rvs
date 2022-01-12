const { exec } = require("child_process");
// const axios = require('axios');
// const https = require('https');

exec("docker exec  kong kong migrations reset -y", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);

  exec("docker exec kong kong migrations bootstrap", (error2, stdout2, stderr2) => {
    if (error2) {
      console.log(`error: ${error2.message}`);
      return;
    }
    if (stderr2) {
      console.log(`stderr: ${stderr2}`);
      return;
    }
    console.log(`stdout: ${stdout2}`);
    exec("docker restart kong", (error3, stdout3, stderr3) => {
      if (error3) {
        console.log(`error: ${error3.message}`);
        return;
      }
      if (stderr3) {
        console.log(`stderr: ${stderr3}`);
        return;
      }
      console.log(`stdout: ${stdout3}`);
    });
  });
});

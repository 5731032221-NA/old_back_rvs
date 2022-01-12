const axios = require('axios');
const https = require('https');

let provision_key = require('./provision_key.json').provision_key;
async function gettoken(username) {
  return new Promise(function (resolve, reject) {
    axios.get('http://localhost:8001/consumers/' + username + '/oauth2').then(res => {
      console.log(`statusCode: ${res.status}`)
      console.log(res.data)
      const agent = new https.Agent({
        rejectUnauthorized: false
      });
      axios
        .post('https://localhost:8443/apis/oauth2/token', {
          client_id: res.data.data[0].client_id,
          client_secret: res.data.data[0].client_secret,
          grant_type: "client_credentials",
          scope: "rvspms",
          provision_key: provision_key,
          // epired_in: 5
        }, { httpsAgent: agent })
        .then(res => {
          console.log(`statusCode: ${res.status}`)
          console.log(res.data)
          resolve(res.data.access_token);
        })
        .catch(error => {
          console.error(error)
        })
    }).catch(error => {
      axios
        .post('http://localhost:8001/consumers', {
          username: username
        })
        .then(resc => {
          axios
            .post('http://localhost:8001/consumers/' + username + '/oauth2', {
              name: username
            })
            .then(res => {
              console.log(`statusCode: ${res.status}`)
              console.log(res.data)
              const agent = new https.Agent({
                rejectUnauthorized: false
              });
              axios
                .post('https://localhost:8443/apis/oauth2/token', {
                  client_id: res.data.client_id,
                  client_secret: res.data.client_secret,
                  grant_type: "client_credentials",
                  scope: "rvspms",
                  provision_key: provision_key,
                  epired_in: 5
                }, { httpsAgent: agent })
                .then(res => {
                  console.log(`statusCode: ${res.status}`)
                  console.log(res.data)
                  resolve(res.data.access_token);
                })
                .catch(error => {
                  console.error(error)
                })
            })
        })
    })
      .catch(errorc => {
        console.error(errorc)
      })
  })
}

module.exports = { gettoken };
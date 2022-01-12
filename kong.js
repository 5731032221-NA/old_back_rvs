const axios = require('axios');
const https = require('https');
const fs = require('fs');
// var kongapi = [{
//   name: "route-auth",
//   service: { name: "auth" },
//   paths: ["/auth"]
// }
// ]

axios
  .post('http://localhost:8001/services', {
    name: "auth",
    url: "http://192.168.1.110:8083/login"
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
    axios
      .post('http://localhost:8001/routes', {
        name: "route-auth",
        service: { name: "auth" },
        paths: ["/auth"]
      })
      .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res.data)
        // const agent = new https.Agent({
        //   rejectUnauthorized: false
        // });
        // axios
        //       .post('http://localhost:8001/plugins', {
        //         name: "cors",
        //         config: {
        //           max_age: 3600,
        //           headers: ["Accept", "Content-Type","X-Auth-Token"],
        //           origins: ["*"],
        //           methods: ["GET", "PUT", "POST", "DELETE"],
        //           credentials: true,
        //           exposed_headers: ["X-Auth-Token"]
        //         },
        //         route: {
        //           name: "route-auth"
        //         }
        //       })
        //       .then(res => {
        //         console.log(`statusCode: ${res.status}`)
        //         console.log(res.data)
        //         fs.writeFileSync('provision_key.json', JSON.stringify(res.data));
        //       })
        //       .catch(error => {
        //         console.error(error)
        //       })
      })
      .catch(error => {
        console.error(error)
      })
  })
  .catch(error => {
    console.error(error)
  })


axios
  .post('http://localhost:8001/services', {
    name: "apis",
    url: "http://192.168.1.110:8082/"
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
    axios
      .post('http://localhost:8001/routes', {
        name: "route-apis",
        service: { name: "apis" },
        paths: ["/apis"]
      })
      .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res.data)
        axios
          .post('http://localhost:8001/plugins', {
            name: "oauth2",
            config: {
              scopes: ["rvspms"],
              mandatory_scope: true,
              enable_client_credentials: true,
              global_credentials: true
            },
            route: {
              name: "route-apis"
            }
          })
          .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res.data)
            fs.writeFileSync('provision_key.json', JSON.stringify(res.data));
            axios
              .post('http://localhost:8001/plugins', {
                name: "cors",
                config: {
                  // max_age: 3600,
                  headers: ["Authorization", "Content-Type"],
                  origins: ["*"],
                  methods: ["HEAD","GET", "PUT", "POST", "DELETE"],
                  credentials: true,
                  exposed_headers: ["X-Auth-Token"]
                },
                route: {
                  name: "route-apis"
                }
              })
              .then(res => {
                console.log(`statusCode: ${res.status}`)
                console.log(res.data)
              })
              .catch(error => {
                console.error(error)
              })
          })
          .catch(error => {
            console.error(error)
          })

      })
      .catch(error => {
        console.error(error)
      })
  })
  .catch(error => {
    console.error(error)
  })



axios
  .post('http://localhost:8001/consumers', {
    username: "RVSPMS"
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
  })
  .catch(error => {
    console.error(error)
  })
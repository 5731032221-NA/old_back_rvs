const axios = require('axios');
const https = require('https');
const fs = require('fs');
// var kongapi = [{
//   name: "route-auth",
//   service: { name: "auth" },
//   paths: ["/auth"]
// }
// ]

// axios
//   .post('http://localhost:8001/services', {
//     name: "adauth",
//     url: "http://192.168.1.107:8083/ad"
//   })
//   .then(res => {
//     console.log(`statusCode: ${res.status}`)
//     console.log(res.data)
//     axios
//       .post('http://localhost:8001/routes', {
//         name: "route-adauth",
//         service: { name: "adauth" },
//         paths: ["/adauth"]
//       })
//       .then(res => {
//         console.log(`statusCode: ${res.status}`)
//         console.log(res.data)
        
//       })
//       .catch(error => {
//         console.error(error)
//       })
//   })
//   .catch(error => {
//     console.error(error)
// //   })

// axios
//   .post('http://localhost:8001/plugins', {
//     name: "openid-connect",
//     config: {
//       issuer: "https://login.microsoftonline.com/cd07849c-ef2d-45be-ad2b-3047d483f8d0/v2.0/.well-known/openid-configuration",
//       client_id:"842c704f-70b0-468a-85a3-b6154450d4c9",
//       client_secret:"lGf7Q~Br4MS38yySw5_vjqrvo9eLEbW9-t3e.",
//       redirect_uri:"http://localhost:3000",
//       scopes:"User.Read",
//       scopes:"openid",
//       scopes:"rvspms",
//       scopes:"842c704f-70b0-468a-85a3-b6154450d4c9/.default",
//       verify_parameters:"false"
//     },
//     route: {
//       name: "route-apis"
//     }
//   })
//   .then(res => {
//     console.log(`statusCode: ${res.status}`)
//     console.log(res.data)
//     fs.writeFileSync('provision_key2.json', JSON.stringify(res.data));
   
//   })
//   .catch(error => {
//     console.error(error)
//   })


// axios
//   .post('http://localhost:8001/plugins', {
//     name: "oidc",
//     config: {
//       discovery: "https://login.microsoftonline.com/cd07849c-ef2d-45be-ad2b-3047d483f8d0/v2.0/.well-known/openid-configuration",
//       client_id:"842c704f-70b0-468a-85a3-b6154450d4c9",
//       client_secret:"lGf7Q~Br4MS38yySw5_vjqrvo9eLEbW9-t3e.",
//       // redirect_uri:"http://localhost:3000",
//       // scopes:"User.Read",
//       scope:"openid",
//       // scopes:"rvspms",
//       // scopes:"842c704f-70b0-468a-85a3-b6154450d4c9/.default",
//       // verify_parameters:"false"
//     },
//     route: {
//       name: "route-adauth"
//     }
//   })
//   .then(res => {
//     console.log(`statusCode: ${res.status}`)
//     console.log(res.data)
//     fs.writeFileSync('provision_key2.json', JSON.stringify(res.data));
   
//   })
//   .catch(error => {
//     console.error(error)
//   })

axios
  .post('http://localhost:8001/services', {
    name: "ldapauth",
    url: "http://192.168.1.107:8083/ldap"
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
    axios
      .post('http://localhost:8001/routes', {
        name: "route-ldapauth",
        service: { name: "ldapauth" },
        paths: ["/ldapauth"]
      })
      .then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res.data)
        axios
  .post('http://localhost:8001/plugins', {
    name: "ldap-auth",
    config: {
      hide_credentials: true,
      ldap_host:"his-sun-ad.hismsc.com",
      ldap_port:389,
      start_tls:false,
      ldaps:false,
      base_dn:"dc=hismsc,dc=com",
      verify_ldap_host:false,
      attribute:"cn",
      header_type:"ldap"
    },
    route: {
      name: "route-ldapauth"
    }
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    console.log(res.data)
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
        name: "route-ldapauth"
      }
    })
    .then(res2 => {
      console.log(`statusCode: ${res2.status}`)
      console.log(res2.data)
    })
    .catch(error2 => {
      console.error(error2)
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




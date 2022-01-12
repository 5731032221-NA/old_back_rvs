const axios = require('axios');
const https = require('https');

let provision_key = require('./provision_key.json').provision_key;
let username = "TEST"
async function gettoken(username) {
  // return new Promise(function (resolve, reject) {
  //   axios.get('http://localhost:8001/consumers/'+username+'/oauth2/').then(resclient => {
      

  //     axios.get('http://localhost:8001/oauth2/'+resclient.data.data[0].client_id+'/oauth2_tokens').then(restokens => {
      
  //     console.log(restokens.data)

  //     restokens.data.data.forEach(element => axios.delete('http://localhost:8001/oauth2_tokens/'+element.id));
      
  //   })
  //   })
  // })
  return new Promise(function (resolve, reject) {
    try{
    axios.get('http://localhost:8001/consumers/' + username + '/oauth2/').then(resclient => {
      console.log("a");
      if(resclient.data.data.length >0){
      axios.get('http://localhost:8001/oauth2/' + resclient.data.data[0].client_id + '/oauth2_tokens').then(restokens => {
        console.log("b");  
      if(restokens.data.data.length >0){
          console.log(restokens.data.data)
        restokens.data.data.forEach(element => axios.delete('http://localhost:8001/oauth2_tokens/' + element.id));
        resolve(true)  
      }else{
          resolve(true)
        }
      })
    }else{
      resolve(true)
    }
    })
  }catch(err){resolve(true)}
 })
}

gettoken(username,"Active")

// module.exports = { gettoken };
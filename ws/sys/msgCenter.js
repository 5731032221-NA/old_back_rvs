"use strict"
const SVC = {
    "DEFAULT":{
        "code": "0000",
        "msg": "Access Denied." },
    "CRUD": {
        "code": "2000",
        "msg":{
            "C": "Successfully Created (##).",
            "R": "(##) Read List",
            "U": "Successfully Updated (##).",
            "D": "Successfully Deleted (##)."
        }
    },
    "DUPLICATE": {
        "code": "1000",
        "msg": "The '(##)' is already existed.",
    },
    "PERMISSION": {
        "code": "2001",
        "msg": "Permission Denied"
    },
    "INVALIDTOKEN": {
        "code": "2002",
        "msg": "Invalid Token"
    }
}

const getMsg = ( text, replaceData) => {
    let resp = ''
    resp = text.replace('(##)', replaceData)
    return resp
}


module.exports = {
    SVC,
    getMsg
}
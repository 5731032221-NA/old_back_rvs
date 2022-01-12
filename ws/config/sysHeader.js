"use strict"
/*
*System
*/
const express = require( 'express' )
const router = express.Router()
const getConnection = require( 'typeorm' )
/*
*Biz
*/
const { SVC, getMsg } = require( '../sys/msgCenter' );
const { usrPerm, componentsUsr } = require('../queryparser/user')
const { userAuth } = require( '../Utility/verify' )
const { components } = require('../sys/modules')
module.exports = {
    router,
    getConnection,
    SVC,
    getMsg,
    usrPerm,
    componentsUsr,
    userAuth,
    components
}

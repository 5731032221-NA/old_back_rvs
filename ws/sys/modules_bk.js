"use strict";
const components = {
    "room": {
        "masters": {
            _COMPONENTID: "RM-MST-00892254",
            _ENPOINT: "/room-masters",
            _TABLES: {
                default: "rmmst"
            }
        }
    },
    "user-management": {
        "users": {
           _COMPONENTID: "UR-00845678",
           _ENPOINT: "/user-management/users",
            _TABLES: {
                default: "username"
            }
        }
    },
    "user-permissions": {
        _COMPONENTID: "CM-MST-00892254",
        _ENPOINT: "/user-management/users",
        _TABLES: {
            default: "usrpermissionmst"
        }
    }
};

module.exports = {
  components
}
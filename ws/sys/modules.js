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
    "users": {
        "management": {
            "users": {
                _COMPONENTID: "UR-00845678",
                _ENPOINT: "/user-management/users",
                _TABLES: {
                    default: "username"
                }
            }
        },
        "permission": {
            _COMPONENTID: "CM-MST-00892254",
            _ENPOINT: "/user-permission",
            _TABLES: {
                default: "usrpermissionmst"
            }
        }
    },
    "configmaster": {
        _COMPONENTID: "CF-MST-00592254",
        _ENPOINT: "/config-masters",
        _TABLES: {
            default: "cfgmst"
        }
    },
    "logsmaster": {
        _COMPONENTID: "LG-MST-00892254",
        _ENPOINT: "/logs",
        _TABLES: {
            default: "logsb"
        }
    },
    "propertymaster": {
        _COMPONENTID: "PT-MST-00592254",
        _ENPOINT: "/property-masters",
        _TABLES: {
            default: "propertymst"
        }
    },
    "campaign": {
        "master": {
            _COMPONENTID: "CM-CMPG-00592299",
            _ENPOINT: "/campaign-masters",
            _TABLES: {
                default: "cmpgmst"
            }
        },
        "detail": {
            _COMPONENTID: "CM-CMD-00592299",
            _ENPOINT: "/campaign-detail",
            _TABLES: {
                default: "cmpgdtl"
            }
        },
        "code": {
            _COMPONENTID: "CM-COD-00592299",
            _ENPOINT: "/campaign-code",
            _TABLES: {
                default: "codemst"
            }
        }
    }
};

module.exports = {
    components
}
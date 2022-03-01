const confirmUserPermissions = require('./confirmUserPermissions').confirmUserPermissions;
const confirmAdminPermissions = require('./confirmAdminPermissions').confirmAdminPermissions;

//keyActions
const getKey = require('./keyActions').getKey;
const returnKey = require('./keyActions').returnKey;
const transferKey = require('./keyActions').transferKey;
const isTransferedToUpdate = require('./keyActions').isTransferedToUpdate;

//historyActions
const addHistory = require('./historyActions').addHistory;
const getKeyHistory = require('./historyActions').getKeyHistory;

//userActions
const logIn = require('./userActions').logIn;
const logOut = require('./userActions').logOut;
const register = require('./userActions').register;
const getLoggedUser = require('./userActions').getLoggedUser;

//adminActions
const addNewKey = require('./adminActions').addNewKey;

module.exports = {
    confirmUserPermissions,
    confirmAdminPermissions,
    getKey,
    returnKey,
    transferKey,
    isTransferedToUpdate,
    addHistory,
    logIn,
    logOut,
    register,
    getLoggedUser,
    getKeyHistory,
    addNewKey
}
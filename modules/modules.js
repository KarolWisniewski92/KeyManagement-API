const confirmUserPermissions = require('./confirmUserPermissions').confirmUserPermissions;

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

module.exports = {
    confirmUserPermissions,
    getKey,
    returnKey,
    transferKey,
    isTransferedToUpdate,
    addHistory,
    logIn,
    logOut,
    register,
    getLoggedUser,
    getKeyHistory
}
const confirmUserPermissions = require('./confirmUserPermissions').confirmUserPermissions;
const getKey = require('./keyActions').getKey;
const returnKey = require('./keyActions').returnKey;
const transferKey = require('./keyActions').transferKey;
const isTransferedToUpdate = require('./keyActions').isTransferedToUpdate;
const addHistory = require('./historyActions').addHistory;

module.exports = {
    confirmUserPermissions,
    getKey,
    returnKey,
    transferKey,
    isTransferedToUpdate,
    addHistory
}
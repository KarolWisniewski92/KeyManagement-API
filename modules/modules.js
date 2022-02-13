const confirmUserPermissions = require('./confirmUserPermissions').confirmUserPermissions;
const getKey = require('./keyAction').getKey;
const returnKey = require('./keyAction').returnKey;
const transferKey = require('./keyAction').transferKey;
const isTransferedToUpdate = require('./keyAction').isTransferedToUpdate;

module.exports = {
    confirmUserPermissions,
    getKey,
    returnKey,
    transferKey,
    isTransferedToUpdate
}
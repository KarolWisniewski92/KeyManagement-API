const confirmUserPermissions = require('./confirmUserPermissions').confirmUserPermissions;
const addHistory = require('./historyActions').addHistory;

const {
    Key
} = require('../data/schema');

const getKey = (req, res) => {
    confirmUserPermissions(req, res, async () => {

        const dataToUpdate = {
            isTakenBy: req.body.isTakenBy,
            isTaken: req.body.isTaken,
            isTakenData: req.body.isTakenData,
            isTransferedTo: ""
        }

        await Key.findOneAndUpdate({
                keyID: req.body.keyID
            }, dataToUpdate)
            .then(() => {
                addHistory("GET", {
                    keyID: req.body.keyID,
                    isTakenBy: req.body.isTakenBy,
                    isTakenData: req.body.isTakenData,
                })
                res.send(JSON.stringify({
                    error: false,
                    message: ""
                }))
            })
            .catch((err) => {
                res.send(JSON.stringify({
                    error: true,
                    message: err.message
                }))
            })
    })
};

const returnKey = (req, res) => {
    confirmUserPermissions(req, res, async () => {

        const dataToUpdate = {
            isTakenBy: req.body.isTakenBy,
            isTaken: req.body.isTaken,
            isTakenData: req.body.isTakenData,
            isTransferedTo: ""
        }

        await Key.findOneAndUpdate({
                keyID: req.body.keyID
            }, dataToUpdate)
            .then(() => {
                addHistory("RETURN", {
                    keyID: req.body.keyID,
                    isReturnedData: req.body.isReturnedData,
                })
                res.send(JSON.stringify({
                    error: false,
                    message: ""
                }))
            })
            .catch((err) => {
                res.send(JSON.stringify({
                    error: true,
                    message: err.message
                }))
            })
    })
};

const transferKey = (req, res) => {
    confirmUserPermissions(req, res, async () => {
        const dataToUpdate = {
            isTakenBy: req.body.isTakenBy,
            isTaken: req.body.isTaken,
            isTakenData: req.body.isTakenData,
            isTransferedTo: ""
        }
        console.log(req.body)

        await Key.findOneAndUpdate({
                keyID: req.body.keyID
            }, dataToUpdate)
            .then(() => {
                addHistory("TRANSFER", {
                    keyID: req.body.keyID,
                    isTakenBy: req.body.isTakenBy,
                    isTakenData: req.body.isTakenData,
                    isReturnedData: req.body.isTakenData, //isTakenDate is also isReturnedDate
                })
                res.send(JSON.stringify({
                    error: false,
                    message: ""
                }))
            })
            .catch((err) => {
                res.send(JSON.stringify({
                    error: true,
                    message: err.message
                }))
            })
    })
};

const isTransferedToUpdate = (req, res) => {
    confirmUserPermissions(req, res, async () => {
        const dataToUpdate = {
            isTransferedTo: req.body.user_id
        }

        await Key.findOneAndUpdate({
                keyID: req.body.keyID
            }, dataToUpdate)
            .then(() => {
                res.send(JSON.stringify({
                    error: false,
                    message: ""
                }))
            })
            .catch((err) => {
                res.send(JSON.stringify({
                    error: true,
                    message: err.message
                }))
            })
    })
}


module.exports = {
    getKey,
    returnKey,
    transferKey,
    isTransferedToUpdate
}
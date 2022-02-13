const confirmUserPermissions = require('./confirmUserPermissions');

const {
    Key
} = require('./../data/schema');

const getKey = (req, res) => {
    confirmUserPermissions.confirmUserPermissions(req, res, async () => {

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
    confirmUserPermissions.confirmUserPermissions(req, res, async () => {

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
    confirmUserPermissions.confirmUserPermissions(req, res, async () => {
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
    confirmUserPermissions.confirmUserPermissions(req, res, async () => {
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
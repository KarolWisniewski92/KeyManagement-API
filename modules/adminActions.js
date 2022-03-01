const confirmAdminPermissions = require('./confirmAdminPermissions').confirmAdminPermissions;

const addNewKey = (req, res) => {
    confirmAdminPermissions(req, res, async () => {
        res.send('jest admin')


    })

}


module.exports = {
    addNewKey
}
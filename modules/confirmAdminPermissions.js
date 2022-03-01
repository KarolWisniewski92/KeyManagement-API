//----------------FUNCTIONS-------------------------
const confirmAdminPermissions = (req, res, callback) => {
    const check = typeof req.user !== "undefined" ? true : false;
    if (check) {
        const checkedUser = req.user[0];
        if (checkedUser.role === 'admin') {
            callback();
        } else {
            res.status(401).end(); //Zakończ i wyślij kod Unauthorized!
        }

    } else {
        res.status(401).end(); //Zakończ i wyślij kod Unauthorized!
    }
};

module.exports = {
    confirmAdminPermissions
}
//----------------FUNCTIONS-------------------------
const confirmUserPermissions = (req, res, callback) => {
    const check = typeof req.user !== "undefined" ? true : false;
    if (check) {
        callback();
    } else {
        res.status(401).end(); //Zakończ i wyślij kod Unauthorized!
    }
};

module.exports = {
    confirmUserPermissions
}
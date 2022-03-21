const passport = require('passport');
const {
    User
} = require('../data/schema/index');

const logIn = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (typeof info !== "undefined") { //Jeżeli wystąpił jakiś błąd to jego text jest pod info. Jeżeli błędów nie ma to info jest undefinded.
            res.send(JSON.stringify({ // Wysyła informacje o błędzie który wystąpił! 
                error: true,
                message: info
            }))
        } else {
            req.logIn(user, err => {
                if (err) throw err;
                res.send(JSON.stringify({
                    error: false,
                    message: "Pomyślnie zalogowano!"
                }))
                const date = new Date()

                console.log(`Zalogował się ${req.user.name} ${req.user.surname} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}s`)
            })
        }
    })(req, res, next)
};

const logOut = (req, res) => {
    if (typeof req.user !== "undefined") {
        const date = new Date()
        console.log(`Wylogował się ${req.user[0].name} ${req.user[0].surname} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}s`);
    }
    req.logout();
    res.send('Wylogowano!')

};

const register = async (req, res) => {

    User.findOne({
            email: req.body.email
        })
        .then(async (user) => {
            if (user !== null) {
                res.send(JSON.stringify(`Użytkownik już istnieje!`))
                return;
            }

            const getNewId = async (length) => {

                const generateID = (length) => {
                    var result = '';
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() *
                            charactersLength));
                    }
                    return result;
                }

                const id = generateID(length);
                const isAvailable = await User.find({
                        user_id: id
                    })
                    .then(user => {
                        return user.length === 0 ? true : false
                    })
                    .catch(err => {
                        throw err;
                    })

                return isAvailable ? id : getNewId(6);
            }

            const newUser = new User({
                ...req.body,
                role: 'user',
                isActive: false,
                user_id: await getNewId(6)
            })

            await newUser.save()
                .then(data => {
                    res.send(`Poprawnie utworzono nowego użytownika!`)
                })
                .catch(err => {
                    throw err;
                })
        })
        .catch(err => {
            throw err;
        })

};

const getLoggedUser = (req, res) => {
    if (req.user === undefined) {
        res.send({})
    } else {
        res.send(JSON.stringify(req.user[0]));
    }
};

module.exports = {
    logIn,
    logOut,
    register,
    getLoggedUser
}
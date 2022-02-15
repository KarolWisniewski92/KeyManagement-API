const express = require('express');
const envData = require('dotenv').config()
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport')
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');

const modules = require('./modules/modules');

const {
    User,
    Key,
    History
} = require('./data/schema');
const {
    json
} = require('express');
const {
    findByIdAndUpdate
} = require('./data/schema/User');

const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//----------------mongoose configuration-----------

mongoose.connect(process.env.DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(err => console.log(`Database connection error! CODE: "${err.code}"`));

const db = mongoose.connection;
db.on('error', err => console.log(`Database error! CODE: "${err.code}"`));
db.once('open', () => console.log('Database connected:', process.env.DB_HOST));

//------------------CORS---------------------

app.use(cors({
    origin: `http://192.168.0.120:${process.env.CLIENT_PORT}`,
    credentials: true
}));

//----------------ROUTING----------------------------

app.get('/', async function (req, res) {})

app.post('/login', async (req, res, next) => {
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
                console.log(`Zalogował się ${req.user.name} ${req.user.surname}`)
            })
        }
    })(req, res, next)
})

app.get('/logout', (req, res) => {
    if (typeof req.user !== "undefined") {
        console.log(`Wylogował się ${req.user[0].name} ${req.user[0].surname}`);
    }
    req.logout();
    res.send('Wylogowano!')

});


app.post('/register', async (req, res) => {

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
                        id: id
                    })
                    .then(user => {
                        return user.length === 0 ? true : false
                    })
                    .catch(err => {
                        throw err;
                    })

                return isAvailable ? id : getNewId();
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

})

// Odsyła informacje o obecnie zalogowanym użytkowniku.
app.get('/user', (req, res) => {
    if (req.user === undefined) {
        res.send({})
    } else {
        res.send(JSON.stringify(req.user[0]));
    }
});

//Pobieramy urzytkownika o nadesłanych user_id. Usuwamy klucz password i odsyłamy.
app.post('/getUserData', (req, res) => {
    modules.confirmUserPermissions(req, res, () => {
        User.findOne({
                user_id: req.body.userID
            })
            .then(async (user) => {
                // console.log({ user })
                if (user !== null) {
                    const userToSend = user;
                    userToSend.password = undefined;
                    res.send(JSON.stringify(userToSend))
                } else {
                    const userToSend = {};
                    res.send(JSON.stringify(userToSend))
                }
            })
            .catch(err => {
                throw err;
            })
    })

});

//Wyszukujemy klucze pasujące do danego set'u i odsyłamy.
app.get('/getKeysData', (req, res) => {
    modules.confirmUserPermissions(req, res, () => {
        Key.find({
                set: req.query.set
            })
            .then(keys => {
                res.send(JSON.stringify(keys))

            })
            .catch(err => {
                throw err;
            })
    })

});

//Wyszukujemy klucze pasujące do danego set'u i odsyłamy.
app.get('/getKeyData', (req, res) => {
    modules.confirmUserPermissions(req, res, () => {
        Key.find({
                keyID: req.query.keyID
            })
            .then(key => {
                res.send(JSON.stringify(key))

            })
            .catch(err => {
                throw err;
            })
    })

});

//Wyszukujemy klucze które obecnie posiada użytkownik.
app.get('/getMyKeysData', (req, res) => {
    modules.confirmUserPermissions(req, res, () => {
        Key.find({
                isTakenBy: req.query.user_id
            })
            .then(keys => {
                res.send(JSON.stringify(keys))
            })
            .catch(err => {
                throw err;
            })
    })

});

//Wyszukujemy klucz i przypisujemy mu użytkownika który go pobrał (probieramy klucz).
app.post('/getKey', modules.getKey);

//Wyszukujemy klucz i czyścimy dane użytkownika który go pobrał (zwracamy klucz).
app.post('/returnKey', modules.returnKey);

//Wyszukujemy klucz i nadpisujemy dane użytkownika który go pobrał (transferujemy od jegnego użytkownika do innego).
app.post('/transferKey', modules.transferKey);

//Wyszukujemy klucz i wpisujemy informację o chęci przekazania klucza.
app.post('/isTransferedToUpdate', modules.isTransferedToUpdate)






//Wyszukujemy użytkowników po nadełanych danych Imię, Nazwisko, Email, lub imię i nazwisko
app.get('/findUserToTransfer', (req, res) => {
    modules.confirmUserPermissions(req, res, () => {
        const user = req.query.user;
        const data = user.split(' ');
        let dataToFind = ``;

        if (data.length === 2) {
            User.find({
                    name: {
                        $in: [data[0], data[1]]
                    },
                    surname: {
                        $in: [data[0], data[1]]
                    }
                })
                .then((data) => {
                    const newDataToSend = data.map(el => {
                        el.password = undefined;
                        el.isActive = undefined;
                        el.phone = undefined;
                        el.email = undefined;
                        el.role = undefined;
                        return el;
                    })
                    res.send(JSON.stringify(newDataToSend))
                })
        } else if (data.length === 1) {
            User.find({
                    $or: [{
                        name: data[0]
                    }, {
                        surname: data[0]
                    }, {
                        email: data[0]
                    }]
                })
                .then((data) => {
                    const newDataToSend = data.map(el => {
                        el.password = undefined;
                        el.isActive = undefined;
                        el.phone = undefined;
                        el.email = undefined;
                        el.role = undefined;
                        return el;
                    })
                    res.send(JSON.stringify(newDataToSend))
                })
        }
    })

})


app.get('/getKeyHistory', (req, res) => {
    History.find({
            keyID: req.query.keyID
        })
        .then(data => {
            res.send(JSON.stringify(data))
        })
        .catch(err => {
            throw err;
        })

})

app.get('/keysTransferedToMe', (req, res) => {
    modules.confirmUserPermissions(req, res, () => {
        Key.find({
                isTransferedTo: req.query.user
            })
            .then(data => {
                res.send(JSON.stringify(data))
            })
            .catch(err => {
                throw err;
            })
    })

})

// Tymczasowe szybkie wpisu histori do bazy danych

app.get('/addHistory', (req, res) => {

    const dateNow = new Date();
    const newHistory = new History({
        keyID: "KP_0016",
        isTakenBy: "twis",
        isTakenData: "2022-02-06T17:55:58.552Z",
        isReturnedData: dateNow,

    })
    newHistory.save()
        .then(data => {
            res.send(`Poprawnie utworzono wpis historii`)
        })
        .catch(err => {
            throw err;
        })
})

// Tymczasowe szybkie dodawanie kluczy do bazy danych

// app.get('/addKey', (req, res) => {
//     const newKey = new Key({
//         keyID: "KP_0016",
//         set: "NOC",
//         owner: "WSS",
//         name: "Czempiń (pow. Kościański)",
//         isTaken: false,
//         isTakenBy: "",
//         isTakenData: "",
//         isTransferedTo: "",
//         adres: "ul. Przedszkolna 1",
//         imageID: 2
//     })
//     newKey.save()
//         .then(data => {
//             res.send(`Poprawnie utworzono nowy klucz!`)
//         })
//         .catch(err => {
//             throw err;
//         })
// })




//----------------------SERVER START---------------------------------

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
    if (envData.error) {
        throw envData.error
    } else {
        console.log('envData are loaded!')
    }
});
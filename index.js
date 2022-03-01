const express = require('express');
const envData = require('dotenv').config()
const mongooseConfig = require('./mongooseConfig').mongooseConfig;
const corsConfig = require('./corsConfig').corsConfig;
const passport = require('passport')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const modules = require('./modules/modules');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');

const {
    User,
    Key
} = require('./data/schema');

const app = express();


//----------------passport & session configuration-----------
app.use(session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//----------------parser configuration-----------
app.use(cookieParser("secretcode"));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

//----------------mongoose configuration-----------

mongooseConfig();

//------------------CORS---------------------

corsConfig(app);

//----------------ROUTING----------------------------

app.get('/', async function (req, res) {})

app.post('/login', modules.logIn);
app.get('/logout', modules.logOut);
app.post('/register', modules.register);

// Odsyła informacje o obecnie zalogowanym użytkowniku.
app.get('/user', modules.getLoggedUser);

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
app.post('/isTransferedToUpdate', modules.isTransferedToUpdate);

//Pobiera wpisy historii dla danego klucza.
app.get('/getKeyHistory', modules.getKeyHistory);

//Dodaje nowy klucz do bazy danych
app.post('/addNewKey', modules.addNewKey)




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

// app.get('/addHistory', (req, res) => {

//     const dateNow = new Date();
//     const newHistory = new History({
//         keyID: "KP_0016",
//         isTakenBy: "twis",
//         isTakenData: "2022-02-06T17:55:58.552Z",
//         isReturnedData: dateNow,

//     })
//     newHistory.save()
//         .then(data => {
//             res.send(`Poprawnie utworzono wpis historii`)
//         })
//         .catch(err => {
//             throw err;
//         })
// })




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
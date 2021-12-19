const express = require('express');
const envData = require('dotenv').config()
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const { User } = require('./data/schema');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
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
    origin: `http://localhost:${process.env.CLIENT_PORT}`,
    credentials: true
}))

//----------------ROUTING----------------------------

app.get('/', async function (req, res) {
})

app.post('/login', async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("No User Exists")
        else {
            req.logIn(user, err => {
                if (err) throw err;
                res.send("Succesfully Authenticated")
                console.log(`Zalogował się ${req.user.name} ${req.user.surname}`)
            })
        }
    })(req, res, next)
})

app.get('/logout', (req, res) => {
    req.logout();
    res.send('Wylogowano!')
});


app.post('/register', async (req, res) => {

    User.findOne({ email: req.body.email })
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
                const isAvailable = await User.find({ id: id })
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

app.get('/user', (req, res) => {
    // console.log(req.user)
    if (req.user === undefined) {
        res.send({})
    } else {
        res.send(JSON.stringify(req.user[0]));
    }
})

//Pobieramy urzytkownika o nadesłanych user_id. Usuwamy klucz password i odsyłamy.
app.post('/getUserData', (req, res) => {
    User.findOne({ user_id: req.body.userID })
        .then(async (user) => {
            console.log({ user })
            if (user !== null) {
                const userToSend = user;
                userToSend.password = undefined;
                res.send(JSON.stringify(userToSend))
            } else {
                const userToSend = {};
                res.send(JSON.stringify(userToSend))
            }

        })

})




//----------------------SERVER START---------------------------------

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
    if (envData.error) {
        throw envData.error
    } else {
        console.log('envData are loaded!')
    }
});
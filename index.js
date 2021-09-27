const express = require('express');
const envData = require('dotenv').config()
const mongoose = require('mongoose');

//----------------mongoose configuration-----------

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .catch(err => console.log(`Database connection error! CODE: "${err.code}"`));

const db = mongoose.connection;
db.on('error', err => console.log(`Database error! CODE: "${err.code}"`));
db.once('open', () => console.log('Database connected:', process.env.DB_HOST));

//--------------mongoose schema & models----------

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    tel: Number,
    email: String,
    ID: String,
    Password: String
});

const User = mongoose.model('User', userSchema);

//----------------------------------------------------

const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${process.env.CLIENT_PORT}`);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.get('/', async function (req, res) {
    const user = await User.find({ name: "Karol" });
    res.send(user)
    console.log(user)
})

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
    if (envData.error) {
        throw envData.error
    } else {
        console.log('envData are loaded!')
    }
});
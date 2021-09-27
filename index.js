const express = require('express');
const envData = require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .catch(err => console.log(`Database connection error! CODE: "${err.code}"`));

const db = mongoose.connection;
db.on('error', err => console.log(`Database error! CODE: "${err.code}"`));
db.once('open', () => console.log('Database connected:', process.env.DB_HOST));

const app = express();

app.use(() => {

})

app.get('/', function (req, res) {
    console.log('działa')
})

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
    if (envData.error) {
        throw envData.error
    } else {
        console.log('envData are loaded!')
    }
});
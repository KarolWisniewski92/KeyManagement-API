const mongoose = require('mongoose');

const mongooseConfig = () => {

    mongoose.connect(process.env.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch(err => console.log(`Database connection error! CODE: "${err.code}"`));

    const db = mongoose.connection;
    db.on('error', err => console.log(`Database error! CODE: "${err.code}"`));
    db.once('open', () => console.log('Database connected:', process.env.DB_HOST));
};

module.exports = {
    mongooseConfig
}
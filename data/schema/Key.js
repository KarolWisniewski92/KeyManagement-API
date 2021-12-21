const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    keyID: String,
    set: String,
    name: String,
    adres: String,
    isTaken: Boolean,
    isTakenBy: String,
    isTakenData: String,
    isTransferedTo: String,
});

module.exports = mongoose.model('Key', keySchema);
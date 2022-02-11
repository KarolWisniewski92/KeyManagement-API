const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    keyID: String,
    isTakenData: Date,
    isTakenBy: String,
    isReturnedData: Date,
    isReturned: Boolean
});

module.exports = mongoose.model('History', historySchema);
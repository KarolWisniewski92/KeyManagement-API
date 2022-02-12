const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    keyID: String,
    isTakenData: Date,
    isTakenBy: String,
    isReturned: Boolean,
    isReturnedData: Date,
});

module.exports = mongoose.model('History', historySchema);
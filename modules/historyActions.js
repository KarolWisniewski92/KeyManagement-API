const {
    History
} = require('../data/schema');

const getKeyHistory = (req, res) => {
    History.find({
            keyID: req.query.keyID
        })
        .then(data => {
            res.send(JSON.stringify(data))
        })
        .catch(err => {
            throw err;
        })
};

//Robimy wpis do historii
const addHistory = async (type, data) => {

    let dataToUpdate = {};
    let history;
    let lastHistoryItem;

    switch (type) {
        case 'GET':
            dataToUpdate = {
                ...data,
                isReturned: false,
                isReturnedData: null
            }

            const newHistory = new History({
                ...dataToUpdate
            })
            newHistory.save()
                .catch(err => {
                    throw err;
                })

            break;

        case 'RETURN':
            dataToUpdate = {
                isReturned: true,
                isReturnedData: data.isReturnedData
            }

            history = await History.find({
                keyID: data.keyID
            })
            lastHistoryItem = history.pop();

            History.findByIdAndUpdate({
                    _id: lastHistoryItem._id
                }, dataToUpdate, {
                    returnDocument: 'after'
                })
                .catch(err => {
                    throw err;
                })

            break;

        case 'TRANSFER':
            dataToUpdate = {
                isReturned: true,
                isReturnedData: data.isReturnedData
            }

            history = await History.find({
                keyID: data.keyID
            })
            lastHistoryItem = history.pop();

            History.findByIdAndUpdate({
                    _id: lastHistoryItem._id
                }, dataToUpdate, {
                    returnDocument: 'after'
                })

                .then(() => {
                    dataToUpdate = {
                        ...data,
                        isReturned: false,
                        isReturnedData: null
                    }

                    const newHistory = new History({
                        ...dataToUpdate
                    })
                    newHistory.save()
                        .catch(err => {
                            throw err;
                        })
                })
                .catch(err => {
                    throw err;
                })



            break;
    }
}

module.exports = {
    addHistory,
    getKeyHistory
}
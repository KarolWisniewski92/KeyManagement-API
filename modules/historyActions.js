const confirmUserPermissions = require('./confirmUserPermissions');

const {
    History
} = require('../data/schema');
const {
    findByIdAndUpdate
} = require('../data/schema/User');

//Robimy wpis do historii
const addHistory = async (type, data) => {
    console.log({
        type
    })

    let dataToUpdate = {};
    let history;
    let lastHistoryItem;

    switch (type) {
        case 'GET':
            console.log("To jest get!")
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

            console.log(dataToUpdate)
            break;

        case 'RETURN':
            console.log("To jest return!")
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
            console.log("To jest transfer!")
            console.log({
                data
            })
            dataToUpdate = {
                isReturned: true,
                isReturnedData: data.isReturnedData
            }

            history = await History.find({
                keyID: data.keyID
            })
            lastHistoryItem = history.pop();
            console.log(dataToUpdate)

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

                    console.log({
                        dataToUpdate
                    })
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
    addHistory
}




// const test = keyID;
// const dateNow = new Date();

// const defaultDataToSave = {
//     isTakenData: null,
//     isTakenBy: "",
//     isReturned: false,
//     isReturnedData: null,
// };

// const dataToSave = {
//     keyID: test,
//     ...defaultDataToSave,
//     ...data,
// };

// const newHistory = new History({
//     ...dataToSave

// })
// newHistory.save()
//     .then(data => {
//         // res.send(`Poprawnie utworzono wpis historii`)
//     })
//     .catch(err => {
//         throw err;
//     })

// }
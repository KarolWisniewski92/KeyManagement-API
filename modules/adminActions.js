const e = require('express');
const {
    Key
} = require('../data/schema');

const confirmAdminPermissions = require('./confirmAdminPermissions').confirmAdminPermissions;

const addNewKey = async (req, res) => {
    // confirmAdminPermissions(req, res, async () => {       
    // })
    const newKeyData = req.body;

    //Funkcja generująca id dla nowego klucza
    const getNewKeyID = async (idLength) => {
        let keyID = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < idLength; i++) {
            keyID += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        const keyIdToCheck = newKeyData.set.map(el => {
            return `${el}_${keyID}`
        })

        const isAvailable = await Promise.all(keyIdToCheck.map(async el => {
            const key = await Key.find({
                    keyID: el
                })
                .then(data => {
                    return data
                })
            return key.length === 0 ? true : false
        }))

        if (isAvailable.includes(true)) {
            return keyID
        } else {
            getNewKeyID(10)
        }
    }

    //Jeżeli wybrano tylko 1 zdjęcie to zwraca jego numer, jeżeli wybrano kilka to losuje z nich jedno i to zwraca.
    const getNewKeyImage = (photos) => {
        if (photos.length === 1) {
            return photos[0];
        } else {
            return photos[Math.floor(Math.random() * photos.length)];
        }
    }

    //Generujemy nowe ID
    const newID = await getNewKeyID(10);

    const newKeyDataFull = {
        owner: newKeyData.owner,
        name: newKeyData.name,
        adres: newKeyData.adres,
        isTaken: false,
        isTakenBy: "",
        isTakenData: null,
        isTransferedTo: "",
        imageID: getNewKeyImage(newKeyData.photo)
    }

    //Zapisujemy klucz dla każdego z zestawów. Zwracamy true jeśli wszystko ok, false jeśli wystąpił błąd.
    const status = await Promise.all(newKeyData.set.map(async el => {

        newKeyDataFull.set = el;
        newKeyDataFull.keyID = `${el}_${newID}`

        const keyToSave = new Key({
            ...newKeyDataFull
        })
        const keySaved = await keyToSave.save()
            .then(data => {
                return true
            })
            .catch(err => {
                return false
            })
        return keySaved;
    }))

    //Sprawdzamy czy przy zapisie któregoś klucza wystąpił błąd i odpowiadamy.
    if (!status.includes(false)) {
        res.send(JSON.stringify({
            error: false,
            message: ""
        }))
    } else {
        res.send(JSON.stringify({
            error: true,
            message: "Wystąpił błąd, spróbuj ponownie!"
        }))
    }
}


module.exports = {
    addNewKey
}
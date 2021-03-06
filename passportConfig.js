const {
    User
} = require('./data/schema');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    passport.use(new LocalStrategy({
            usernameField: 'email' //zmieniamy username na email
        },
        (email, password, done) => {
            User.findOne({
                email: email
            }, async (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false, "Nie znaleziono użytkownika!");

                const checkedPassword = await bcrypt.compare(password, user.password)
                    .then(function (result) {
                        return result
                    })

                if (checkedPassword) {
                    return done(null, user)
                } else {
                    return done(null, false, "Podano błędne hasło!")
                }
            })
        }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.find({
            _id: id
        }, (err, user) => {
            done(err, user);
        })
    });
}
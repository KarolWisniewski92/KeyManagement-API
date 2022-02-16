const cors = require('cors');

const corsConfig = (app) => {
    app.use(cors({
        origin: [`http://192.168.0.120:${process.env.CLIENT_PORT}`, `http://localhost:${process.env.CLIENT_PORT}`],
        credentials: true
    }));
}

module.exports = {
    corsConfig
}
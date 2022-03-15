const cors = require('cors');

const originDirection = `${process.env.CLIENT_IP_ADRESS}:${process.env.CLIENT_PORT}`

const corsConfig = (app) => {
    app.use(cors({
        origin: [originDirection, `http://localhost:${process.env.CLIENT_PORT}`],
        credentials: true
    }));
}

module.exports = {
    corsConfig
}
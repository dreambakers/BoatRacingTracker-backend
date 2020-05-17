const bodyParser = require('body-parser')
const cors = require('cors');

const app = require('express')();
const server = require('http').Server(app);
const socket = require('./sockets/socket');

socket.connect(server);

const routes = require('./routes/routes');

app.use(cors({origin:true,credentials: true})); // allow cors headers
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'x-auth,x-filesize,Content-Type');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => { res.send('Hello world!') });

app.use('/', routes);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = { app }
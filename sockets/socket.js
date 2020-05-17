let connection = null;

class SocketServer {
    constructor() {
        this._socket = null;
    }

    connect(server) {
        const io = require('socket.io')(server);

        io.on('connection', (socket) => {
            this._socket = socket;
            this._socket.on('disconnect', function () {
                console.log(socket.id, "Sockets disconnected");
            });
            console.log(`New socket connection: ${socket.id}`);
        });
    }

    sendEvent(event, data) {
        this._socket.emit(event, data);
    }

    registerEvent(event, handler) {
        this._socket.on(event, handler);
    }

    static init(server) {
        if (!connection) {
            connection = new SocketServer();
            connection.connect(server);
        }
    }

    static getConnection() {
        if (!connection) {
            throw new Error("No active connection");
        }
        return connection;
    }
}

module.exports = {
    connect: SocketServer.init,
    connection: SocketServer.getConnection
}
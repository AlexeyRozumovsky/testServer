"use strict";

var WebSocketServer = new require('ws');

class ClientNotifier {

    constructor() {
        const me = this;
        let id, key;

        me.clients = {};

        me.webSocketServer = new WebSocketServer.Server({
            port: 8081
        });

        me.webSocketServer.on('connection', function (ws) {

            id = Math.random();
            me.clients[id] = ws;
            console.log("новое соединение " + id);

            ws.on('message', function (message) {
                console.log('получено сообщение ' + message);

                for (key in clients) {
                    me.clients[key].send(message);
                }
            });

            ws.on('close', function () {
                console.log('соединение закрыто ' + id);
                delete me.clients[id];
            });
        });
    }

    updateClients(tableName) {
        const clients = this.clients,
            message = {
                action: "updated",
                table: tableName
            };

        let key;

        for (key in clients) {
            clients[key].send(JSON.stringify(message));
        }
    }

    sendMessage(message) {
        let key;

        for (key in clients) {
            clients[key].send(message);
        }
    }
}

module.exports = ClientNotifier;
/**
 * Created by barthclem on 11/16/17.
 */
'use strict';
import * as express from 'express';
import * as HTTP from 'http';
import * as HTTPS from 'https';
import * as ioServer from 'socket.io';
import * as fs from 'fs';
import {SocketRoutes} from './lib/socketRoutes';
import {TeamRoom} from './lib/TeamRoom';
import {PseudoQuestions} from './data/QuestionData';
import {QuixUtility} from './helper/Utility';
import {SocketService} from './SocketService';
import {StageManager} from './quixMaster/StagesManager';
import {TeamImpl} from './helper/TeamImpl';
import {Team} from './helper/Team';

const  options: any = {
    key: fs.readFileSync('./encryption/key.pem', 'utf-8'),
    cert: fs.readFileSync('./encryption/server.crt', 'utf-8')
};

const app: any = express();
const http = new HTTP.Server(app);
const https = new HTTPS.Server(options, app);
const io = ioServer(https);
let  gamePort = 3300;
let gameName = 'Klembat';

if (process.argv[2] === 'child') {
    const net = require('net');
    const pipe = new net.Socket({fd: 3});
     gameName = process.argv[3];
     gamePort = Number(process.argv[4]);
    pipe.write(`Game Name => ${process.argv[3]}  PORT: ${process.argv[4]}`);
    console.log(pipe.write(`Game Name => ${process.argv[3]}  PORT: ${process.argv[4]}`));
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
    });
}
class Server {

    private socketService: SocketService;
    private stageRunner: StageManager;
    private socketRoutes: SocketRoutes;
    constructor() {
        this.socketService = new SocketService(io);
        this.stageRunner = new StageManager([], Server.getRooms(), this.socketService);
    }
    static getTeamList() {
        return [ new TeamRoom('Mega'), new TeamRoom('Winner'), new TeamRoom('Stun'), new TeamRoom('Nimb')];
    }

    static getRooms(): TeamImpl [] {
       // return [ new TeamImpl('Mega'), new TeamImpl('Winner'), new TeamImpl('Stun'), new TeamImpl('Nimb')];
        return [ new TeamImpl('Mega'), new TeamImpl('Stun')];
    }

    configSocket () {
        const rooms = Server.getRooms();
        this.socketRoutes = new SocketRoutes(io);
        this.socketRoutes.configSocketConnection(rooms, this.stageRunner);
    }


    start() {
        this.configSocket();
        // http.listen( 5000, () => {
        //     console.log('server is started on port 5000');
        // });

        https.listen(gamePort || 3300, () => {
            console.log(`HTTPS server is started on port ${gamePort || 3300}`);
        });
    }

}

const server = new Server();
server.start();

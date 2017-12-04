/**
 * Created by barthclem on 11/16/17.
 */
'use strict';
import * as express from 'express';
import * as HTTP from 'http';
import * as ioServer from 'socket.io';
import {SocketRoutes} from './lib/socketRoutes';
import {TeamRoom} from './lib/TeamRoom';
import {PseudoQuestions} from './data/QuestionData';
import {QuixUtility} from './helper/Utility';
import {SocketService} from './SocketService';
import {StageManager} from './quixMaster/StagesManager';
import {TeamImpl} from './helper/TeamImpl';
import {Team} from './helper/Team';

const app: any = express();
const http = new HTTP.Server(app);
const io = ioServer(http);

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
        http.listen(5000, () => {
            console.log('server is started on port 5000');
        });
    }

}

const server = new Server();
server.start();

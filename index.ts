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
import {SocketService} from './SocketService';
import {StageManager} from './quixMaster/StagesManager';
import {TeamImpl} from './helper/TeamImpl';
import * as mongoose from 'mongoose';
import {GameModel,  ITeamSchema} from './models/gameModel';
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

    private  teams: TeamImpl [];
    private teamRoom: Team;
    private socketService: SocketService;
    private stageRunner: StageManager;
    private socketRoutes: SocketRoutes;

    constructor() {
        this.teams = [];
    }


      getGameTeamList (gamename: string) {
        GameModel.findOne({'name': gamename}, (err: any, game: any) => {
            if (err) {
                console.log(`Game Model Error : ${err}`);
            }
           this.teams  = game.teamList.map((g: ITeamSchema) => new TeamImpl(g.teamName));
            this.socketService = new SocketService(io);
            console.log(`Teams ---- > ${JSON.stringify(this.teams)}`);
            this.stageRunner = new StageManager([], this.teams, this.socketService);
            this.configSocket(this.teams);
        });
    }

    configSocket (teams: TeamImpl  []) {
        console.log(`\n\n Main Server => ${teams}`);
        this.socketRoutes = new SocketRoutes(io);
        this.socketRoutes.configSocketConnection(teams, this.stageRunner);
    }

    initializeDB (): void {
        mongoose.connect('mongodb://localhost/quix_game')
            .then(() =>  console.log('connection good'))
            .catch((err) => console.error(err));
    }

    async start() {
        await this.initializeDB ();
        this.getGameTeamList(gameName);

        https.listen(gamePort || 3300, () => {
            console.log(`HTTPS server is started on port ${gamePort || 3300}`);
        });
    }

}

const server = new Server();
server.start();

/**
 * Created by barthclem on 1/5/18.
 */

export  class PeersConnection {

    private _peersList: Map<number, any>;

    constructor () {
        this._peersList = new Map();
    }

    get peersList(): Map<number, any> {
        return this._peersList;
    }

    addNewPeer(uuid: number, socket: any): void {
        this.peersList.set(uuid, socket);
    }

    removePeer(uuid: number): void {
        this.peersList.delete(uuid);
    }

    getRoomPeersList (roomName: string) {
       const roomPeers: Map<number, any> = new Map();

       this._peersList.forEach((socket, uuid) => {
           if (socket.userTeam === roomName) {
               roomPeers.set(uuid, socket);
           }
       });

       return roomPeers;
    }
}

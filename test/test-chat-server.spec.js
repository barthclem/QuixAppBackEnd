/**
 * Created by barthclem on 10/16/17.
 */
'use strict';

const should = require('should');
const io = require('socket.io-client');

const socketURL = 'http://localhost:5000';

const options = {
    transports: ['websocket'],
    'force new connection': true
};

const chatUser1 = { 'username': 'Aanu', 'room': 'Nimb'};
const chatUser2 = { 'username' : 'Barth', 'room': 'Nimb'};
const chatUser3 = { 'username': 'b@klem', 'room': 'Nimb'};

describe('Chat Server', function () {

    it('should broadcast new user to all users', (done)=>{

        const client1 = io.connect(socketURL, options);

        client1.on('connect', function(data) {
            client1.emit('join', chatUser1);

            const client2 = io.connect(socketURL, options);

            client2.on('connect', () => {
                client2.emit('join', chatUser2);
            });

            client2.on('response', (responseData)=>{
                responseData.data.username.should.equal(chatUser2.username);
                client1.disconnect();
                client2.disconnect();
            });
        });

        done();
    });

    it('should inform the others when a user disconnect', (done)=> {
        let client1, client2;

        let messageCounter= 0;

        client1= io.connect(socketURL, options);
        client2 = io.connect(socketURL, options);

        client1.on('connect', () => {
            client1.emit('join', chatUser1);
        });

        client2.on('connect', () => {
            client2.emit('join', chatUser2);
            client1.disconnect();
        });

        client2.on('response', (responseData) => {
            console.log('message Counter', messageCounter);
            if(messageCounter++ === 3){
                responseData.type.should.equal('disconnection-event');
                responseData.data.username.should.equal(chatUser1.username);
                done();
                client2.disconnect();
            }
        });

    });

    it('should ensure members in the same room receive message sent by another member', (done)=> {
        let client1, client2, client3;

        let messageCounter= 0;

        client1= io.connect(socketURL, options);
        client2 = io.connect(socketURL, options);
        client3 = io.connect(socketURL, options);

        client1.on('connect', () => {
            client1.emit('join', chatUser1);
        });

        client2.on('connect', () => {
            client2.emit('join', chatUser2);
        });

        client3.on('connect', () => {
            client3.emit('join', chatUser3);
        });

        const message = ' This is a text that is used to test tarting';
        client1.emit('message', { username: chatUser1.username, room: chatUser1.room, text:message});


        client2.on('response', (responseData) => {

            if(messageCounter++ === 4) {
                console.log(`responseData  ${JSON.stringify(responseData)}`);
                responseData.type.should.equal('new-message');
                responseData.data.username.should.equal(chatUser1.username);
                responseData.data.text.should.equal(message);
                client2.disconnect();
                done();
            }
        });


    });

});
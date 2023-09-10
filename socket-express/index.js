// const express = require('express');
// const Redis = require('ioredis');
// const http =  require('http');
// const { Server } = require('socket.io');
// const cors = require('cors')
// const connect = require('socket.io-client');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const port = 5000;
// app.use(express.static('public'));
// app.use(cors());

// let publisher = new Redis("rediss://default:7a7c628de3224ca8b7e4b731299a1db4@eu1-trusting-finch-40040.upstash.io:40040");
// let subscriber = new Redis("rediss://default:7a7c628de3224ca8b7e4b731299a1db4@eu1-trusting-finch-40040.upstash.io:40040");


// io.on('connection', async (socket) => {
//     console.log('A client connected');
  
//     // Subscribe to the Redis channel
//     await subscriber.subscribe('tournamentChannel');
  
//     // Handle incoming Redis messages and emit them via WebSocket
//     socket.on('message', (channel, message) => {
//       console.log(`Received message from ${channel}: ${message}`);
//       //socket.emit('message', message);
//     });
  
//     // Clean up when the socket disconnects
//     socket.on('disconnect', () => {
//       console.log('A client disconnected');
//       client.unsubscribe('tournamentChannel');
//     });
// });

// app.get('/connect', async (req,res) => {
//     const socc = connect('http://localhost:5000');

//     socc.emit('message', {greeting:"Hello"});

//     socc.on('connect', () => {
//         console.log("oce li ovakoooo???");
//     })

//     socc.on('disconnect', () => {
//         console.log('Disconnected from WebSocket server');
//       });

//     res.send("Connected!");
// })

// app.get('/tournament', async (req, res) => {
//     // Some logic to start the tournament
//     // ...

//     // await subscriber.subscribe('tournamentChannel');
  
//     // Publish a message to the Redis channel when the tournament starts
//     // await client.set("tournament", "test");
//     // const resp = await client.get("tournament");
//     await publisher.publish('tournamentChannel', "New Tournament Created!");

//     // subscriber.on('message', (channel, message) => {
//     //     console.log(`Received message from ${channel}: ${message}`);
//     //     //socket.emit('message', message);
//     //   });
//     res.send("Tournament starteeeed");
// });



// app.listen(port, () => {
//     console.log(`Express server listening on port ${port}`);
// })



// const Redis = require('ioredis');
// const cors = require('cors')
// const express = require('express');

import Redis from 'ioredis';
import cors from 'cors';
import express, { json } from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(json());

const server = createServer(app);

const io = new Server(server);
const port = process.env.PORT || 8080;

let redis = new Redis("rediss://default:7a7c628de3224ca8b7e4b731299a1db4@eu1-trusting-finch-40040.upstash.io:40040");

io.on('connection', (socket) => {
  console.log("Socket - user connected")
  redis.subscribe('TournamentCreated');

  redis.on('message', (channel, message) => {
    const msg = JSON.parse(message);
    
    if(channel === 'TournamentCreated') {
      let response = {type:'TournamentCreated', name: msg.name }
      
      console.log(`NEW TOURNAMENT: ${msg.name} // TTL: ${msg.ttl}`);
      socket.emit('message', JSON.stringify(response));

      if(msg.ttl && typeof msg.ttl === 'number' && msg.ttl !== -1) {
        setTimeout(() => {
          console.log("Tournament expired")
          response = {...response, type:'TournamentExpired'}
          socket.emit('message', JSON.stringify(response));
        }, msg.ttl * 1000);
      }
    }
  })

  socket.on('disconnect', function () {
    console.log('user disconnected');
  }); 

});

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
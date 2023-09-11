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
      // Broadcast to connected users
      socket.emit('message', JSON.stringify(response));

      if(msg.ttl && typeof msg.ttl === 'number' && msg.ttl !== -1) { 
        setTimeout(() => {
          console.log("Tournament expired");
          response = {...response, type:'TournamentExpired'};

          socket.emit('message', JSON.stringify(response));
        }, msg.ttl * 1000);
    }
  }
})

  socket.on('disconnect', () => {
    console.log('user disconnected');
    //redis.unsubscribe('TournamentCreated');
  }); 
});


server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
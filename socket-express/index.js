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

let isTournamentActive = false;
let activeTournament = {};
let createdTime = null;

redis.subscribe('TournamentCreated');
redis.on('message', (channel, message) => {
  const msg = JSON.parse(message);

  if (channel === 'TournamentCreated') {
    isTournamentActive = true;
    activeTournament = {type:'TournamentCreated', name: msg.name, ttl: msg.ttl };
    createdTime = new Date().getTime();
    console.log(`REDIS ON: New tournament: ${msg.name} // TTL: ${msg.ttl}`);

    // Handle tournament expiration
    if (msg.ttl && typeof msg.ttl === 'number' && msg.ttl !== -1) {
      setTimeout(() => {
          isTournamentActive = false;
          activeTournament = {};
          createdTime = null;
          console.log("REDIS.ON: Tournament expired");
      }, msg.ttl * 1000);
    }
    
    // Handler when user is already connected to a socket and new tournament gets created
    if (isTournamentActive) {
      io.emit('message', JSON.stringify(activeTournament));
    }
  }
})

io.on('connection', (socket) => {
  console.log("Socket - user connected");

  if(isTournamentActive) {
    if (typeof activeTournament.ttl === 'number' && activeTournament.ttl !== -1) {
      const currentTime = new Date().getTime();
      const expirationTime = createdTime + activeTournament.ttl * 1000;
      const remainingTimeInSeconds = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
      
      // Emit tournament with remaining TTL to the connected user
      let updated = {...activeTournament, ttl:remainingTimeInSeconds};
      console.log(`Active tournament: ${updated.name}, time remaining: ${updated.ttl}`);
      socket.emit('message', JSON.stringify(updated));
    }
  } else {
    console.log("No tournaments active")
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
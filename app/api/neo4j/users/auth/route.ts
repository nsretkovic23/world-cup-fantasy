import { Nation, Player, Position, Team, User } from '@/lib/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import {session} from '@/lib/databases/neo4j';

// Receive user's username and password from body and try to find a user in a database that matches these credentials
export async function POST(request: Request) {
    let reqBody = await request.json();

    if(!reqBody.username || !reqBody.password) {
        return new Response(JSON.stringify({errorMessage:"No username or password provided"}));
    }
    
    try {
        let result: QueryResult = await session.run(`
        MATCH (u:User {username:"${reqBody.username}", password:"${reqBody.password}"}), 
        (u)-[:CHOSE_ST]->(st:Player),
        (u)-[:CHOSE_MID]->(mid:Player),
        (u)-[:CHOSE_DEF]->(def:Player),
        (u)-[:CHOSE_GK]->(gk:Player)
        OPTIONAL MATCH (st)-[:PLAYS_FOR]->(strikerNation:Nation)
        OPTIONAL MATCH (st)-[:PLAYS_POSITION]->(strikerPosition:Position)
        OPTIONAL MATCH (mid)-[:PLAYS_FOR]->(midNation:Nation)
        OPTIONAL MATCH (mid)-[:PLAYS_POSITION]->(midPosition:Position)
        OPTIONAL MATCH (def)-[:PLAYS_FOR]->(defNation:Nation)
        OPTIONAL MATCH (def)-[:PLAYS_POSITION]->(defPosition:Position)
        OPTIONAL MATCH (gk)-[:PLAYS_FOR]->(gkNation:Nation)
        OPTIONAL MATCH (gk)-[:PLAYS_POSITION]->(gkPosition:Position)
        RETURN u, id(u) AS userId, st, mid, def, gk, 
        strikerNation, strikerPosition,
        midNation, midPosition,
        defNation, defPosition,
        gkNation, gkPosition`);

        if(result.records.length > 0) {
          // There is already a constraint that username is unique, but still, take the first element
          const usersResult = result.records[0]
          const singleUserResult = usersResult.get(0);
          // Get user
          const user = singleUserResult.properties as User;
          // Get user's neo4j id
          const id = singleUserResult.identity.low
          
          let strikers = [] as Player[];
          result.records.forEach(record => strikers.push(getPlayerData(record, 'st', 'strikerNation', 'strikerPosition')));
          let midfielders = [] as Player[];
          result.records.forEach(record => midfielders.push(getPlayerData(record, 'mid', 'midNation', 'midPosition')));
          let defenders = [] as Player[];
          result.records.forEach(record => defenders.push(getPlayerData(record, 'def', 'defNation', 'defPosition')));
          let goalkeeper = [] as Player[];
          result.records.forEach(record => goalkeeper.push(getPlayerData(record, 'gk', 'gkNation', 'gkPosition')));
          console.log(defenders);
          
          const team = {goalkeeper, defenders, midfielders, strikers} satisfies Team;
          
          return new Response(JSON.stringify({...user, id, team} satisfies User), {status:200});
        } else {
          return new Response(JSON.stringify({errorMessage:"Wrong credentials"}), {status:404});
        }
    } catch(error) {
        return new Response(JSON.stringify({errorMessage:error}), {status:500});
    }
}

function getPlayerData(record:any, key:string, nationKey:string, positionKey:string) {
  console.log(record);
   const player = record.get(key).properties;
   const nation = record.get(nationKey).properties as Nation;
   const position = record.get(positionKey).properties as Position;
   const price = player.price.low;
   const rating = player.rating.low;
   //console.log({name:player.name, club:player.club, price, rating, nation, position})
   return {name:player.name, club:player.club, price, rating, nation, position} as Player;
}
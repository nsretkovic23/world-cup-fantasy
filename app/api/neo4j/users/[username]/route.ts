import { User, Player } from '@/lib/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import { NextApiRequest } from 'next';
import {session} from '@/lib/databases/neo4j';
import { userTeamQuery } from '@/lib/queries';
import { createUserObjectFromRecords } from '../(helpers)/helpers';

// Getting a user by username
export async function GET(request: NextApiRequest, { params }:{params:any}) {
    try {
        let result: QueryResult = await session.run(`
        MATCH (u:User {username:"${params.username}"}) `+ userTeamQuery);

        if(result.records.length > 0) {
          const user = createUserObjectFromRecords(result);
          return new Response(JSON.stringify(user), {status:200});
        } else {
          return new Response(JSON.stringify({errorMessage:"Username doesn't exist"}), {status:404});
        }
    } catch(error) {
        return new Response(JSON.stringify({errorMessage:error}), {status:500});
    }
}

export async function PUT(request: Request) {
  let body = await request.json();
  const userBody = body.user as User;
  const playerBody = body.player as Player;

  try {
    let result: QueryResult = await session.run(`
    MATCH 
    (u:User {username:"${userBody.username}", password:"${userBody.password}"}) ` 
    + userTeamQuery);

    if(result.records.length <= 0) {
      return new Response(JSON.stringify({errorMessage:"User Not Found"}), {status:404});
    }
    
    // Server side validation if player can be added to user's team 
    // First getting a user
    const user = createUserObjectFromRecords(result);
    const [canAdd, positionIdentifier] = canAddPlayerToUsersTeam(user, playerBody);  
    
    if(!canAdd)
      return new Response(JSON.stringify({errorMessage:"Can not add player to the team, all players are added for position: "+playerBody.position.position}), {status:400});
    
    // Updating the player by creating a new relation CHOSE_(POSITION) from user towards the player
    try{
      let query = `MATCH
      (u:User where ID(u)=${user.id}),
      (p:Player where ID(p)=${playerBody.id})
      CREATE (u)-[:CHOSE_${positionIdentifier}] -> (p)`

      let update: QueryResult = await session.run(query)

      if(update.records.length > 0) {
        return new Response(JSON.stringify({status:200}));
      }
    } catch(error) {
      return new Response(JSON.stringify({errorMessage:error}), {status:500});
    }

  
  } catch(error) {
    return new Response(JSON.stringify({errorMessage:error}), {status:500});
  }
}

function canAddPlayerToUsersTeam(user:User, player:Player):[boolean, string] {
  if(player.position.position === "Goalkeeper" && user.team.goalkeeper.length === 0)
    return [true, "GK"];

  if(player.position.position === "Defender" && user.team.defenders.length < 4)
    return [true, "DEF"];

  if(player.position.position === "Midfielder" && user.team.midfielders.length < 4)
    return [true, "MID"];

  if(player.position.position === "Striker" && user.team.strikers.length < 2)
    return [true, "ST"];

  return [false, ""];
}
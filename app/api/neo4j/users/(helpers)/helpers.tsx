import { Nation, Player, Position, Team, User } from "@/lib/interfaces/db-data-Interfaces";
import { QueryResult } from "neo4j-driver";

export function createUserObjectFromRecords(result:QueryResult<any>) : User {
  const usersResult = result.records[0]
  const singleUserResult = usersResult.get(0);
  // Get user
  const user = singleUserResult.properties as User;
  // Get user's neo4j id
  const id = singleUserResult.identity.low;
  // Create team object from user's selected players
  const team = createTeam(result.records) satisfies Team;

  return {...user, id, team} satisfies User;
}

export function createTeam(records:Record<any,any>[]):Team {
  let strikers = [] as Player[];
  let midfielders = [] as Player[];
  let defenders = [] as Player[];
  let goalkeeper = [] as Player[];
  records.forEach(record => {
      let player = getPlayerData(record, 'st', 'strikerNation', 'strikerPosition');
      if(player && strikers.every(st => st.id !== player?.id)) {
        strikers.push(player);
      }
    
      player = getPlayerData(record, 'mid', 'midNation', 'midPosition');
      if(player && midfielders.every(mid => mid.id !== player?.id)) {
        midfielders.push(player);
      }
    
      player = getPlayerData(record, 'def', 'defNation', 'defPosition');
      if(player && defenders.every(def => def.id !== player?.id)) {
        defenders.push(player);
      }
    
      player = getPlayerData(record, 'gk', 'gkNation', 'gkPosition')
      if(player && goalkeeper.every(gk => gk.id !== player?.id)) {
        goalkeeper.push(player);
      }
  });
  return {goalkeeper, defenders, midfielders, strikers} satisfies Team;
}

export function getPlayerData(record:any, key:string, nationKey:string, positionKey:string) {
  try{
    const player = record.get(key).properties;
    const id = record.get(key).identity.low;
    const nation = record.get(nationKey).properties as Nation;
    const position = record.get(positionKey).properties as Position;
    const price = player.price.low;
    const rating = player.rating.low;
    
    return {id, name:player.name, club:player.club, price, rating, nation, position} as Player;
  } catch(err) {
    return null;
  }
  
}
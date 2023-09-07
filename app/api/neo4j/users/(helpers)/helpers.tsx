import { Nation, Player, Position, Team } from "@/lib/interfaces/db-data-Interfaces";

export function createTeam(records:Record<any,any>[]):Team {
    let strikers = [] as Player[];
    let midfielders = [] as Player[];
    let defenders = [] as Player[];
    let goalkeeper = [] as Player[];
    records.forEach(record => {
        let player = getPlayerData(record, 'st', 'strikerNation', 'strikerPosition');
        if(strikers.every(st => st.id !== player.id)) {
          strikers.push(player);
        }
      
        player = getPlayerData(record, 'mid', 'midNation', 'midPosition');
        if(midfielders.every(mid => mid.id !== player.id)) {
          midfielders.push(player);
        }
      
        player = getPlayerData(record, 'def', 'defNation', 'defPosition');
        if(defenders.every(def => def.id !== player.id)) {
          defenders.push(player);
        }
      
        player = getPlayerData(record, 'gk', 'gkNation', 'gkPosition')
        if(goalkeeper.every(gk => gk.id !== player.id)) {
          goalkeeper.push(player);
        }
    });
    return {goalkeeper, defenders, midfielders, strikers} satisfies Team;
}

export function getPlayerData(record:any, key:string, nationKey:string, positionKey:string) {
  const player = record.get(key).properties;
  const id = record.get(key).identity.low;
  const nation = record.get(nationKey).properties as Nation;
  const position = record.get(positionKey).properties as Position;
  const price = player.price.low;
  const rating = player.rating.low;
  
  return {id, name:player.name, club:player.club, price, rating, nation, position} as Player;
}
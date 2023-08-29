import { Player, Position } from "@/lib/interfaces/db-data-Interfaces";
import { session } from "@/lib/databases/neo4j";
import { NextApiRequest } from "next";
import { QueryResult } from "neo4j-driver";

export async function GET(request: NextApiRequest, { params }:{params:any}) {
    try {
    let result: QueryResult = await session.run("MATCH (p:Position) RETURN p");

    if(result.records.length > 0)
    {
        const positionsResult = result.records;
        const positions:Position[] = positionsResult.map(record => record.get('p').properties);

        return new Response(JSON.stringify(positions), {status:200});
    } else {
        return new Response(JSON.stringify({errorMessage:"No positions found"}), {status:404});
      }
    } catch(errorMessage) {
        return new Response(JSON.stringify({errorMessage:errorMessage}), {status:500});
    }
}

// One time updating a position that is passed through request with a relation 
// :POSITION_PLAYED_BY towards all players that have relation :PLAYS_POSITION towards that position
// When creating a new player, this relation will automatically be created, this is just a patch for already created players and their relations

// export async function PATCH(request:Request) {
//     let position = await request.json() as Position;

//     // Query all players that play provided position
//     let result: QueryResult = await session.run(
//         `MATCH (players:Player)-[:PLAYS_POSITION]->(position:Position {position:"${position.position}"})
//         RETURN players`
//     );

//     let query = `MATCH(pos:Position{position:"${position.position}"}),\n`;
    
//     if(result.records.length > 0) {
//         const playersResult = result.records;
//         const players:Player[] = playersResult.map(record => {
//             const player = record.get('players').properties;
//             return player as Player;
//         });

//         players.forEach((player, index) => {
//             query += `(p${index}:Player{name:"${player.name}"})`;
//             if(index !== players.length - 1)
//                 query += ",\n";
//         });

//         players.forEach((player, index) => {
//             query += `\nMERGE (pos)-[:POSITION_PLAYED_BY]->(p${index})`;
//         });
//     }

//     try{
//         await session.run(query);
//         return new Response(JSON.stringify(query), {status:200});
//     } catch(error:any) {
//         return new Response(JSON.stringify({errorMessage:error}), {status:400});
//     }
// }
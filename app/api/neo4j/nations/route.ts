import { Nation, Player } from "@/lib/interfaces/db-data-Interfaces";
import { session } from "@/lib/databases/neo4j";
import { NextApiRequest } from "next";
import { QueryResult } from "neo4j-driver";

// Getting all nations
export async function GET(request: NextApiRequest, { params }:{params:any}) {
    try {
    let result: QueryResult = await session.run("MATCH (n:Nation) RETURN n");

    if(result.records.length > 0)
    {
        const nationsResult = result.records;
        const nations:Nation[] = nationsResult.map(record => record.get('n').properties);

        return new Response(JSON.stringify(nations), {status:200});
    } else {
        return new Response(JSON.stringify({errorMessage:"No nations found"}), {status:404});
      }
    } catch(errorMessage) {
        return new Response(JSON.stringify({errorMessage:errorMessage}), {status:500});
    }
}

// One-time updating nation and every player from this nation with another relation from nation towards player (:HAS_PLAYER)
// This function does not need to be used anymore that's why it's commented
// When creating new player, this relation will automatically be created
// At the beginning there was only player - to - nation relation :PLAYS_FOR, but, for example, filtering players by nation,
// Relation from nation - to - player would be more efficient

// export async function PATCH(request:Request) {
//     let req = await request.json();
//     let query = `MATCH(n:Nation {name:"${req.nationName}"}),`;
    
//     req.players.forEach((player:Player, index:number) => {
//         query += `\n(p${index}:Player {name:"${player.name}"})` 
        
//         if(index !== req.players.length - 1) {
//             query += ",";
//         }
//     });

//     for(let i = 0; i < req.players.length; i++) {
//         // Merge ensures that only one relation is created, in case that there is already one existing :HAS_PLAYER relation
//         query += `\nMERGE (n)-[:HAS_PLAYER]->(p${i})`; 
//     }

//     try{
//         await session.run(query);
//         return new Response(JSON.stringify(query), {status:200});
//     } catch(error:any) {
//         return new Response(JSON.stringify({errorMessage:error}), {status:400});
//     }
// }
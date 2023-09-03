import { Player, Nation, Position } from '@/lib/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import { NextApiRequest } from 'next';
import {session} from '@/lib/databases/neo4j';

// Get all players that play for provided nation, using HAS_PLAYER relation from nation towards players
// This is more effective than searching through all the players because there are fewer nations in database
export async function GET(request: NextApiRequest, { params }:{params:any})
{
    try {
    let result: QueryResult = await session.run(`MATCH (nation:Nation {name:"${params.nation}"})-[:HAS_PLAYER]->(players:Player)-[:PLAYS_POSITION]->(position:Position)
    RETURN players, id(players) as playerId, COLLECT(position) as positions`);

    if(result.records.length > 0) {
        const playersResult = result.records;
        const players:Player[] = playersResult.map(record => {
            const player = record.get('players').properties;
            const id = record.get(0).identity.low;
            const price = player.price.low;
            let rating = 0;
            if(player.rating)
            {
                rating = player.rating.low;
            }
            const position = record.get('positions').map((positionNode:any) => positionNode.properties)[0] as Position
            return {...player, price, rating, id, position} as Player;
        });

        return new Response(JSON.stringify(players), {status:200});
    } else {
        return new Response(JSON.stringify([]), {status:200});
    }
    }catch(error) {
        return new Response(JSON.stringify({errorMessage:"Specified nation not found"}), {status:404});
    }

}
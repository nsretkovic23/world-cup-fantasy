import { Player, Nation } from '@/lib/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import { NextApiRequest, NextApiResponse } from 'next';
import {session} from '@/lib/databases/neo4j';

export async function GET(request: NextApiRequest, { params }:{params:any})
{
    try {
    // TODO: Ovo invertovati, treba na osnovu nacije ici relacijom i naci sve igrace, 
    // a ne kroz sve igrace traziti relaciju da igra za odgovarajucu naciju 
    let result: QueryResult = await session.run(
        "MATCH (players:Player)-[:PLAYS_FOR]->(nation:Nation {name: $nation}) RETURN players, id(players) AS playerId", 
        { nation: params.nation });

    if(result.records.length > 0) {
        const playersResult = result.records;
        const players:Player[] = playersResult.map(record => {
            const player = record.get('players').properties;
            const id = record.get(0).identity.low;
            const price = player.price.low;
            return {...player, price, id} as Player;
        });

        return new Response(JSON.stringify(players), {status:200});
    } else {
        return new Response(JSON.stringify([]), {status:200});
    }
    }catch(error) {
        return new Response(JSON.stringify({errorMessage:"Specified nation not found"}), {status:404});
    }

}
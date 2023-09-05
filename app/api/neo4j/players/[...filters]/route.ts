import { QueryResult } from "neo4j-driver";
import { NextApiRequest } from "next";
import {session} from '@/lib/databases/neo4j';
import { Nation, Player, Position } from '@/lib/interfaces/db-data-Interfaces';

export async function GET(request: NextApiRequest, {params}:{params:any}) {
    let [position, nationality, minCost, maxCost, minRating, maxRating, skip] = params.filters;

    let query = `MATCH 
    (pos:Position {position:"${position}"}) - [:POSITION_PLAYED_BY] -> (p:Player)`;

    if(nationality !== "AllNations") {
        query += `,
        (n:Nation {name:"${nationality}"}) - [:HAS_PLAYER] -> (p)`
    } else {
        // If we are not looking for a player through provided nation
        // Get a nation for which player plays for
        query += `,
        (p) - [:PLAYS_FOR] -> (n:Nation)`
    }

    let ratingSet = false;
    if(minRating > 0 && maxRating > 0) {
        ratingSet = true;
        query += `
        WHERE p.rating >= ${minRating} AND p.rating <= ${maxRating}`;
    }

    if(minCost > 0 && maxCost > 0) {
        if(ratingSet) {
            query += ` AND `;
        } else {
            query += ` WHERE `
        }

        query += `
        p.price >= ${minCost} AND p.price <= ${maxCost}`
    }

    if(!skip) {
        skip = 0;
    }

    query += `
    RETURN p, pos, COLLECT(n) as nations
    ORDER BY p.price desc
    SKIP ${skip}
    LIMIT 10`;

    console.log(query);
    try{
        let result: QueryResult = await session.run(query);

        if(result.records.length > 0) {
            const playersResult = result.records;
            const players:Player[] = playersResult.map(record => {
            const player = record.get('p').properties;
            console.log(player);
            const id = record.get(0).identity.low;
            const price = player.price.low;
            let rating = 1;
            if(player.rating)
            {
                rating = player.rating.low;
            }
            const position = record.get('pos').properties as Position;
            const nation = record.get('nations').map((nationNode:any) => nationNode.properties)[0] as Nation
            return {...player, price, rating, id, position, nation} as Player;
        });

        return new Response(JSON.stringify(players), {status:200});
        } else {
            return new Response(JSON.stringify([]), {status:200});
        }
    } catch (err) {
        return new Response(JSON.stringify({errorMessage:err}), {status:500});
    }
}
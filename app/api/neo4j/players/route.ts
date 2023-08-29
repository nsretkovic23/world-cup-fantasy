import { Player, User } from "@/lib/interfaces/db-data-Interfaces";
import { session } from "@/lib/databases/neo4j";

export async function POST(request: Request) {
    let player = await request.json() as Player;

    let matchQuery = `MATCH(n:Nation {name:"${player.nation.name}"}), (pos:Position {position:"${player.position?.position}"})`;
    let createPlayerQuery = `CREATE (p1:Player {name:"${player.name}", club:"${player.club}", price:${player.price}}),`;
    let playsForRelation = `(p1)-[:PLAYS_FOR]->(n),`;
    let hasPlayerRelation = `(n)-[:HAS_PLAYER]->(p1),`;
    let playsPositionRelation = `(p1)-[:PLAYS_POSITION]->(pos)`;

     try {
         await session.run(
            matchQuery 
            + createPlayerQuery
            + playsForRelation
            + hasPlayerRelation
            + playsPositionRelation
            );

        return new Response(JSON.stringify(player), {status:200});
     } catch(error: any) {        
         return new Response(JSON.stringify({errorMessage:error}), {status:400})
     }
}
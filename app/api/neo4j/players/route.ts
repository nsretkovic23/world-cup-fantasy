import { Player, User } from "@/lib/interfaces/db-data-Interfaces";
import { session } from "@/lib/databases/neo4j";
import { QueryResult } from "neo4j-driver";

export async function POST(request: Request) {
    let player = await request.json() as Player;

    let matchQuery = `MATCH(n:Nation {name:"${player.nation?.name}"}), (pos:Position {position:"${player.position?.position}"})`;
    let createPlayerQuery = `CREATE (p1:Player {name:"${player.name}", club:"${player.club}", price:${player.price}, rating:${player.rating}}),`;
    // Creating two-way relations with nation, position and rating
    let playsForRelation = `(p1)-[:PLAYS_FOR]->(n),`;
    let hasPlayerRelation = `(n)-[:HAS_PLAYER]->(p1),`;
    let playsPositionRelation = `(p1)-[:PLAYS_POSITION]->(pos),`;
    let positionPlayedByRelation = `(pos)-[:POSITION_PLAYED_BY]->(p1)`;

     try {
         await session.run(
            matchQuery 
            + createPlayerQuery
            + playsForRelation
            + hasPlayerRelation
            + playsPositionRelation
            + positionPlayedByRelation
            );

        return new Response(JSON.stringify(player), {status:200});
     } catch(error: any) {        
         return new Response(JSON.stringify({errorMessage:error}), {status:400})
     }
}

export async function PUT(request:Request) {
    // vodi racuna kad update-ujes playera, da mu proveris je l' mu se promenila pozicija od toga ce zavisi query
    let req = await request.json();
    const player:Player = req.player;
    const updatedPlayer:Player = req.updatedPlayer;

    let match = `match (p:Player) where ID(player)=${player.id}`;
    const attributes = `SET p.name = '${updatedPlayer.name}',
    p.club = '${updatedPlayer.club}',
    p.price = ${updatedPlayer.price},
    p.rating = ${updatedPlayer.rating}`;
    
    // Since position is separate node, if position is changed, two-way relations between player and position node need to be disconnected
    // And new relations should be created
    let isPositionChanged = player.position.position !== updatedPlayer.position.position;

    return new Response(JSON.stringify(req), {status:200});
}
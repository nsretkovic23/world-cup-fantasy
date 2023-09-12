import { Player, Position, User } from "@/lib/interfaces/db-data-Interfaces";
import { session } from "@/lib/databases/neo4j";
import { QueryResult, Record } from "neo4j-driver";
import { NextRequest } from "next/server";

export async function DELETE(request:NextRequest) {
    let id = request.nextUrl.searchParams.get("id");

    let deleteQuery = `MATCH (p:Player where ID(p)=${id}) detach delete p`;
    try {
       await session.run(deleteQuery);
       return new Response(JSON.stringify({message:`Deleted player`}), {status:200});
    } catch(error: any) {        
        return new Response(JSON.stringify({errorMessage:error}), {status:400})
    }
}

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
    let req = await request.json();
    const player:Player = req.player;
    const updatedPlayer:Player = req.updatedPlayer;

    // TODO: Consider searching through nation
    let match = `match 
    (p:Player where ID(p)=${player.id})-[player_pos:PLAYS_POSITION]->(pos:Position), 
    (pos)-[pos_player:POSITION_PLAYED_BY]->(p), 
    (newPosition:Position {position:"${updatedPlayer.position.position}"})
    SET p.name = '${updatedPlayer.name}',
    p.club = '${updatedPlayer.club}',
    p.price = ${updatedPlayer.price},
    p.rating = ${updatedPlayer.rating}`;
    
    // Since position is separate node, if position is changed, two-way relations between player and position node need to be disconnected
    // And new relations should be created
    let isPositionChanged = player.position.position !== updatedPlayer.position.position;
    // console.log("Promenjena pozicija?" + isPositionChanged);
    if(isPositionChanged) {
        match += ` delete player_pos, pos_player 
        create (p)-[:PLAYS_POSITION]->(newPosition), 
        (newPosition)-[:POSITION_PLAYED_BY]->(p)`;
    }
    
    const returnData = " return p, newPosition";

    try
    {
        let result:QueryResult = await session.run(
            match + returnData
        )
            
        if(result.records.length > 0) {
            const record = result.records[0];
            const returnedUpdatedPlayer = record.get('p').properties;
            const id = record.get(0).identity.low;
            const price = returnedUpdatedPlayer.price.low;
            let rating = 0;
            if(returnedUpdatedPlayer.rating) {
                rating = returnedUpdatedPlayer.rating.low;
            }
            const position = record.get('newPosition').properties as Position;
            console.log(position);
            let p = {...returnedUpdatedPlayer, price, rating, id, position} as Player;
            return new Response(JSON.stringify(p), {status:200});
        }

    } catch(err) {
            return new Response(JSON.stringify({errorMessage:err}), {status:400});
    }
}
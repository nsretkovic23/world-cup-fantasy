import { redis } from "@/lib/databases/redis";
import { Nation } from "@/lib/interfaces/db-data-Interfaces";

// Getting all nations from cache
export async function GET(request:Request) {
    let result = await redis.hgetall(`nations`);

    if(JSON.stringify(result) === '{}') {
        return new Response(JSON.stringify([]), {status:404});
    }

    const nations = Object.values(result).map((nation) => JSON.parse(nation)) as Nation[];
    return new Response(JSON.stringify(nations), {status:200});
}

// Caching all nations with neo4j values
export async function POST(request:Request) {
    const neo4jResponse = await fetch(`http://localhost:3000/api/neo4j/nations/`);
    const neo4jNations = await neo4jResponse.json() as Nation[];

    await redis.del('nations');

    let nationObjects:any = {}; 
    neo4jNations.forEach((nation) => {
        nationObjects[nation.nationIdentifier] = JSON.stringify(nation);
    })

    const redisResponse = await redis.hset('nations', nationObjects);
    return new Response(JSON.stringify({message:redisResponse}), {status:200});
}

export async function DELETE(request:Request) {
    const response = await redis.del('nations'); 
    return new Response(JSON.stringify({message:response}), {status:200});
}
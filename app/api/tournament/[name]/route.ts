import { redis } from "@/lib/databases/redis";

// Getting tournament by name
export async function GET(request:Request, {params}:{params:any}) {
    let result = await redis.hgetall(`${params.name}`);

    if(JSON.stringify(result) === '{}') {
        return new Response(JSON.stringify({errorMessage:`Tournament with name ${params.name} doesn't exist` }), {status:404});
    }

    return new Response(JSON.stringify(result), {status:200});
}
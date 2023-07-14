import { Nation } from "@/lib/interfaces/db-data-Interfaces";
import { session } from "@/lib/databases/neo4j";
import { NextApiRequest } from "next";
import { QueryResult } from "neo4j-driver";

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
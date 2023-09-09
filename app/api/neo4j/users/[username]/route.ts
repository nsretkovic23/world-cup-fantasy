import { User, Player } from '@/lib/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import { NextApiRequest } from 'next';
import {session} from '@/lib/databases/neo4j';
import { userTeamQuery } from '@/lib/queries';
import { createUserObjectFromRecords } from '../(helpers)/helpers';

// Getting a user by username
export async function GET(request: NextApiRequest, { params }:{params:any}) {
    try {
        let result: QueryResult = await session.run(`
        MATCH (u:User {username:"${params.username}"}) `+ userTeamQuery);

        if(result.records.length > 0) {
          const user = createUserObjectFromRecords(result);
          return new Response(JSON.stringify(user), {status:200});
        } else {
          return new Response(JSON.stringify({errorMessage:"Username doesn't exist"}), {status:404});
        }
    } catch(error) {
        return new Response(JSON.stringify({errorMessage:error}), {status:500});
    }
}
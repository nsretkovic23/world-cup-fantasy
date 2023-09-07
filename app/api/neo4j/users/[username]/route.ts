import { User, Team } from '@/lib/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import { NextApiRequest } from 'next';
import {session} from '@/lib/databases/neo4j';
import { userTeamQuery } from '@/lib/queries';
import { createTeam } from '../(helpers)/helpers';

// Getting a user by username
export async function GET(request: NextApiRequest, { params }:{params:any}) {
    try {
        let result: QueryResult = await session.run(`
        MATCH (u:User {username:"${params.username}"}), `+ userTeamQuery);

        if(result.records.length > 0) {
          const usersResult = result.records[0]
          const singleUserResult = usersResult.get(0);
          // Get user
          const user = singleUserResult.properties as User;
          // Get user's neo4j id
          const id = singleUserResult.identity.low;
          // Create team object from user's selected players
          const team = createTeam(result.records) satisfies Team;
          
          return new Response(JSON.stringify({...user, id, team} satisfies User), {status:200});
        } else {
          return new Response(JSON.stringify({errorMessage:"Username doesn't exist"}), {status:404});
        }
    } catch(error) {
        return new Response(JSON.stringify({errorMessage:error}), {status:500});
    }
}
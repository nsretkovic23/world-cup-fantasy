import { User } from '@/lib/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import {session} from '@/lib/databases/neo4j';
import { userTeamQuery } from '@/lib/queries';
import { createTeam } from '../(helpers)/helpers';

// Receive user's username and password from body and try to find a user in a database that matches these credentials
// POST is used to send user through request body
export async function POST(request: Request) {
    let reqBody = await request.json();

    if(!reqBody.username || !reqBody.password) {
        return new Response(JSON.stringify({errorMessage:"No username or password provided"}));
    }
    
    try {
        let result: QueryResult = await session.run(`
        MATCH 
        (u:User {username:"${reqBody.username}", password:"${reqBody.password}"}),` 
        + userTeamQuery);

        if(result.records.length > 0) {
          const usersResult = result.records[0]
          const singleUserResult = usersResult.get(0);
          // Get user
          const user = singleUserResult.properties as User;
          // Get user's neo4j id
          const id = singleUserResult.identity.low
          // Create team object from user's selected players
          const team = createTeam(result.records);

          return new Response(JSON.stringify({...user, id, team} satisfies User), {status:200});
        } else {
          return new Response(JSON.stringify({errorMessage:"Wrong credentials"}), {status:404});
        }
    } catch(error) {
        return new Response(JSON.stringify({errorMessage:error}), {status:500});
    }
}
import { User } from '@/libs/interfaces/db-data-Interfaces';
import { QueryResult } from 'neo4j-driver'
import {session} from '@/libs/databases/neo4j';

// Receive user's username and password from body and try to find a user in a database that matches these credentials
export async function POST(request: Request) {
    let reqBody = await request.json();

    if(!reqBody.username || !reqBody.password) {
        return new Response(JSON.stringify({errorMessage:"No username or password provided"}));
    }
    
    try {
        let result: QueryResult = await session.run("MATCH (u:User {username: $username, password:$password}) RETURN u, id(u) AS userId", { username: reqBody.username, password: reqBody.password });

        if(result.records.length > 0) {
          // There is already a constraint that username is unique, but still, take the first element
          const usersResult = result.records[0]
          const singleUserResult = usersResult.get(0);
          // Get user
          const user = singleUserResult.properties as User;
          // Get user's neo4j id
          const id = singleUserResult.identity.low
          
          return new Response(JSON.stringify({...user, id} satisfies User), {status:200});
        } else {
          return new Response(JSON.stringify({errorMessage:"Wrong credentials"}), {status:404});
        }
    } catch(error) {
        return new Response(JSON.stringify({errorMessage:"Server error - check if database is running"}), {status:500});
    }
}
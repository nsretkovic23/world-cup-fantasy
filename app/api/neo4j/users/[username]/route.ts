import { User } from '@/libs/interfaces';
import { QueryResult } from 'neo4j-driver'
import { NextApiRequest, NextApiResponse } from 'next';
import {session} from '@/utils/neo4j';


export async function GET(request: NextApiRequest, { params }:{params:any}) {
    try {
        let result: QueryResult = await session.run("MATCH (u:User {username: $username}) RETURN u, id(u) AS userId", { username: params.username });

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
          return new Response(JSON.stringify({errorMessage:"Username doesn't exist"}), {status:404});
        }
    } catch(error) {
        return new Response(JSON.stringify({errorMessage:"Not found"}), {status:500});
    }
}
import { User } from "@/libs/interfaces";
import { session } from "@/utils/neo4j";

// Creating a User (Sign Up)
export async function POST(request: Request) {
    let user = await request.json() as User;
    try {
        // TODO: Handle when user creates a team
        await session.run('CREATE (u:User {username: $username, password: $password})', { username: user.username, password: user.password });
        return new Response(JSON.stringify(user), {status:200});

    } catch(error) {
        return new Response(JSON.stringify({meessage:"Error creating a new user"}), {status:500})
    }
}
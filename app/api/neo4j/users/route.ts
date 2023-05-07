import { User } from "@/libs/interfaces";
import { session } from "@/utils/neo4j";

// Constraint for unique username: CREATE CONSTRAINT FOR (u:User) REQUIRE u.username IS UNIQUE
// Creating a User (Sign Up)
export async function POST(request: Request) {
    let user = await request.json() as User;
    try {
        // TODO: Handle when user creates a team
        await session.run('CREATE (u:User {username: $username, password: $password})', { username: user.username, password: user.password });
        return new Response(JSON.stringify(user), {status:200});
    } catch(error: any) {
        let errorMessage = error.code;
        // Return specific message only when constraint validation fails which means that user attempted sign up with username that already exists
        // For everything else, just return error code
        if(error?.code.includes("ConstraintValidationFailed")) {
            errorMessage = "Error: Username already taken";
        }
        return new Response(JSON.stringify({errorMessage:errorMessage}), {status:400})
    }
}
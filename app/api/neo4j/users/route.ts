import { Player, User } from "@/lib/interfaces/db-data-Interfaces";
import { session } from "@/lib/databases/neo4j";
import { QueryResult } from "neo4j-driver";
import { userTeamQuery } from "@/lib/queries";
import { createUserObjectFromRecords } from "./(helpers)/helpers";

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

export async function PUT(request: Request) {
    let body = await request.json();
    const userBody = body.user as User;
    const playerBody = body.player as Player;
    const updateType = body.updateType as string;

    console.log(updateType);
  
    if(updateType === "addPlayer") {
        const [message, status] = await addPlayerToTheTeam(userBody, playerBody);
        return new Response(JSON.stringify(message), status);
    } else if(updateType === "removePlayer") {
        const [message, status] = await removePlayerFromTeam(userBody, playerBody);
        return new Response(JSON.stringify(message), status);
    }

    return new Response(JSON.stringify({errorMessage:"Update type not supported"}), {status:400});
}

async function removePlayerFromTeam(userBody:User, playerBody:Player) {
    try {
        await session.run(`
        MATCH 
        (u:User {username:"${userBody.username}", password:"${userBody.password}"}),
        (p:Player where ID(p)=${playerBody.id}),
        (u) - [chosen:CHOSE_${getPositionIdentifier(playerBody.position.position)}] -> (p)
        DELETE chosen
        `);

        return [{success:"Player removed from the team successfully"}, {status:200}]
    } catch (error) {
        return [{errorMessage:"Deleting player from the team failed: " + error}, {status:400}]
    }
}
  
async function addPlayerToTheTeam(userBody:User, playerBody:Player) {
    try {
        let result: QueryResult = await session.run(`
        MATCH 
        (u:User {username:"${userBody.username}", password:"${userBody.password}"}) ` 
        + userTeamQuery);
    
        if(result.records.length <= 0) {
          return [{errorMessage:"User Not Found"}, {status:404}];
        }
  
        // Server side validation if player can be added to user's team 
        // First getting a user
        const user = createUserObjectFromRecords(result);
        const [canAdd, positionIdentifier] = canAddPlayerToUsersTeam(user, playerBody);  
        
        if(!canAdd)
        {
            return [{errorMessage:"Can not add player to the team, all players are added for position: "+playerBody.position.position}, {status:400}]
        }
  
        // Updating the player by creating a new relation CHOSE_(POSITION) from user towards the player
        let query = `MATCH
        (u:User where ID(u)=${user.id}),
        (p:Player where ID(p)=${playerBody.id})
        CREATE (u)-[:CHOSE_${positionIdentifier}] -> (p)`
    
        await session.run(query)
    
        return [{success:"Successfully added player to the user's team"}, {status:200}];
    
      } catch(error) {
        return [{errorMessage:error}, {status:500}]
      }
} 


function canAddPlayerToUsersTeam(user:User, player:Player):[boolean, string] {
    if(player.position.position === "Goalkeeper" && user.team.goalkeeper.length === 0)
      return [true, "GK"];

    if(player.position.position === "Defender" && user.team.defenders.length < 4)
      return [true, "DEF"];

    if(player.position.position === "Midfielder" && user.team.midfielders.length < 4)
      return [true, "MID"];

    if(player.position.position === "Striker" && user.team.strikers.length < 2)
      return [true, "ST"];

    return [false, ""];
}

function getPositionIdentifier(position:string) {
    switch(position) {
        case "Goalkeeper":
            return "GK";
        case "Defender":
            return "DEF";
        case "Midfielder":
            return "MID";
        case "Striker":
            return "ST";
    }
}

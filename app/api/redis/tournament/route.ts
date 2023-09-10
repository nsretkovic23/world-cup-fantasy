import { redis } from "@/lib/databases/redis"
import { Tournament } from "@/lib/interfaces/db-data-Interfaces";

// Create a tournament
export async function POST(request:Request) {
    const tournament = await request.json() as Tournament;

    const validatedTournament = {
        ...tournament,
        name:tournament.name.replace(/\s/g, '').trim()
    } satisfies Tournament;

    let result = await redis.hset(validatedTournament.name, validatedTournament);
    
    if(validatedTournament.ttl !== -1) {
        await redis.expire(validatedTournament.name, validatedTournament.ttl);
    }

    if(result === 0) {
        return new Response(JSON.stringify({errorMessage:"Tournament with this name already exists!"}), {status:400});
    }

    await redis.publish('TournamentCreated', JSON.stringify({name:validatedTournament.name, ttl:validatedTournament.ttl}));
    return new Response(JSON.stringify({message:`Tournament created ${validatedTournament.name}`}), {status:200});
}

export async function GET(request:Request) {

}

// Commands:
// set  key value - set test nikola -> vraca OK
// get key - get test -> vraca string "nikola"
// del key - del test - vraca 1 (kapiram 1 stvar obrisana)
// sada -> get test -> vraca nil 
// exists key - exists test -> vraca (integer) 1, ako nema vraca (integer) 0
// keys * - vraca listu svih key-eva, kao string: "test", "test22", "asdasd"
// flushall - clear entire cache
// ttl key - ttl test -> vraca time to live, ako nema setovan, -1
// expire key - expire test 10 -> exipire-uje za  10 sekundi (vraca (integer) 1)
// ttl key - ttl test -> vraca -2 ako ga key nema vise (isteko i izbrisan je iz baze)
// Sve sto se cuva, cuva se kao string, cak i brojevi! 

// LISTA:::
// lpush key value - lpush friends john (uspesno - vraca (integer) 1)
// lrange key startIndex stopIndex - lrange friends 0 -1 -> dobijanje svih itema
// lpush dodaje na pocetak niza, rpush dodaje na kraju niza
// lpop / rpop izbacivanje iz liste

// SETOVI ::: lista, sa unique elementima
// sadd key val - sadd hobbies "weight lifting" - ako imas vise od 1 reci wrapujes u quotes
// smembers key - printa sve iz seta
// Ako uneses istu vrednost da dodas, vrati ti (integer) 0 jer se takva vrednost vec nalazi u setu
// srem key value - brisanje iz seta

// HASH - kao json objekat, 
// samo mozes da imas 1 nivo nestovanja { asd:"test"}, 
// ali ne moze: {asd:{tt:"test"}}

// hset person name kyle
// hget person name -> vraca "kyle"
// hgetall -> vraca key value key value key value
// hset person age 26 -> ovde u sustini dodaje novi property person-u age
// hdel person age -> brise property age
// hexists person name -> da li property postoji (integer) 1 ako da, (integer) 0 ako ne


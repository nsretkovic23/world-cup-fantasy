// Env variables mock

export const NEO4J_URI="neo4j+s://ee4185ba.databases.neo4j.io";
export const NEO4J_USERNAME= "neo4j";
export const NEO4J_PASSWORD= "r0dxumLZtab42nJpBs6s0up8mnbqa8Q6HfN1z-AT4ds";
// Redis is with two s because encrypted trafic is enabled

// TODO: THIS IS A URL OF A BACKUP DB TO NOT WASTE A DAILY LIMIT ON MAIN DB WHILE TESTING, REVERT!!!
export const REDIS_URL = "rediss://default:7a7c628de3224ca8b7e4b731299a1db4@eu1-trusting-finch-40040.upstash.io:40040";

//export const REDIS_URL = "rediss://default:bfa39a5c4bc74218bb3ef35016ec4e58@eu1-good-sunbeam-39855.upstash.io:39855";
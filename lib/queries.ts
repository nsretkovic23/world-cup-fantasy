// Gets every player that user selected for its team
export const userTeamQuery = `
(u)-[:CHOSE_ST]->(st:Player),
(u)-[:CHOSE_MID]->(mid:Player),
(u)-[:CHOSE_DEF]->(def:Player),
(u)-[:CHOSE_GK]->(gk:Player)
OPTIONAL MATCH (st)-[:PLAYS_FOR]->(strikerNation:Nation)
OPTIONAL MATCH (st)-[:PLAYS_POSITION]->(strikerPosition:Position)
OPTIONAL MATCH (mid)-[:PLAYS_FOR]->(midNation:Nation)
OPTIONAL MATCH (mid)-[:PLAYS_POSITION]->(midPosition:Position)
OPTIONAL MATCH (def)-[:PLAYS_FOR]->(defNation:Nation)
OPTIONAL MATCH (def)-[:PLAYS_POSITION]->(defPosition:Position)
OPTIONAL MATCH (gk)-[:PLAYS_FOR]->(gkNation:Nation)
OPTIONAL MATCH (gk)-[:PLAYS_POSITION]->(gkPosition:Position)
RETURN u, id(u) AS userId, st, mid, def, gk, 
strikerNation, strikerPosition,
midNation, midPosition,
defNation, defPosition,
gkNation, gkPosition`;
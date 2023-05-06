import neo4j, { QueryResult, Session } from 'neo4j-driver'

// TODO: Read strings from environment variables, for now it's not that important
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "nikola12"))
export const session: Session = driver.session()
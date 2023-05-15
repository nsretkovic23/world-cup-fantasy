import neo4j, { QueryResult, Session } from 'neo4j-driver'
import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME } from '../env'

// TODO: Read strings from environment variables, for now it's not that important
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD))
export const session: Session = driver.session()
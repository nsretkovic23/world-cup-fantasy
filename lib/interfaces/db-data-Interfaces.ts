export interface User {
    id?:string,
    username:string,
    password:string,
    email?:string,
    team?: UsersTeam
}

export interface Player {
    name:string,
    nation:Nation
    club:string,
    rating:Rating,
    position: Position,
    stats:Stats
}

export interface Stats {
    pace:number,
    shooting:number,
    passing:number,
    defending:number
}

export interface Position {
    position : string
}

export interface Rating {
    overall: number,
    pace: number,
    shooting: number,
    passing: number,
    defending: number
}

export interface Nation {
    name:string,
    nationIdentifier:string,
    players?:Player[]
}

export interface UsersTeam {
    name:string,
    players:Player[]
}
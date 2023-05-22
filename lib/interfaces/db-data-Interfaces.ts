export interface User {
    id?:string,
    username:string,
    password:string,
    email?:string,
    team?: UsersTeam
}

export interface Player {
    name:string,
    nation:string,
    nationIdentifier:string,
    club:string,
    rating:Rating,
    position: Position
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

export interface NationalTeam {
    name:string,
    players:Player[]
}

export interface UsersTeam {
    name:string,
    players:Player[]
}
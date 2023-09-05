export interface User {
    id?:number,
    username:string,
    password:string,
    email?:string,
    team?: UsersTeam
}

export interface Player {
    id:number,
    name:string,
    nation:Nation,
    price:number,
    club:string,
    rating:number,
    position: Position,
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
    name?:string,
    goalKeeper:Player,
    defenders:Player[],
    midfielders:Player[],
    attackers:Player[]
}
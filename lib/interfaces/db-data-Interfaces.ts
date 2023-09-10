export interface User {
    id:number,
    username:string,
    password:string,
    team: Team
}

export interface Team {
    goalkeeper:Player[],
    defenders:Player[],
    midfielders:Player[],
    strikers:Player[]
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

export interface Tournament {
    name: string,
    quarterfinals:string,
    semifinals:string,
    final:string,
    ttl:number,
    difficulty:number
}
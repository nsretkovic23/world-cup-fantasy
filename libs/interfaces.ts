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
    club:string,
    rating:number,
}

export interface NationalTeam {
    name:string,
    players:Player[]
}

export interface UsersTeam {
    name:string,
    players:Player[]
}
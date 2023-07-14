import Image from "next/image";
import React from "react";
import PlayerCard from "./player-card";
import { Nation, Player, Position, Rating, Stats, User, UsersTeam } from "@/lib/interfaces/db-data-Interfaces";
import { Deferred } from "next/dist/server/image-optimizer";

// Ovde treba voditi racuna o timu korisnika
// onPlayerCardClicked invoke-uje ili view player ili add player komponentu na pocetnooj strani
// onPlayerRemoved treba da zove uklanjanje igraca iz korisnikovog tima
// Svaki igrac ce (verovatno) imati relaciju "igra-za" neki tim, i onda cemo verovatno to da sklonimo?
// Nema smisla menjati sam user objekat jer je graf baza i funkcionise relacijama, ali trebamo promeniti na frontu svakako
// Verovatno ce ici:

const positions = [
  {position:"Goalkeeper"} satisfies Position,
  {position:"Defender"} satisfies Position,
  {position:"Midfielder"} satisfies Position,
  {position:"Striker"} satisfies Position,
]

const messiRating = {
  overall: 95,
  pace: 90,
  shooting: 92,
  passing: 91,
  defending: 40 
} satisfies Rating;

const messiNation = {
name: "Argentina",
nationIdentifier: "AR"
} satisfies Nation

const messiStats = {
  pace: 92,
  shooting: 96,
  passing: 95,
  defending: 54
} satisfies Stats

const golman :Player = {
  
  name: "Lionel Messi",
  nation: messiNation,
  club: "PSG2",
  rating: messiRating,
  position: positions[0],
} satisfies Player

const odbramb :Player = {
  name: "Lionel Messi",
  nation: messiNation,
  club: "PSG2",
  rating: messiRating,
  position: positions[1],
} satisfies Player

const odbramb2 :Player = {
  name: "Lionel Messi",
  nation: messiNation,
  club: "PSG2",
  rating: messiRating,
  position: positions[1],
} satisfies Player

const korisnik:User = 
{
  username: 'test',
  password: 'test123',
  team: {
    name: 'barsa',
    goalKeeper: golman,
    defenders: [odbramb, odbramb2],
    midfielders: [],
    attackers: []
  } satisfies UsersTeam
}



function FootballPitch({onPlayerCardClicked}:{onPlayerCardClicked:any}) {

  const removePlayer = (player:Player) => {
    // TODO: Obrisi ovo kad iz interfejsa sklonis ?
    if(!korisnik.team) return;

    if(player.position.position === "Defender")
    {
      const modifiedArray:Player[] = korisnik.team.defenders.map(defender => defender satisfies Player);
      const ind = modifiedArray.indexOf(player);
      modifiedArray.splice(ind, 1);

      korisnik.team.defenders = modifiedArray;
    }
  }

  return (
    <div className={"pitch"}>
      <div>
        <PlayerCard player={korisnik.team?.goalKeeper ? korisnik.team?.goalKeeper : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
      </div>
      <div>
        <PlayerCard player={korisnik.team?.defenders[0] ? korisnik.team.defenders[0] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
        <PlayerCard player={korisnik.team?.defenders[1] ? korisnik.team.defenders[1] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
        <PlayerCard player={korisnik.team?.defenders[2] ? korisnik.team.defenders[2] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
        <PlayerCard player={korisnik.team?.defenders[3] ? korisnik.team.defenders[3] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
      </div>
      <div>
        <PlayerCard player={players[0] ? players[0] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
        <PlayerCard player={players[0] ? players[0] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
        <PlayerCard player={players[0] ? players[0] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
        <PlayerCard player={players[0] ? players[0] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
      </div> 
      <div>
        <PlayerCard player={players[0] ? players[0] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
        <PlayerCard player={players[0] ? players[0] : null} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={removePlayer}/>
      </div>
    </div>
  );
}

export default FootballPitch;

const players = [
{
  name: "Lionel Messi",
  nation: messiNation,
  club: "PSG",
  rating: messiRating,
  position: positions[3],
} satisfies Player,
undefined
];


import Image from "next/image";
import React from "react";
import PlayerCard from "../player-card/player-card";
import { Player, Position, Rating } from "@/lib/interfaces/db-data-Interfaces";

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

const players = [
  {
    name: "Lionel Messi",
    nation: "Argentina",
    nationIdentifier: "AR",
    club: "PSG",
    rating: messiRating,
    position: positions[3],
  } satisfies Player
];

function FootballPitch() {
  return (
    <div className={"pitch"}>
      <div>
        <PlayerCard player={players[0]} />
      </div>
      <div>
        <PlayerCard player={players[0]} />
        <PlayerCard player={players[0]} />
        <PlayerCard player={players[0]} />
        <PlayerCard player={players[0]} />
      </div>
      <div>
        <PlayerCard player={players[0]} />
        <PlayerCard player={players[0]} />
        <PlayerCard player={players[0]} />
        <PlayerCard player={players[0]} />
      </div>
      <div>
        <PlayerCard player={players[0]} />
        <PlayerCard player={players[0]} />
      </div>
    </div>
  );
}

export default FootballPitch;

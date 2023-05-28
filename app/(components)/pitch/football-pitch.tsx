import Image from "next/image";
import React from "react";
import PlayerCard from "./player-card";
import { Nation, Player, Position, Rating, Stats } from "@/lib/interfaces/db-data-Interfaces";

function FootballPitch({onPlayerCardClicked}:{onPlayerCardClicked:any}) {
  return (
    <div className={"pitch"}>
      <div>
        <PlayerCard player={null} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
      </div>
      <div>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
      </div>
      <div>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
      </div>
      <div>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
        <PlayerCard player={players[0]} onPlayerCardClicked={onPlayerCardClicked} onAddPlayerClicked={null}/>
      </div>
    </div>
  );
}

export default FootballPitch;

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

const players = [
{
  name: "Lionel Messi",
  nation: messiNation,
  club: "PSG",
  rating: messiRating,
  position: positions[3],
  stats: messiStats
} satisfies Player
];


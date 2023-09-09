import React, { useEffect } from "react";
import PlayerCard from "./player-card";
import { Player, Position, Team } from "@/lib/interfaces/db-data-Interfaces";

const positions = [
  {position:"Goalkeeper"} satisfies Position,
  {position:"Defender"} satisfies Position,
  {position:"Midfielder"} satisfies Position,
  {position:"Striker"} satisfies Position,
]

function FootballPitch({team, onPlayerCardClicked, onPlayerRemoved}:{team:Team, onPlayerCardClicked:any, onPlayerRemoved:any}) {

  return (
    <div className={"pitch"}>
      <div>
        <PlayerCard player={team.goalkeeper[0] ? team?.goalkeeper[0] : null} position={positions[0].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
      </div>
      <div>
        <PlayerCard player={team.defenders[0] ? team.defenders[0] : null} position={positions[1].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
        <PlayerCard player={team.defenders[1] ? team.defenders[1] : null} position={positions[1].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
        <PlayerCard player={team.defenders[2] ? team.defenders[2] : null} position={positions[1].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
        <PlayerCard player={team.defenders[3] ? team.defenders[3] : null} position={positions[1].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
      </div>
      <div>
        <PlayerCard player={team.midfielders[0] ? team.midfielders[0] : null} position={positions[2].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
        <PlayerCard player={team.midfielders[1] ? team.midfielders[1] : null} position={positions[2].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
        <PlayerCard player={team.midfielders[2] ? team.midfielders[2] : null} position={positions[2].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
        <PlayerCard player={team.midfielders[3] ? team.midfielders[3] : null} position={positions[2].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
      </div> 
      <div>
        <PlayerCard player={team.strikers[0] ? team.strikers[0] : null} position={positions[3].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
        <PlayerCard player={team.strikers[1] ? team.strikers[1] : null} position={positions[3].position} onPlayerCardClicked={onPlayerCardClicked} onPlayerRemoved={onPlayerRemoved}/>
      </div>
    </div>
  );
}

export default FootballPitch;
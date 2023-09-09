import React from "react";
import Image from "next/image";
import { Player } from "../../../lib/interfaces/db-data-Interfaces";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function PlayerCard({ player, position, onPlayerCardClicked, onPlayerRemoved }: { player: Player|null, position:string, onPlayerCardClicked:any, onPlayerRemoved:any }) {
  
  if(!player) {
    return (
      <div onClick={() => onPlayerCardClicked(null, position)} className="flex-and-grow flex-all-centered player-card">
          Add Player
      </div>
    );
  }
  
  const flagSrc = "https://flagsapi.com/" + player.nation.nationIdentifier + "/shiny/64.png";
  
  return (
    <div onClick={() => onPlayerCardClicked(player, "")} className="flex-and-grow flex-all-centered player-card">
      <DeleteForeverIcon  onClick={() => onPlayerRemoved(player)} sx={{position:"absolute", left:"157px", top:"-12px", color:"orange"}}></DeleteForeverIcon>
      <div className="flex-and-grow flex-all-centered player-name player-name-container">
        {player.name}
      </div>
      <div className="flex-and-grow player-rating-container">
        <div className="flex-and-grow flex-all-centered overall-rating">
          <div>Rating<br/>{player.rating}</div>
        </div>
      </div>
      <div className="flex-and-grow flex-all-centered player-flag-club-container">
        <div className="player-club">{player.club}</div>
        <Image
          src={flagSrc}
          alt={"Nation Flag"}
          width={35}
          height={35}
          priority
        />
      </div>
    </div>
  );
}

export default PlayerCard;

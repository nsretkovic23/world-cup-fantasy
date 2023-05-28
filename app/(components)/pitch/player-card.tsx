import React from "react";
import Image from "next/image";
import { Player } from "../../../lib/interfaces/db-data-Interfaces";

function PlayerCard({ player, onPlayerCardClicked, onAddPlayerClicked }: { player: Player|null, onPlayerCardClicked:any, onAddPlayerClicked:any|null }) {
  
  if(!player) {
    return (
      <div onClick={() => onPlayerCardClicked(null)} className="flex-and-grow flex-all-centered player-card">
          Add Player
      </div>
    );
  }
  
  const flagSrc = "https://flagsapi.com/" + player.nation.nationIdentifier + "/shiny/64.png";
  
  return (
    <div onClick={() => onPlayerCardClicked(player)} className="flex-and-grow flex-all-centered player-card">
      <div className="flex-and-grow flex-all-centered player-name player-name-container">
        {player.name}
      </div>
      <div className="flex-and-grow player-rating-container">
        <div className="flex-and-grow flex-all-centered overall-rating">
          <div>Rating<br/>{player.rating.overall}</div>
        </div>
      </div>
      <div className="flex-and-grow flex-all-centered player-flag-club-container">
        <div className="player-club">{player.club}</div>
        <Image
          src={flagSrc}
          alt={player.nation.name}
          width={35}
          height={35}
          priority
        />
      </div>
    </div>
  );
}

export default PlayerCard;

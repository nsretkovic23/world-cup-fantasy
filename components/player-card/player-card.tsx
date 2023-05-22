import React from "react";
import Image from "next/image";
import { Player } from "../../lib/interfaces/db-data-Interfaces";

function PlayerCard({ player }: { player: Player }) {
  const flagSrc =
    "https://flagsapi.com/" + player.nationIdentifier + "/shiny/64.png";
  return (
    <div className="flex-and-grow flex-all-centered player-card">
      <div className="flex-and-grow flex-all-centered player-name player-name-container">
        {player.name}
      </div>
      <div className="flex-and-grow player-rating-container">
        <div className="flex-and-grow flex-all-centered overall-rating">
            <div>Overall:{player.rating.overall}</div>
        </div>
            <div className="flex-and-grow flex-all-centered other-ratings">
                <div className="flex-and-grow other-ratings-row-container">
                    <div>Pac:{player.rating.pace}</div>
                    <div>Sho:{player.rating.shooting}</div>
                </div>
                <div className="flex-and-grow other-ratings-row-container">
                    <div>Pas:{player.rating.passing}</div>
                    <div>Def:{player.rating.defending}</div>
                </div>
        </div>
      </div>
      <div className="flex-and-grow flex-all-centered player-flag-club-container">
        <div className="player-club">{player.club}</div>
        <Image
          src={flagSrc}
          alt={player.nation}
          width={35}
          height={35}
          priority
        />
      </div>
    </div>
  );
}

export default PlayerCard;

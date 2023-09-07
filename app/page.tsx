"use client";
import { useEffect, useContext, useState } from "react";
import { UserContext, UserContextType } from "@/context/user-context";
import useTryLocalStorageAuthentication from "../hooks/use-try-localStorage-Authentication";
import FootballPitch from "@/app/(components)/pitch/football-pitch";
import ViewPlayer from "./(components)/sidebars/view-player";
import { Player, Team } from "@/lib/interfaces/db-data-Interfaces";
import SearchPlayers from "./(components)/sidebars/search-players";
import PlayerSearchFilterProvider from "@/context/player-search-filter-context";

export default function Home() {
  const { user, loginUser } = useContext(UserContext) as UserContextType;
  const fetchedUser = useTryLocalStorageAuthentication(true);
  const [selectedPlayerForView, setSelectedPlayerForView] =
    useState<Player | null>(null);
  const [addPlayerFormActive, setAddPlayerFormActive] =
    useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("Goalkeeper");


  function onPlayerCardClickedHandler(player: Player | null, positionName:string) {
    setAddPlayerFormActive(player === null);
    setSelectedPlayerForView(player);
    if(positionName !== "") {
      setSelectedPosition(positionName);
    }
  }

  function onPlayerAdded(player:Player) {
    if(!user || !user.team) return;
    switch(player.position.position) {
      case 'Goalkeeper':
        addPlayerToTheTeam(player, user.team.goalkeeper, 1);
        break;
      case 'Defender':
        addPlayerToTheTeam(player, user.team.defenders, 4);
        break;
      case 'Midfielder':
        addPlayerToTheTeam(player, user.team.midfielders, 4);
        break;
      case 'Striker':
        addPlayerToTheTeam(player, user.team.strikers, 2);
        break;
    }
  }

  function addPlayerToTheTeam(player:Player, position:Player[], max:number) {
    if(position.length < max) {
      position.push(player);
    }
  }

  useEffect(() => {
    if (!user) {
      if (fetchedUser) loginUser(fetchedUser);
    }
    else {
      console.log(user);
    }
  }, [fetchedUser, user, loginUser]);

  if (!user) {
    return null; 
  }

  return (
    <main className={"main"}>
      <FootballPitch team={user.team} onPlayerCardClicked={onPlayerCardClickedHandler} />
      {selectedPlayerForView ? (
        <ViewPlayer player={selectedPlayerForView} />
      ) : addPlayerFormActive ? (
        <PlayerSearchFilterProvider>
          <SearchPlayers position={selectedPosition} onPlayerAdded={onPlayerAdded}/>
        </PlayerSearchFilterProvider>
      ) : null}
    </main>
  );
}

// <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />

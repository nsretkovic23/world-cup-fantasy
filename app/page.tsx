"use client";
import { useEffect, useContext, useState } from "react";
import { UserContext, UserContextType } from "@/context/user-context";
import useTryLocalStorageAuthentication from "../hooks/use-try-localStorage-Authentication";
import FootballPitch from "@/app/(components)/pitch/football-pitch";
import ViewPlayer from "./(components)/sidebars/view-player";
import { Player, Team } from "@/lib/interfaces/db-data-Interfaces";
import SearchPlayers from "./(components)/sidebars/search-players";
import PlayerSearchFilterProvider from "@/context/player-search-filter-context";

const emptyTeam : Team = {
  goalkeeper : [],
  midfielders: [],
  defenders : [],
  strikers : []
}

export default function Home() {
  const { user, loginUser } = useContext(UserContext) as UserContextType;
  const fetchedUser = useTryLocalStorageAuthentication(true);
  const [selectedPlayerForView, setSelectedPlayerForView] =
    useState<Player | null>(null);
  const [addPlayerFormActive, setAddPlayerFormActive] =
    useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<string>("Goalkeeper");
  const [usersTeam, setUsersTeam] = useState<Team>(emptyTeam);

  function onPlayerCardClickedHandler(player: Player | null, positionName:string) {
    setAddPlayerFormActive(player === null);
    setSelectedPlayerForView(player);
    if(positionName !== "") {
      setSelectedPosition(positionName);
    }
  }

  function updatePlayer(player:Player, updateType:string) : Promise<Response> {
    return fetch(`http://localhost:3000/api/neo4j/users/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user, player, updateType:updateType}),
      })
  }
  
  function onPlayerAdded(player:Player) {
    if(!user || !user.team) return;
    
    updatePlayer(player, "addPlayer")
    .then((response: Response) => response.json())
    .then((data) => {
      if (data.errorMessage) {
        console.error(data.errorMessage);
      } else {
          addPlayerToTheTeam(player);
          setAddPlayerFormActive(false);
      }
    })
    .catch((error) => {
        // Server/db error
        console.error(error);
        alert(error);
    });
  }

  function addPlayerToTheTeam(player:Player) {
    const updatedTeam = {...usersTeam};
    switch(player.position.position) {
      case 'Goalkeeper':
        if(usersTeam.goalkeeper.length < 1)
          updatedTeam.goalkeeper.push(player);
        break;
      case 'Defender':
        if(usersTeam.defenders.length < 4)
          updatedTeam.defenders.push(player);
        break;
      case 'Midfielder':
        if(usersTeam.midfielders.length < 4)
          updatedTeam.midfielders.push(player);
        break;
      case 'Striker':
        if(usersTeam.strikers.length < 2)
          updatedTeam.strikers.push(player);
        break;
    }

    setUsersTeam(updatedTeam);
  }

  function onPlayerRemoved(player:Player) {
    if(!user || !user.team) return;

    updatePlayer(player, "removePlayer")
    .then((response: Response) => response.json())
    .then((data) => {
      if (data.errorMessage) {
        console.error(data.errorMessage);
      } else {
          removePlayerFromTheTeam(player);
          setAddPlayerFormActive(false);
          setSelectedPlayerForView(null);
      }
    })
    .catch((error) => {
        // Server/db error
        console.error(error);
        alert(error);
    });
  }

  function removePlayerFromTheTeam(player:Player) {
    const updatedTeam = {...usersTeam};
    switch(player.position.position) {
      case 'Goalkeeper':
        if(usersTeam.goalkeeper.length > 0)
          updatedTeam.goalkeeper = updatedTeam.goalkeeper.filter(p => p.id !== player.id);
        break;
      case 'Defender':
        if(usersTeam.defenders.length > 0)
          updatedTeam.defenders = updatedTeam.defenders.filter(p => p.id !== player.id);
        break;
      case 'Midfielder':
        if(usersTeam.midfielders.length > 0)
          updatedTeam.midfielders = updatedTeam.midfielders.filter(p => p.id !== player.id);
        break;
      case 'Striker':
        if(usersTeam.strikers.length > 0)
          updatedTeam.strikers = updatedTeam.strikers.filter(p => p.id !== player.id);
        break;
    }

    setUsersTeam(updatedTeam);
  }

  useEffect(() => {
    if (!user) {
      if (fetchedUser) loginUser(fetchedUser);
    } else {
      setUsersTeam(user.team);
    }
  }, [fetchedUser, user, loginUser]);

  if (!user) {
    return null; 
  }

  return (
    <main className={"main"}>
      <FootballPitch team={usersTeam} onPlayerCardClicked={onPlayerCardClickedHandler} onPlayerRemoved={onPlayerRemoved} />
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

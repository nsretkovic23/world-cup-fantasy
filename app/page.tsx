"use client";
import { useEffect, useContext, useState } from "react";
import { UserContext, UserContextType } from "@/context/user-context";
import useTryLocalStorageAuthentication from "../hooks/use-try-localStorage-Authentication";
import FootballPitch from "@/app/(components)/pitch/football-pitch";
import ViewPlayer from "./(components)/sidebars/view-player";
import { Player } from "@/lib/interfaces/db-data-Interfaces";
import SearchPlayers from "./(components)/sidebars/search-players";
import PlayerSearchFilterProvider from "@/context/player-search-filter-context";

export default function Home() {
  const { user, loginUser } = useContext(UserContext) as UserContextType;
  const fetchedUser = useTryLocalStorageAuthentication(true);
  const [selectedPlayerForView, setSelectedPlayerForView] =
    useState<Player | null>(null);
  const [addPlayerFormActive, setAddPlayerFormActive] =
    useState<boolean>(false);

  function onPlayerCardClickedHandler(player: Player | null) {
    setAddPlayerFormActive(player === null);
    setSelectedPlayerForView(player);
  }

  useEffect(() => {
    if (!user) {
      if (fetchedUser) loginUser(fetchedUser);
    }
  }, [fetchedUser, user, loginUser]);

  if (!user) {
    return null;
  }

  return (
    <main className={"main"}>
      <FootballPitch onPlayerCardClicked={onPlayerCardClickedHandler} />
      {selectedPlayerForView ? (
        <ViewPlayer player={selectedPlayerForView} />
      ) : addPlayerFormActive ? (
        <PlayerSearchFilterProvider>
          <SearchPlayers />
        </PlayerSearchFilterProvider>
      ) : null}
    </main>
  );
}

// <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />

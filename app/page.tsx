"use client";
import styles from "./page.module.css";
import { useEffect, useContext } from "react";
import { UserContext, UserContextType } from "@/context/user-context";
import useTryLocalStorageAuthentication from "../hooks/use-try-localStorage-Authentication";
import FootballPitch from "@/components/football-pitch/football-pitch";

export default function Home() {
  const { user, loginUser } = useContext(UserContext) as UserContextType;
  const fetchedUser = useTryLocalStorageAuthentication(true);

  useEffect(() => {
    if (!user) {
      if (fetchedUser) loginUser(fetchedUser);
    }
  }, [fetchedUser, user, loginUser]);

  return (
    <main className={styles.main}>
      {user ? <FootballPitch/> : null}
    </main>
  );
}

// <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />

"use client";
import styles from "./page.module.css";
import { useEffect, useState, useContext, useCallback } from "react";
import { UserContext, UserContextType } from "@/context/user-context";
import Link from "next/link";
import useTryLocalStorageAuthentication from "../hooks/use-try-localStorage-Authentication";

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
      {user ? null : <Link href="/login">Login</Link>}
      <h1>Test Auth: {user?.username}</h1>
    </main>
  );
}

// <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />

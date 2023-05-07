"use client";
import styles from "./page.module.css";
import { User } from "@/libs/interfaces";
import { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserContext, UserContextType } from "@/context/UserContext";

function getUserFromLocalStorage(): User | null {
  const userInfo = localStorage.getItem("loggedInUser");

  if (!userInfo) return null;

  return JSON.parse(userInfo) as User;
}

export default function Home() {
  const router = useRouter();
  //const userInfo = useRef<User | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const { user, loginUser } = useContext(UserContext) as UserContextType;

  // Local storage is inaccessible or not defined until component is rendered
  // So wait in useEffect for component to render and then try to obtain user data
  useEffect(() => {
    const userInfoFromLocalStorage = localStorage.getItem("loggedInUser");
    if (typeof window !== "undefined") {
      if (userInfoFromLocalStorage) {
        setUserInfo(JSON.parse(userInfoFromLocalStorage) as User);
      } else {
        router.replace("/login");
      }
    }
  }, [router]);

  const fetchUser = useCallback(
    async (userInfo: User) => {
      const redirectToLoginPageAndDeleteLocalStorageData = () => {
        router.replace("/login");
        localStorage?.removeItem("loggedInUser");
      };

      if (userInfo) {
        // Try to fetch user with username and password read from localStorage
        const response = await fetch(
          `http://localhost:3000/api/neo4j/users/auth/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInfo),
          }
        );
        // Get response data
        const data = await response.json();

        // If there is any error, redirect to login page, also delete localStorage data
        if (data.errorMessage) {
          console.error(data.errorMessage);
          redirectToLoginPageAndDeleteLocalStorageData();
        } else {
          // If everything is ok, login user(set context)
          loginUser(data as User);
        }
      }
    },
    [loginUser, router]
  );

  // When userInfo is loaded from localStorage, perform user authentication
  useEffect(() => {
    if (userInfo) fetchUser(userInfo as User);
  }, [userInfo, fetchUser]);

  return (
    <main className={styles.main}>
      <h1>Test Auth: {user?.username}</h1>
    </main>
  );
}

// <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />

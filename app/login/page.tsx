"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { User } from "@/lib/interfaces/db-data-Interfaces";
import { UserContext, UserContextType } from "@/context/user-context";
import { useRouter } from "next/navigation";
import useTryLocalStorageAuthentication from "../../hooks/use-try-localStorage-Authentication";

function Login() {
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, loginUser } = useContext(UserContext) as UserContextType;
  const router = useRouter();
  const fetchedUser = useTryLocalStorageAuthentication(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (fetchedUser) {
      loginUser(fetchedUser);
      router.replace("/");
    }
  }, [router, loginUser, fetchedUser]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.length < 4) {
      alert("Username needs to be at least 4 characters long");
      return;
    }

    if (password.length < 5) {
      alert("Password needs to be at least 5 characters long");
      return;
    }

    const userInfo = { username: username, password: password } as User;

    fetch(`http://localhost:3000/api/neo4j/users/${showSignup ? "" : "auth"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    })
      .then((response: Response) => response.json())
      .then((data) => {
        if (data.errorMessage) {
          console.error(data.errorMessage);
          alert(data.errorMessage);
        } else {
          // If everything is ok, login user(set context)
          loginUser(data as User);
          router.push("/");
        }
      })
      .catch((error) => {
        // Server/db error
        console.log(error);
        alert("Login failed: " + error);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {showSignup ? <h2>Sign Up</h2> : <h2>Sign In</h2>}
        <div className={styles.inputFieldContainer}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.inputFieldContainer}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          {showSignup ? <p>Sign Up</p> : <p>Sign In</p>}
        </button>
        <div className={styles.authContext}>
          {showSignup ? (
            <p>Already have an account? </p>
          ) : (
            <p>Don&apos;t have an account? </p>
          )}
          <a href="#" onClick={() => setShowSignup(!showSignup)}>
            {showSignup ? <p>Sign In</p> : <p>Sign Up</p>}
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;

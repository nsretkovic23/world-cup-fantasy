"use client";
import React, { useContext, useState } from "react";
import styles from "./styles.module.css";
import { User } from "@/libs/interfaces";
import { UserContext, UserContextType } from "@/context/UserContext";

function Login() {
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { loginUser } = useContext(UserContext) as UserContextType;

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.length < 4) {
      alert("Username needs to be at least 4 characters long");
      return;
    }

    fetch(`http://localhost:3000/api/neo4j/users/${username}`, {
      method: "GET",
      //credentials: "include",
    })
      .then((response: Response) => response.json())
      .then((data: User) => {
        if (data.password === password) {
          loginUser({ username, password } satisfies User);
        } else {
          alert("Wrong credentials");
          return;
        }
      })
      .catch((error) => {
        alert("This username does not exist");
        return;
      });
  };

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser: User = { username, email, password } satisfies User;
    // TODO: Check in database if user with this username exists
    // If user exists, prevent signup with message
    // If not, send POST to register user and then login user through context
    console.log(newUser);
    // fetch("http://localhost:3000/api/signup", {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username,
    //     email,
    //     password,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((user) => {
    //     console.log("Signed up as", user);
    //   })
    //   .catch((error) => {
    //     console.error("Signup failed:", error);
    //   });
  };

  return (
    <div className={styles.loginContainer}>
      {showSignup ? (
        <form onSubmit={handleSignup} className={styles.formContainer}>
          <h2>Sign Up</h2>
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Sign Up
          </button>
          <p className={styles.authContext}>
            Already have an account?{" "}
            <a href="#" onClick={() => setShowSignup(false)}>
              Log in
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleLogin} className={styles.formContainer}>
          <h2>Log In</h2>
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
            Log In
          </button>
          <p className={styles.authContext}>
            Don&apos;t have an account?{" "}
            <a href="#" onClick={() => setShowSignup(true)}>
              Sign up
            </a>
          </p>
        </form>
      )}
    </div>
  );
}

export default Login;

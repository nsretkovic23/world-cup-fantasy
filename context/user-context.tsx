"use client";
import { User } from "@/libs/interfaces/db-data-Interfaces";
import { createContext, useCallback, useState } from "react";

export type UserContextType = {
  user: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loginUser = useCallback(
    (user: User) => {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUser(user);
    },
    [setUser]
  );

  const logoutUser = useCallback (() => {
    localStorage.removeItem("loggedInUser");
    window.location.reload();
  }, []);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

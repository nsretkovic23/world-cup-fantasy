"use client";
import React, { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";

export type PlayerSearchFilterContextType = {
  cost: string;
  setCost?: Dispatch<SetStateAction<string>>;
  nation: string;
  setNation?: Dispatch<SetStateAction<string>>;
  rating: number;
  setRating?: Dispatch<SetStateAction<number>>;
};

const initialState = {
  cost: "0",
  nation: "AllNations",
  rating: 0,
} satisfies PlayerSearchFilterContextType;

export const PlayerSearchFilterContext =
  createContext<PlayerSearchFilterContextType>(initialState);

const PlayerSearchFilterProvider = ({ children}: { children: React.ReactNode }) => {
  const [cost, setCost] = useState<string>("0");
  const [nation, setNation] = useState<string>("AllNations");
  const [rating, setRating] = useState<number>(0);

  return (
    <PlayerSearchFilterContext.Provider
      value={{ cost, setCost, nation, setNation, rating, setRating }}
    >
      {children}
    </PlayerSearchFilterContext.Provider>
  );
};

export default PlayerSearchFilterProvider;

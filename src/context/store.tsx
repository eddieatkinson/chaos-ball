"use client";
import {
  Category,
  Player,
  VoteAction,
  VotesObject,
  isCategory,
  isPlayer,
} from "@/app/types";
import { db } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { createContext, useEffect, useReducer, useState } from "react";

export type StoreContext = {
  categories?: Category[];
  players?: Player[];
  votes: VotesObject;
  setVotes: (action: VoteAction) => void;
};

export const StoreContext = createContext<StoreContext>({
  categories: [],
  players: [],
  votes: {},
  setVotes: () => {},
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [votes, setVotes] = useReducer(
    (state: VotesObject, action: VoteAction) => {
      const { category, person, gender, isDelete } = action;
      if (isDelete) {
        const newState = { ...state };
        delete newState[category][gender];
        return newState;
      }
      return {
        ...state,
        [category]: { ...state[category], [gender]: person },
      };
    },
    {}
  );
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => {
    const queryRef = collection(db, "players");
    const q = query(queryRef, orderBy("gender", "asc"));
    onSnapshot(q, (querySnapshot) => {
      const players: Player[] = [];
      querySnapshot.forEach((doc) => {
        const player = doc.data();
        if (isPlayer(player)) {
          players.push({ ...player, id: doc.id });
        }
      });
      setPlayers(players);
    });
    const catQueryRef = collection(db, "categories");
    const cq = query(catQueryRef);
    onSnapshot(cq, (querySnapshot) => {
      const categories: Category[] = [];
      querySnapshot.forEach((doc) => {
        const category = doc.data();
        if (isCategory(category)) {
          categories.push({ ...category, id: doc.id });
        }
      });
      setCategories(categories);
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        categories,
        players,
        votes,
        setVotes,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

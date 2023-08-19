"use client";

import {
  Category,
  Player,
  VoteAction,
  VotesObject,
  isCategory,
  isPlayer,
} from "@/app/types";
import React, { createContext, useEffect, useReducer, useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import Cookies from "js-cookie";
import { db } from "@/firebase/config";

const EXPIRATION_DAYS = 2;
const EXPIRATION_DATE = "2023-08-20";

export type StoreContext = {
  categories?: Category[];
  players?: Player[];
  allPlayers?: Player[];
  votes: VotesObject;
  setVotes: (action: VoteAction) => void;
  playerCookie: string | null;
  setPlayerCookie: (player: string) => void;
  isExpired: boolean;
  hasVotedCookie?: boolean;
  handleSubmitVotes?: () => void;
  removeCookie?: (name: string) => void;
};

export const StoreContext = createContext<StoreContext>({
  categories: [],
  players: [],
  allPlayers: [],
  votes: {},
  setVotes: () => {},
  playerCookie: Cookies.get("player") ?? null,
  setPlayerCookie: () => {},
  isExpired: new Date() > new Date(EXPIRATION_DATE),
  hasVotedCookie: Cookies.get("hasVoted") === "true",
  handleSubmitVotes: () => {},
  removeCookie: () => {},
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const isExpired = new Date() > new Date(EXPIRATION_DATE);
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
  const [allPlayers, setallPlayers] = useState<Player[]>([]);
  const [playerCookie, _setPlayerCookie] = useState<string | null>(
    Cookies.get("player") ?? null
  );
  const [hasVotedCookie, setHasVotedCookie] = useState<boolean>(
    Cookies.get("hasVoted") === "true"
  );

  const setPlayerCookie = (player: string) => {
    _setPlayerCookie(player);
    Cookies.set("player", player, { expires: EXPIRATION_DAYS });
  };

  useEffect(() => {
    if (!isExpired) {
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
        setallPlayers(players);
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
    }
  }, [isExpired]);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  useEffect(() => {
    if (
      playerCookie &&
      players.map((player) => player.name).includes(playerCookie)
    ) {
      setPlayers(players.filter((player) => player.name !== playerCookie));
    }
  }, [playerCookie, players]);

  const handleSubmitVotes = () => {
    Object.keys(votes).forEach((category) => {
      const maleVote = votes[category].m ?? "";
      const femaleVote = votes[category].f ?? "";
      const categoryRef = doc(db, "categories", category);
      if (femaleVote) {
        updateDoc(categoryRef, {
          f: arrayUnion(`${playerCookie}-${femaleVote}`),
        });
      }
      if (maleVote) {
        updateDoc(categoryRef, {
          m: arrayUnion(`${playerCookie}-${maleVote}`),
        });
      }
      Cookies.set("hasVoted", "true", { expires: EXPIRATION_DAYS });
      setHasVotedCookie(true);
    });
  };

  const removeCookie = (name: string) => {
    Cookies.remove(name);
    if (name === "player") {
      _setPlayerCookie(null);
    } else if (name === "hasVoted") {
      setHasVotedCookie(false);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        players,
        allPlayers,
        votes,
        setVotes,
        playerCookie,
        setPlayerCookie,
        isExpired,
        hasVotedCookie,
        handleSubmitVotes,
        removeCookie,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

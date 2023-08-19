"use client";

import {
  Box,
  Button,
  Grid,
  Group,
  Space,
  Stack,
  Table,
  Title,
} from "@/app/components/mantine";
import { Category, Gender, isCategory } from "@/app/types";
import { collection, onSnapshot, query } from "firebase/firestore";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { db } from "@/firebase/config";
import { useStore } from "@/hooks/useStore";

const CORRECT_QUERY_CODE = "0308";

export default function Page() {
  const { queryCode } = useParams();
  const { allPlayers: players } = useStore();
  // const [newCategories, setNewCategories] = useState<Category[]>([]);
  const [winners, setWinners] = useState<{
    [category: string]: { [key in Gender]: string };
  }>({});
  const [categoriesWithVotes, setCategoriesWithVotes] = useState<{
    [category: string]: {
      [key in Gender]?: { [player: string]: number };
    };
  }>({});

  // useEffect(() => {
  const handleGetResults = () => {
    if (players?.length) {
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
        // setNewCategories(categories);
        const categoriesWithVotes: {
          [category: string]: {
            [key in Gender]?: { [player: string]: number };
          };
        } = {};
        categories.forEach((category) => {
          const { title, f = [], m = [] } = category;
          const fCount: { [name: string]: number } = {};
          f.forEach((player) => {
            const name = player.split("-")[1];
            if (fCount[name]) {
              fCount[name] += 1;
            } else {
              fCount[name] = 1;
            }
          });
          const mCount: { [name: string]: number } = {};
          m.forEach((player) => {
            const name = player.split("-")[1];
            if (mCount[name]) {
              mCount[name] += 1;
            } else {
              mCount[name] = 1;
            }
          });
          categoriesWithVotes[title] = {
            f: fCount,
            m: mCount,
          };
        });
        setCategoriesWithVotes(categoriesWithVotes);
        const usedPlayers: string[] = [];
        const winners: { [category: string]: { [key in Gender]: string } } = {};
        Object.keys(categoriesWithVotes).forEach((category) => {
          let winnerF = "";
          let winnerM = "";
          if (Object.keys(categoriesWithVotes[category].f ?? {}).length === 1) {
            winnerF = Object.keys(categoriesWithVotes[category].f ?? "")[0];
            usedPlayers.push(winnerF);
          }
          if (Object.keys(categoriesWithVotes[category].m ?? {}).length === 1) {
            winnerM = Object.keys(categoriesWithVotes[category].m ?? "")[0];
            usedPlayers.push(winnerM);
          }
          winners[category] = {
            f: winnerF,
            m: winnerM,
          };
        });

        players.forEach((player) => {
          const { name, gender } = player;
          let winningCategory = "Audrey Hepburn";
          for (let i = 0; i < Object.keys(categoriesWithVotes).length; i++) {
            const category = Object.keys(categoriesWithVotes)[i];
            let highestVoteCount = 0;
            if (!winners[category]?.[gender]) {
              if (
                Object.keys(categoriesWithVotes[category][gender] ?? {})
                  .filter((name) => !usedPlayers.includes(name))
                  .includes(name) &&
                Object.keys(categoriesWithVotes[category][gender] ?? {}).filter(
                  (name) => !usedPlayers.includes(name)
                ).length === 1
              ) {
                winningCategory = category;
                usedPlayers.push(name);
                break;
              }
              if (
                categoriesWithVotes[category][gender]?.[name] &&
                (categoriesWithVotes[category][gender]?.[name] ?? 0) >
                  highestVoteCount
              ) {
                highestVoteCount =
                  categoriesWithVotes[category][gender]?.[name] ?? 0;
                winningCategory = category;
              }
            }
          }
          // Object.keys(categoriesWithVotes).forEach((category) => {
          //   let highestVoteCount = 0;
          //   if (!winners[category]?.[gender]) {
          //     if (
          //       categoriesWithVotes[category][gender]?.[name] &&
          //       (categoriesWithVotes[category][gender]?.[name] ?? 0) >
          //         highestVoteCount
          //     ) {
          //       highestVoteCount =
          //         categoriesWithVotes[category][gender]?.[name] ?? 0;
          //       winningCategory = category;
          //     }
          //   }
          // });
          // if (winningCategory) {
          usedPlayers.push(name);
          winners[winningCategory][gender] = name;
          // }
        });
        setWinners(winners);
      });
    }
  };
  // }, [players]);

  useEffect(() => {
    console.log({ winners, categoriesWithVotes });
  }, [winners, categoriesWithVotes]);

  if (queryCode !== CORRECT_QUERY_CODE) {
    redirect("/");
  }

  return (
    <Stack>
      <Button variant="outline" onClick={handleGetResults}>
        Get results!
      </Button>
      <Table style={{ color: "white" }}>
        <thead>
          <th>Category</th>
          <th>Female</th>
          <th>Male</th>
        </thead>
        <tbody>
          {Object.keys(winners).map((category) => {
            const { f, m } = winners[category];
            return (
              <tr key={category}>
                <td>{category}</td>
                <td>{f}</td>
                <td>{m}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Space h={30} />
      <Title>Raw</Title>
      <Table style={{ color: "white" }}>
        <thead>
          <th>Category</th>
          <th>F</th>
          <th>M</th>
        </thead>
        <tbody>
          {Object.keys(categoriesWithVotes).map((category) => {
            const { f, m } = categoriesWithVotes[category];
            return (
              <tr key={category} style={{ overflowX: "scroll" }}>
                <td>{category}</td>
                <td>{JSON.stringify(f)}</td>
                <td>{JSON.stringify(m)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Stack>
  );
}

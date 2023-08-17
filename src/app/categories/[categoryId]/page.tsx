"use client";

import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Text,
  Title,
} from "@/app/components/mantine";
import { Category, Player, isPlayer } from "@/app/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { IoIosArrowBack } from "react-icons/io";
import { db } from "@/firebase/config";
import { otherSelectedCategory } from "@/app/utils";
import { useStore } from "@/hooks/useStore";

export default function Page() {
  const { categoryId: id } = useParams();
  const { back } = useRouter();
  const { players = [], votes, setVotes } = useStore();
  const categoryId = id as string;
  const [category, setCategory] = useState<Category>();
  useEffect(() => {
    const fetchStuff = async () => {
      const docRef = doc(db, "categories", categoryId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Category;
      setCategory(data);
    };
    if (categoryId) {
      fetchStuff();
    }
  }, [categoryId]);
  const handeClick = (player: Player, isDelete: boolean) => {
    if (category) {
      const { name, gender } = player;
      setVotes({
        category: category?.title,
        person: name,
        gender,
        isDelete,
      });
    }
  };
  if (!category) {
    return <Container>Loading...</Container>;
  }
  return (
    <Container>
      <Group>
        <ActionIcon onClick={back}>
          <IoIosArrowBack />
        </ActionIcon>
        <Title>{category.title}</Title>
      </Group>
      <Title size="h3">{category.description}</Title>
      <Text>Choose one woman and one man:</Text>
      <Grid>
        {players.map((player) => {
          const { id, name, gender } = player;
          const isSelected = name === votes[category.title]?.[gender];
          const otherCategorySelected = otherSelectedCategory(
            category.title,
            name,
            votes
          );
          return (
            <Grid.Col span={6} key={id}>
              <Button
                p={0}
                bg={isSelected ? "pink" : "transparent"}
                color={gender === "f" ? "pink" : "blue"}
                variant={isSelected ? "filled" : "outline"}
                disabled={!!otherCategorySelected}
                style={{
                  ...(isSelected && {
                    backgroundColor: gender === "f" ? "pink" : "blue",
                  }),
                }}
                w="100%"
                onClick={() => handeClick(player, isSelected)}
              >
                <Text>
                  {name}
                  {otherCategorySelected ? ` - ${otherCategorySelected}` : ""}
                </Text>
              </Button>
            </Grid.Col>
          );
        })}
      </Grid>
    </Container>
  );
}

"use client";
import { Text, Card, Carousel, Container } from "@/app/components/mantine";
import { db } from "@/firebase/config";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [players, setPlayers] = useState<DocumentData[]>([]);
  const [categories, setCategories] = useState<DocumentData[]>([]);
  const [focusedSlide, setFocusedSlide] = useState<number>(0);
  useEffect(() => {
    const queryRef = collection(db, "players");
    const q = query(queryRef, orderBy("gender", "desc"));
    onSnapshot(q, (querySnapshot) => {
      const players: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        players.push({ ...doc.data(), id: doc.id });
      });
      setPlayers(players);
    });
    const catQueryRef = collection(db, "categories");
    const cq = query(catQueryRef);
    onSnapshot(cq, (querySnapshot) => {
      const categories: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        categories.push({ ...doc.data(), id: doc.id });
      });
      setCategories(categories);
    });
  }, []);
  useEffect(() => {
    console.log({
      players,
      categories,
      focusedSlide,
      focusedCat: categories[focusedSlide]?.title,
    });
  }, [players, categories, focusedSlide]);
  return (
    <Container py={30}>
      <Carousel
        // ref={emblaRef}
        slideSize="70%"
        // withIndicators
        height="30vh"
        slideGap={20}
        sx={{
          ["& .mantine-Carousel-control"]: {
            backgroundColor: "white",
          },
        }}
        onSlideChange={setFocusedSlide}
      >
        {categories.map((category) => (
          <Carousel.Slide
            key={category.id}
            onFocus={(e) => console.log(e.currentTarget)}
          >
            <Card h="100%">
              <Text size="lg">{category.title}</Text>
              <Text size="sm">{category.description}</Text>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
      <Text>Display players</Text>
    </Container>
  );
}

"use client";

import {
  Button,
  Card,
  Container,
  Grid,
  Modal,
  Stack,
  Text,
  Title,
} from "@/app/components/mantine";
import { useMemo, useState } from "react";

import Link from "next/link";
import { useStore } from "@/hooks/useStore";

export default function Home() {
  const {
    categories = [],
    votes,
    playerCookie,
    setPlayerCookie,
    players,
    isExpired,
    hasVotedCookie,
    handleSubmitVotes,
  } = useStore();
  const [myPlayer, setMyPlayer] = useState<string | null>(null);
  const haveAllVotesBeenCast = useMemo(() => {
    let numVotes = 0;
    Object.values(votes).forEach((categoryVotes) => {
      numVotes += Object.values(categoryVotes).length;
    });
    return numVotes === 23;
  }, [votes]);
  const handleSetPlayer = () => {
    if (!myPlayer) return;
    setPlayerCookie(myPlayer);
  };
  if (isExpired) {
    return <Title>We hope you&apos;ve enjoyed Chaos Ball!!</Title>;
  }
  if (hasVotedCookie) {
    return <Title>Thanks for voting!</Title>;
  }
  return (
    <Container py={30}>
      <Stack>
        {categories.map((category) => {
          const peopleVotedForThisCategory = Object.values(
            votes[category.title] ?? {}
          );
          return (
            <Link href={`/categories/${category.id}`} key={category.title}>
              <Card h="100%">
                <Grid>
                  <Stack style={{ flexGrow: 1, flexWrap: "nowrap" }}>
                    <Text size="lg">{category.title}</Text>
                    <Text size="sm">{category.description}</Text>
                  </Stack>
                  {!!peopleVotedForThisCategory.length && (
                    <Stack>
                      {peopleVotedForThisCategory.map((person) => (
                        <Text key={person}>{person}</Text>
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Card>
            </Link>
          );
        })}
        <Button
          style={{ backgroundColor: "green" }}
          // disabled={!haveAllVotesBeenCast}
          size="xl"
          onClick={handleSubmitVotes}
        >
          Submit Votes!
        </Button>
      </Stack>
      <Modal
        title={
          <Title>
            Who <i>are</i> you?
          </Title>
        }
        opened={!playerCookie}
        onClose={() => null}
      >
        <Title size="h4">Let us know which player you are.</Title>
        <Grid>
          {players?.map((player) => (
            <Grid.Col span={6} key={player.id}>
              <Button
                variant={player.name === myPlayer ? "filled" : "outline"}
                color="green"
                onClick={() => setMyPlayer(player.name)}
                {...(player.name === myPlayer
                  ? { style: { backgroundColor: "green" } }
                  : {})}
              >
                {player.name}
              </Button>
            </Grid.Col>
          ))}
        </Grid>
        <Button
          style={{ backgroundColor: "blue" }}
          onClick={handleSetPlayer}
          disabled={!myPlayer}
        >
          {myPlayer ? `I am ${myPlayer}!` : "Please choose"}
        </Button>
      </Modal>
    </Container>
  );
}

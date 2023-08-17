"use client";

import { Card, Container, Stack, Text } from "@/app/components/mantine";

import Link from "next/link";
import { useStore } from "@/hooks/useStore";

export default function Home() {
  const { categories = [] } = useStore();
  return (
    <Container py={30}>
      <Stack>
        {categories.map((category) => (
          <Link href={`/categories/${category.id}`} key={category.title}>
            <Card h="100%">
              <Text size="lg">{category.title}</Text>
              <Text size="sm">{category.description}</Text>
            </Card>
          </Link>
        ))}
      </Stack>
    </Container>
  );
}

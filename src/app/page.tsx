"use client";
import { Text, Card, Container } from "@/app/components/mantine";
import { useStore } from "@/hooks/useStore";
import Link from "next/link";

export default function Home() {
  const { categories = [] } = useStore();
  return (
    <Container py={30}>
      {categories.map((category) => (
        <Link href={`/categories/${category.id}`} key={category.title}>
          <Card h="100%">
            <Text size="lg">{category.title}</Text>
            <Text size="sm">{category.description}</Text>
          </Card>
        </Link>
      ))}
    </Container>
  );
}

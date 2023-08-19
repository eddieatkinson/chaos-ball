"use client";

import { Button, Stack } from "@/app/components/mantine";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

export default function Page() {
  const { removeCookie } = useStore();
  const { push } = useRouter();
  return (
    <Stack>
      <Link href={"/"}>
        <Button style={{ backgroundColor: "red" }}>Home</Button>
      </Link>
      <Button
        onClick={() => {
          removeCookie?.("hasVoted");
          push("/");
        }}
        style={{ backgroundColor: "blue" }}
      >
        Reset Voted Status
      </Button>
    </Stack>
  );
}

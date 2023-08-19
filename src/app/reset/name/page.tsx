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
          removeCookie?.("player");
          push("/");
        }}
        style={{ backgroundColor: "blue" }}
      >
        Reset Name
      </Button>
    </Stack>
  );
}

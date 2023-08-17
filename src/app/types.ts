export type Gender = "m" | "f";
export type Player = { gender: Gender; id: string; name: string };
export function isPlayer(p: any): p is Player {
  return p && typeof p === "object" && "gender" in p && "name" in p;
}
export type Category = { id: string; title: string; description: string };
export function isCategory(c: any): c is Category {
  return c && typeof c === "object" && "title" in c && "description" in c;
}
export type VotesObject = {
  [category: string]: { [key in Gender]?: string };
};

export type VoteAction = {
  category: string;
  person: string; // their name
  gender: "m" | "f";
  isDelete?: boolean;
};

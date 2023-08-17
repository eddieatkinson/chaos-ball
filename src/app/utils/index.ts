import { VotesObject } from "../types";

export function isValueAtLevel(
  data: any,
  targetValue: any,
  targetLevel: number,
  currentLevel: number = 0
): boolean {
  if (currentLevel === targetLevel) {
    if (data === targetValue) {
      return true;
    } else {
      return false;
    }
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      for (const item of data) {
        if (isValueAtLevel(item, targetValue, targetLevel, currentLevel + 1)) {
          return true;
        }
      }
    } else {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (
            isValueAtLevel(
              data[key],
              targetValue,
              targetLevel,
              currentLevel + 1
            )
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function otherSelectedCategory(
  currentCategory: string,
  name: string,
  votes: VotesObject
): string | null {
  for (const category in votes) {
    if (category !== currentCategory) {
      if (votes[category].m === name || votes[category].f === name) {
        return category;
      }
    }
  }

  return null;
}

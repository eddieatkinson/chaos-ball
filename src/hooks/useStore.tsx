import { StoreContext } from "@/context/store";
import { useContext } from "react";

export const useStore = () => {
  return useContext(StoreContext);
};

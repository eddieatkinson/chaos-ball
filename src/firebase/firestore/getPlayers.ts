import firebase_app from "../config";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const db = getFirestore(firebase_app);
export default async function getPlayers() {
  const playersCol = collection(db, "players");
  const playersSnapshot = await getDocs(playersCol);
  const playersList = playersSnapshot.docs.map((doc) => doc.data());
  return playersList;
}

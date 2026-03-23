import { wordList } from "../data/scribble_words";

export default function getWord() {
  try {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  } catch (error) {
    console.error("Error getting word:", error);
    return "error"; 
  }
}
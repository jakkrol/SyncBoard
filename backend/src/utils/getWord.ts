import fs from "fs";
import path from "path";

const wordsFilePath = path.join(__dirname, "../data/scribble_words.txt");
const wordsData = fs.readFileSync(wordsFilePath, "utf-8");
const wordList = wordsData.split("\n");

export default function getWord(){
    try{     
        return wordList[Math.floor(Math.random() * wordList.length)];
    }catch(error){
        console.error("Error getting word:", error);
        return false;
    }
}
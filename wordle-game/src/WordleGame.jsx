import React, { useEffect, useReducer } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function getRandomWord() {
  const wordsCollection = collection(db, "words");
  const wordSnapshot = await getDocs(wordsCollection);
  const wordList = wordSnapshot.docs.map((doc) => doc.data().value);

  const randomIndex = Math.floor(Math.random() * wordList.length);
  const randomWord = wordList[randomIndex].toUpperCase();
  console.log(randomWord);
  return randomWord;
}

const createInitialState = (answer = "") => ({
  grid: Array(6)
    .fill("")
    .map(() => Array(5).fill({ letter: "", color: "" })),
  currentRow: 0,
  currentCol: 0,
  status: "playing",
  answer,
});
const wordLength = 5;
function reducer(state, action) {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answer: action.payload,
      };

    case "ADD_LETTER":
      if (state.status === "playing" && state.currentCol < wordLength) {
        const newGrid = [...state.grid];
        newGrid[state.currentRow][state.currentCol] = {
          letter: action.payload,
          color: "",
        };
        return {
          ...state,
          grid: newGrid,
          currentCol: state.currentCol + 1,
        };
      }
      return state;
    case "DELETE_LETTER":
      if (state.status === "playing" && state.currentCol > 0) {
        const newGrid = [...state.grid];
        newGrid[state.currentRow][state.currentCol - 1] = {
          letter: "",
          color: "",
        };
        return {
          ...state,
          grid: newGrid,
          currentCol: state.currentCol - 1,
        };
      }
      return state;
    case "SUBMIT":
      if (state.status === "playing" && state.currentCol === wordLength) {
        const newGrid = [...state.grid];
        const answer = state.answer;
        let isCorrect = true;

        const letterCount = {};
        for (let i = 0; i < wordLength; i++) {
          const answerLetter = answer[i];
          if (!letterCount[answerLetter]) letterCount[answerLetter] = 0;
          letterCount[answerLetter]++;
        }
        for (let i = 0; i < wordLength; i++) {
          const letter = newGrid[state.currentRow][i].letter;
          if (letter === answer[i]) {
            newGrid[state.currentRow][i].color = "bg-wordle-green";
            letterCount[letter]--;
          } else {
            isCorrect = false;
          }
        }
        for (let i = 0; i < wordLength; i++) {
          const letter = newGrid[state.currentRow][i].letter;
          if (newGrid[state.currentRow][i].color !== "bg-wordle-green") {
            if (letterCount[letter] && letterCount[letter] > 0) {
              newGrid[state.currentRow][i].color = "bg-wordle-yellow";
              letterCount[letter]--;
            } else {
              newGrid[state.currentRow][i].color = "bg-wordle-gray";
            }
          }
        }

        return {
          ...state,
          grid: newGrid,
          currentRow: state.currentRow + 1,
          currentCol: 0,
          status: isCorrect
            ? "win"
            : state.currentRow + 1 >= 6
            ? "gameOver"
            : "playing",
        };
      }
      return state;
    case "RESET":
      return createInitialState(action.payload);

    default:
      return state;
  }
}

export default function WordleGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  async function fetchWord() {
    const randomWord = await getRandomWord();
    dispatch({ type: "SET_ANSWER", payload: randomWord });
  }
  useEffect(() => {
    fetchWord();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      dispatch({ type: "DELETE_LETTER" });
    } else if (event.key === "Enter") {
      dispatch({ type: "SUBMIT" });
    } else {
      const key = event.key.toUpperCase();

      if (key.length === 1 && key >= "A" && key <= "Z") {
        dispatch({ type: "ADD_LETTER", payload: key });
      }
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="grid grid-rows-6 justify-center gap-[5px]">
        {state.grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-[5px]">
            {row.map((letterBox, colIndex) => (
              <div
                key={colIndex}
                className={`w-16 h-16 flex items-center justify-center border-2 border-gray-300 text-3xl font-bold ${
                  letterBox.color
                } ${letterBox.color ? "text-white" : "text-black"}`}
              >
                {letterBox.letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      {state.status === "win" && (
        <div className="text-center mt-4 text-2xl font-bold text-yellow-500">
          Congratulations, you guessed it!
        </div>
      )}
      {state.status === "gameOver" && (
        <div className="text-center mt-4 text-2xl font-bold text-blue-900">
          Game Over :(
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-900 text-white font-bold rounded"
        onClick={async (event) => {
          const newWord = await fetchWord();
          dispatch({ type: "RESET", payload: newWord });
          event.target.blur();
        }}
      >
        Reset
      </button>
    </div>
  );
}

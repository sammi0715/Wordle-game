import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import WordleGame from "./WordleGame";
import { useReducer } from "react";

function App() {
  return (
    <>
      <WordleGame />
    </>
  );
}

export default App;

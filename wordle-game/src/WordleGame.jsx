import React, { useReducer } from "react";

const initialState = {
  grid: Array(6)
    .fill("")
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
  isSubmitted: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_LETTER":
      if (state.currentCol < 5) {
        const newGrid = [...state.grid];
        newGrid[state.currentRow][state.currentCol] = action.payload;
        return {
          ...state,
          grid: newGrid,
          currentCol: state.currentCol + 1,
        };
      }
      return state;
    case "DELETE_LETTER":
      if (state.currentCol > 0) {
        const newGrid = [...state.grid];
        newGrid[state.currentRow][state.currentCol - 1] = "";
        return {
          ...state,
          grid: newGrid,
          currentCol: state.currentCol - 1,
        };
      }
      return state;
    case "SUBMIT":
      if (state.currentCol === 5) {
        return {
          ...state,
          currentRow: state.currentRow + 1,
          currentCol: 0,
          isSubmitted: true,
        };
      }
      return state;
    default:
      return state;
  }
}

export default function WordleGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      dispatch({ type: "DELETE_LETTER" });
    } else if (event.key === "Enter") {
      dispatch({ type: "SUBMIT" });
    } else {
      const key = event.key.toUpperCase();
      // 檢查是否是字母鍵
      if (key.length === 1 && key >= "A" && key <= "Z") {
        dispatch({ type: "ADD_LETTER", payload: key });
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-rows-6 justify-center gap-2">
        {state.grid.map((row, rowIndex) => (
          <div key={rowIndex} className="w-3/4 grid grid-cols-5 gap-8">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="w-16 h-16 flex items-center justify-center border border-gray-300 text-xl"
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

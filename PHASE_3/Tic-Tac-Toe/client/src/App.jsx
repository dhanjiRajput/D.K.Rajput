  // New game handler
  function handleNewGame() {
    // Always return to main menu after game over
    setPlayAI(false);
    setAiLevel(null);
    setPlayOnline(false);
    setPlayerName("");
    setOpponentName(null);
    setPlayingAs(null);
    setGameState(renderFrom);
    setCurrentPlayer("circle");
    setFinishetState(false);
    setFinishedArrayState([]);
    setTimer(15);
    setTimeOver(false);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }
import React, { useState, useEffect } from "react";
import "./App.css";
import Square from "./Square/Square";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {
  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishetState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [timer, setTimer] = useState(15);
  const [timeOver, setTimeOver] = useState(false);
  const [playOnline, setPlayOnline] = useState(false);
  const [playAI, setPlayAI] = useState(false);
  const [aiLevel, setAiLevel] = useState(null); // 'normal' or 'hard'
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);
  // Normal AI: pick first available cell
  const aiMoveNormal = () => {
    if (finishedState) return;
    let found = false;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameState[row][col] !== "circle" && gameState[row][col] !== "cross") {
          setGameState((prevState) => {
            let newState = [...prevState];
            newState[row][col] = "cross";
            return newState;
          });
          setCurrentPlayer("circle");
          found = true;
          break;
        }
      }
      if (found) break;
    }
  };

  // Hard AI: minimax algorithm
  const aiMoveHard = () => {
    if (finishedState) return;
    const bestMove = getBestMove(gameState);
    if (bestMove) {
      setGameState((prevState) => {
        let newState = [...prevState];
        newState[bestMove.row][bestMove.col] = "cross";
        return newState;
      });
      setCurrentPlayer("circle");
    }
  };

  // Minimax helper functions
  function getAvailableMoves(state) {
    const moves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (state[row][col] !== "circle" && state[row][col] !== "cross") {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  function checkWinnerMinimax(state) {
    // rows
    for (let i = 0; i < 3; i++) {
      if (state[i][0] === state[i][1] && state[i][1] === state[i][2]) {
        if (state[i][0] === "circle" || state[i][0] === "cross") return state[i][0];
      }
    }
    // columns
    for (let i = 0; i < 3; i++) {
      if (state[0][i] === state[1][i] && state[1][i] === state[2][i]) {
        if (state[0][i] === "circle" || state[0][i] === "cross") return state[0][i];
      }
    }
    // diagonals
    if (state[0][0] === state[1][1] && state[1][1] === state[2][2]) {
      if (state[0][0] === "circle" || state[0][0] === "cross") return state[0][0];
    }
    if (state[0][2] === state[1][1] && state[1][1] === state[2][0]) {
      if (state[0][2] === "circle" || state[0][2] === "cross") return state[0][2];
    }
    // draw
    if (state.flat().every(e => e === "circle" || e === "cross")) return "draw";
    return null;
  }

  function minimax(state, depth, isMaximizing) {
    const winner = checkWinnerMinimax(state);
    if (winner === "cross") return 10 - depth;
    if (winner === "circle") return depth - 10;
    if (winner === "draw") return 0;
    if (depth > 5) return 0; // limit depth for performance
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of getAvailableMoves(state)) {
        const newState = state.map(row => [...row]);
        newState[move.row][move.col] = "cross";
        const score = minimax(newState, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of getAvailableMoves(state)) {
        const newState = state.map(row => [...row]);
        newState[move.row][move.col] = "circle";
        const score = minimax(newState, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  }

  function getBestMove(state) {
    let bestScore = -Infinity;
    let bestMove = null;
    for (const move of getAvailableMoves(state)) {
      const newState = state.map(row => [...row]);
      newState[move.row][move.col] = "cross";
      const score = minimax(newState, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  const checkWinner = () => {
    // row dynamic
    for (let row = 0; row < gameState.length; row++) {
      if (
        gameState[row][0] === gameState[row][1] &&
        gameState[row][1] === gameState[row][2]
      ) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0];
      }
    }

    // column dynamic
    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }

    if (
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2]
    ) {
      return gameState[0][0];
    }

    if (
      gameState[0][2] === gameState[1][1] &&
      gameState[1][1] === gameState[2][0]
    ) {
      return gameState[0][2];
    }

    const isDrawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") return true;
    });

    if (isDrawMatch) return "draw";

    return null;
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setFinishetState(winner);
    }
    // AI move if it's AI's turn
    if (playAI && currentPlayer === "cross" && !winner && !timeOver) {
      setTimeout(() => {
        if (aiLevel === "hard") {
          aiMoveHard();
        } else {
          aiMoveNormal();
        }
      }, 500);
    }
  }, [gameState, currentPlayer, playAI, aiLevel, timeOver]);

  // Timer effect
  useEffect(() => {
    if (finishedState || timeOver || (!playAI && !playOnline)) return;
    if (timer === 0) {
      setTimeOver(true);
      setFinishetState("timeOver");
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, finishedState, playAI, playOnline, timeOver]);

  // Reset timer on new game
  useEffect(() => {
    if ((!playAI && !playOnline) || finishedState || timeOver) return;
    setTimer(15);
    setTimeOver(false);
  }, [playAI, playOnline]);
  async function playAIClick(level) {
    const result = await takePlayerName();
    if (!result.isConfirmed) {
      return;
    }
    const username = result.value;
    setPlayerName(username);
    setOpponentName("AI");
    setPlayingAs("circle");
    setPlayAI(true);
    setAiLevel(level);
    setGameState(renderFrom);
    setCurrentPlayer("circle");
    setFinishetState(false);
    setFinishedArrayState([]);
    setTimer(15);
    setTimeOver(false);
  }

  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    return result;
  };

  socket?.on("opponentLeftMatch", () => {
    setFinishetState("opponentLeftMatch");
  });

  socket?.on("playerMoveFromServer", (data) => {
    const id = data.state.id;
    setGameState((prevState) => {
      let newState = [...prevState];
      const rowIndex = Math.floor(id / 3);
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = data.state.sign;
      return newState;
    });
    setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
  });

  socket?.on("connect", function () {
    setPlayOnline(true);
  });

  socket?.on("OpponentNotFound", function () {
    setOpponentName(false);
  });

  socket?.on("OpponentFound", function (data) {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });

  async function playOnlineClick() {
    const result = await takePlayerName();

    if (!result.isConfirmed) {
      return;
    }

    const username = result.value;
    setPlayerName(username);

    const newSocket = io("http://localhost:3000", {
      autoConnect: true,
    });

    newSocket?.emit("request_to_play", {
      playerName: username,
    });

    setSocket(newSocket);
    setTimer(15);
    setTimeOver(false);
  }

  if (!playOnline && !playAI) {
    return (
      <div className="main-div">
        <button onClick={playOnlineClick} className="playOnline">
          Play Online
        </button>
        <div style={{display:'flex', gap:20, marginTop:40}}>
          <button onClick={() => playAIClick('normal')} className="playOnline" style={{backgroundColor:'#3fa7f0', fontSize:32, padding:'12px 24px', marginTop:0}}>
            Play vs AI (Normal)
          </button>
          <button onClick={() => playAIClick('hard')} className="playOnline" style={{backgroundColor:'#dd7f9f', fontSize:32, padding:'12px 24px', marginTop:0}}>
            Play vs AI (Hard)
          </button>
        </div>
      </div>
    );
  }

  if (playOnline && !opponentName) {
    return (
      <div className="waiting">
        <p>Waiting for opponent</p>
      </div>
    );
  }

  if (playAI) {
    return (
      <div className="main-div">
        <div className="move-detection">
          <div className={`left ${currentPlayer === playingAs ? "current-move-" + currentPlayer : ""}`}>{playerName}</div>
          <div className={`right ${currentPlayer !== playingAs ? "current-move-" + currentPlayer : ""}`}>AI ({aiLevel === 'hard' ? 'Hard' : 'Normal'})</div>
        </div>
        <div className="timer-bar">
          <span className="timer-label">Time Left:</span> <span className="timer-value">{timer}s</span>
        </div>
        <div>
          <h1 className="game-heading water-background">Tic Tac Toe</h1>
          <div className="square-wrapper">
            {gameState.map((arr, rowIndex) =>
              arr.map((e, colIndex) => {
                return (
                  <Square
                    socket={null}
                    playingAs={playingAs}
                    gameState={gameState}
                    finishedArrayState={finishedArrayState}
                    finishedState={finishedState}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                    setGameState={setGameState}
                    id={rowIndex * 3 + colIndex}
                    key={rowIndex * 3 + colIndex}
                    currentElement={e}
                    playAI={true}
                    aiLevel={aiLevel}
                  />
                );
              })
            )}
          </div>
          {finishedState && finishedState === "timeOver" && (
            <h3 className="finished-state">Time Over! Game Ended.</h3>
          )}
          {finishedState && finishedState !== "draw" && finishedState !== "timeOver" && (
            <h3 className="finished-state">
              {finishedState === playingAs ? "You " : finishedState === "cross" ? "AI " : finishedState} won the game
            </h3>
          )}
          {finishedState && finishedState === "draw" && (
            <h3 className="finished-state">It's a Draw</h3>
          )}
          {finishedState && (
            <button
              className="new-game-btn"
              onClick={handleNewGame}
            >
              <span style={{fontWeight:700, letterSpacing:1}}>🔄 Start New Game</span>
            </button>
          )}
        </div>
        {!finishedState && opponentName && (
          <h2>You are playing against AI ({aiLevel === 'hard' ? 'Hard' : 'Normal'})</h2>
        )}
        {finishedState && finishedState === "opponentLeftMatch" && (
          <h2>You won the match, Opponent has left</h2>
        )}
      </div>
    );
  }
  return (
    <div className="main-div">
      <div className="move-detection">
        <div
          className={`left ${
            currentPlayer === playingAs ? "current-move-" + currentPlayer : ""
          }`}
        >
          {playerName}
        </div>
        <div
          className={`right ${
            currentPlayer !== playingAs ? "current-move-" + currentPlayer : ""
          }`}
        >
          {opponentName}
        </div>
      </div>
      <div className="timer-bar">
        <span className="timer-label">Time Left:</span> <span className="timer-value">{timer}s</span>
      </div>
      <div>
        <h1 className="game-heading water-background">Tic Tac Toe</h1>
        <div className="square-wrapper">
          {gameState.map((arr, rowIndex) =>
            arr.map((e, colIndex) => {
              return (
                <Square
                  socket={socket}
                  playingAs={playingAs}
                  gameState={gameState}
                  finishedArrayState={finishedArrayState}
                  finishedState={finishedState}
                  currentPlayer={currentPlayer}
                  setCurrentPlayer={setCurrentPlayer}
                  setGameState={setGameState}
                  id={rowIndex * 3 + colIndex}
                  key={rowIndex * 3 + colIndex}
                  currentElement={e}
                />
              );
            })
          )}
        </div>
        {finishedState && finishedState === "timeOver" && (
          <h3 className="finished-state">Time Over! Game Ended.</h3>
        )}
        {finishedState &&
          finishedState !== "opponentLeftMatch" &&
          finishedState !== "draw" && finishedState !== "timeOver" && (
            <h3 className="finished-state">
              {finishedState === playingAs ? "You " : finishedState} won the
              game
            </h3>
          )}
        {finishedState &&
          finishedState !== "opponentLeftMatch" &&
          finishedState === "draw" && (
            <h3 className="finished-state">It's a Draw</h3>
          )}
        {/* Only one new game button is rendered above */}
      </div>
      {!finishedState && opponentName && (
        <h2>You are playing against {opponentName}</h2>
      )}
      {finishedState && finishedState === "opponentLeftMatch" && (
        <h2>You won the match, Opponent has left</h2>
      )}
    </div>
  );
};

export default App;
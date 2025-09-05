import {useState} from 'react';

function Square({ value, onSquareClick }) {
  // �� 이모지 대신 간단한 기호 사용
  const getDisplayValue = () => {
    if (value === "X") return "❌";
    if (value === "O") return "⭕";
    return value;
  };

  return(
    <button className="square" onClick={onSquareClick}>
      {getDisplayValue()}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, boardSize, playerNames }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares, boardSize)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, boardSize);
  let status;
  if (winner) {
    const winnerName = winner === "X" ? playerNames.playerX : playerNames.playerO;
    const winnerSymbol = winner === "X" ? "❌" : "⭕";
    status = `${winnerName}님이 승리하셨습니다! ${winnerSymbol}🎉`;
  } else {
    const currentPlayer = xIsNext ? playerNames.playerX : playerNames.playerO;
    const currentSymbol = xIsNext ? "❌" : "⭕";
    status = `다음 플레이어: ${currentPlayer} (${currentSymbol})`;
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board">
        {Array.from({length: boardSize}, (_, row) => (
          <div key={row} className="board-row">
            {Array.from({length: boardSize}, (_, col) => {
              const index = row * boardSize + col;
              return (
                <Square 
                  key={index}
                  value={squares[index]} 
                  onSquareClick={() => handleClick(index)} 
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [boardSize, setBoardSize] = useState(5);
  const [history, setHistory] = useState([Array(25).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerNames, setPlayerNames] = useState({ playerX: "플레이어 1", playerO: "플레이어 2" });
  const [showNameInput, setShowNameInput] = useState(false);
  
  const currentSquares = history[currentMove];

  function handleNameChange(player, newName) {
    setPlayerNames(prev => ({
      ...prev,
      [player]: newName
    }));
  }

  function toggleNameInput() {
    setShowNameInput(!showNameInput);
  }

  function changeGameMode(newSize) {
    setBoardSize(newSize);
    setHistory([Array(newSize * newSize).fill(null)]);
    setCurrentMove(0);
    setXIsNext(true);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button 
          onClick={() => jumpTo(move)}
          className={move === currentMove ? 'active' : ''}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="player-settings section">
        <h3>플레이어 설정</h3>
        <button className="btn" onClick={toggleNameInput}>
          {showNameInput ? '이름 설정 완료' : '플레이어 이름 변경'}
        </button>
        
        {showNameInput && (
          <div className="name-inputs">
            <div>
              <label>플레이어 1 (❌): </label>
              <input 
                type="text" 
                value={playerNames.playerX}
                onChange={(e) => handleNameChange('playerX', e.target.value)}
                placeholder="플레이어 1 이름"
              />
            </div>
            <div>
              <label>플레이어 2 (⭕): </label>
              <input 
                type="text" 
                value={playerNames.playerO}
                onChange={(e) => handleNameChange('playerO', e.target.value)}
                placeholder="플레이어 2 이름"
              />
            </div>
          </div>
        )}
      </div>

      <div className="game-mode-selector">
        <div className="button-group">
          <button className={boardSize === 5 ? 'active' : ''} onClick={() => changeGameMode(5)}>
            오목 (5x5)
          </button>
          <button className={boardSize === 7 ? 'active' : ''} onClick={() => changeGameMode(7)}>
            칠목 (7x7)
          </button>
          <button className={boardSize === 10 ? 'active' : ''} onClick={() => changeGameMode(10)}>
            십목 (10x10)
          </button>
        </div>
      </div>
      
      <div className="section game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardSize={boardSize} playerNames={playerNames} />
      </div>
      <div className="section game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, boardSize) {
  const lines = [];
  
  // 가로줄
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    lines.push(row);
  }
  
  // 세로줄
  for (let j = 0; j < boardSize; j++) {
    const col = [];
    for (let i = 0; i < boardSize; i++) {
      col.push(i * boardSize + j);
    }
    lines.push(col);
  }
  
  // 대각선
  const diagonal1 = [];
  const diagonal2 = [];
  for (let i = 0; i < boardSize; i++) {
    diagonal1.push(i * boardSize + i);
    diagonal2.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push(diagonal1, diagonal2);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstSquare = squares[line[0]];
    
    if (firstSquare && line.every(index => squares[index] === firstSquare)) {
      return firstSquare;
    }
  }
  
  return null;
}
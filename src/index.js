import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={{color:props.color}}>
      {props.value}
    </button>
  );

}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };

    this.checkMatch = this.checkMatch.bind(this);
  }

  checkMatch(i){
    return this.props.winnerVector[0] === i || this.props.winnerVector[1] === i || this.props.winnerVector[2] === i;
  }

  renderSquare(i) {
    return (
      <Square
        color={this.checkMatch(i) ? "#00f": "#000"}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard = () => {
    let board = [];
    const dimen = 3;

    for(let i = 0; i < dimen; ++i){
      board.push(this.createRow(i));
    }
    return board;
  }

  createRow = (rowIndex) => {
    let row = [];
    const length = 3;
    for(let i = 0; i< length; ++i) {
      let index = 3 * rowIndex + i;
      row.push(this.renderSquare(index))
    }

    return <div className="row">{row}</div>;
  }

  render() {
    return (
      <div>{this.createBoard()}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          location: Array(2).fill(null),
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      if(history.length === 10){
        console.log("match ended in a draw");
      }
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    const currentLocation = [Math.floor(i/3), Math.floor(i%3)];

    this.setState({
      history: history.concat([
        {
          location: currentLocation,
          squares: squares,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move # ' + move + " at location " + history[move].location[0] + "," + history[move].location[1]  :
          'Go to game start';

        const displayColor = this.state.stepNumber === move ? "#00f" : "#000";
      
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} style={{color:displayColor}}>{desc}</button>
          </li>
        );
      });

    let status;
    if (winner !== null) {
      status = "Winner : " + winner.mWinner + " vector " + winner.mVector;
    } else {
      status = "Next player : " + this.state.xIsNext ? "X" : "O";
    }


    return (
        <div className="game">
          <div className="game-board">
            <Board
              winnerVector={winner ? winner.mVector : [-1,-1,-1]}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {mWinner : squares[a], mVector : lines[i]};
    }
  }

  return null;
}
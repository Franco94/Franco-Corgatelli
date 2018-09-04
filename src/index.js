import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (<button className="square" onClick={props.onClick}>
    {props.value}
  </button>);
}

class Board extends React.Component {

  renderSquare(i) {
    return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>);
  }

  render() {
    return (<div>
      <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>);
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      winner: null
    };
  }

  handleClick(i) {

    //get history until actual stepNumber
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (!(this.state.winner || squares[i])) {
      // no winner and square empty

      squares[i] = this.state.xIsNext
        ? 'X'
        : 'O';

      //check for winnner
      const winner = calculateWinner(squares);

      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        //if no winner, this property does not change
        winner: winner
      });
    }
  }

  jumpTo(step) {
    //jump to any step
    const history = this.state.history;
    const current = history[step];
    //check for winner in that step
    const winner = calculateWinner(current.squares);

    this.setState({
      stepNumber: step,
      //set to true if step is even (X's turn)
      xIsNext: ((step % 2) === 0),
      //reset winner if necessary
      winner: winner
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let moves;
    let instructions;

    if (history.length > 1) {
      //map history of moves to  list items
      moves = history.map((step, move) => {
        const desc = move
          ? 'Go to move #' + move
          : 'Go to game start';
        return (<li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>);
      });
    } else {
      instructions = "Click any square to place your letter!"
    }

    let status;
    let winner = this.state.winner;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (
        this.state.xIsNext
        ? 'X'
        : 'O');
    }

    return (<div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
      </div>
      <div className="game-info">
        <div className="title">
          <h2 >
            Tic-Tac-Toe
          </h2>
        </div>
        <div>{status}</div>
        <div className="instructions">
          {instructions}
        </div>
        <ol>{moves}</ol>
      </div>
    </div>);
  }

}

// ========================================

ReactDOM.render(<Game/>, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [
      0, 1, 2
    ],
    [
      3, 4, 5
    ],
    [
      6, 7, 8
    ],
    [
      0, 3, 6
    ],
    [
      1, 4, 7
    ],
    [
      2, 5, 8
    ],
    [
      0, 4, 8
    ],
    [
      2, 4, 6
    ]
  ];
  let i = 0;
  let winner = null;

  while (i < lines.length && !winner) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winner = squares[a];
    }
    i++;
  }
  return winner;

}

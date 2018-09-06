import React from 'react';

import './index.css';
import Board from './components/Board';

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          rows: [
            Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)
          ],
          clicked: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      descendingOrder: true,
      winner: null,
      winnerSquares: null
    };
  }

  handleClick(row, col) {

    //get history until actual stepNumber
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //deep clone matrix
    const rows = JSON.parse(JSON.stringify(current.rows));

    if (!(this.state.winner || rows[row][col])) {
      // no winner and square empty

      rows[row][col] = this.state.xIsNext
        ? 'X'
        : 'O';

      //check for winnner
      const winner = calculateWinner(rows);

      this.setState({
        history: history.concat([
          {
            rows: rows,
            clicked: [row, col]
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        //if no winner, this properties do not change
        winner: winner[0],
        winnerSquares: winner[1]
      });
    }
  }

  jumpTo(step) {
    //jump to any step
    const history = this.state.history;
    const current = history[step];
    //check for winner in that step
    const winner = calculateWinner(current.rows);

    this.setState({
      stepNumber: step,
      //set to true if step is even (X's turn)
      xIsNext: ((step % 2) === 0),
      //reset winner if necessary
      winner: winner[0],
      winnerSquares: winner[1]
    })
  }

  toggleOrder() {
    this.setState({
      descendingOrder: !this.state.descendingOrder
    });
  }

  render() {
    const stepNumber = this.state.stepNumber;
    const history = this.state.history;
    //show history by the current step
    const current = history[stepNumber];

    let moves;
    let instructions;
    let toggle = 'v';
    let toggleButton;

    if (history.length > 1) {
      //map history of moves to list items
      moves = history.map((step, move) => {

        let buttonClass;
        let desc;
        let position = history[move].clicked;

        if (move === stepNumber) {
          //current
          buttonClass = "selected";
          desc = move
            ? 'Move #' + move + ' ' + JSON.stringify(position)
            : 'Game start';
        } else {
          desc = move
            ? 'Go to move #' + move + ' ' + JSON.stringify(position)
            : 'Go to game start';
          buttonClass = "unselected";
        }

        return (<li key={move}>
          <button className={buttonClass} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>);
      });

      //sort the moves in ascending order if toggle selected.
      if (!this.state.descendingOrder) {
        moves.sort(function(a, b) {
          return b.key - a.key;
        });
        toggle = 'ʌ';
      }

      toggleButton = (<button className="toggleButton" onClick={() => this.toggleOrder()}>
        {toggle}
        <span className="tooltiptext">Toggle order</span>
      </button>);

    } else {
      instructions = "Select any square to place your letter!"
    }

    let status;
    let winner = this.state.winner;

    if (winner) {
      status = 'Winner: ' + winner;

    } else if (stepNumber === 9) {
      //last possible step and no winner
      status = 'Draw!'

    } else {
      status = 'Next player: ' + (
        this.state.xIsNext
        ? 'X'
        : 'O');
    }

    return (<div className="game">
      <div className="game-board">
        <Board rows={current.rows} winnerSquares={this.state.winnerSquares} onClick={(row, col) => this.handleClick(row, col)}/>
      </div>
      <div className="game-info">
        <div className="title">
          <h2 >
            Tic-Tac-Toe
          </h2>
        </div>
        <div className="status">
          {status}
        </div>
        <div className="instructions">
          {instructions}
        </div>
        <div>
          {toggleButton}
        </div>
        <ol>
          {moves}
        </ol>
      </div>
    </div>);
  }
}

// ========================================
export default Game;

function calculateWinner(rows) {
  //input: board matrix
  //output: winner + winnerSquares or array of nulls is there is no winner

  const lines = [
    [
      [
        0, 0
      ],
      [
        0, 1
      ],
      [
        0, 2
      ]
    ],
    [
      [
        1, 0
      ],
      [
        1, 1
      ],
      [
        1, 2
      ]
    ],
    [
      [
        2, 0
      ],
      [
        2, 1
      ],
      [
        2, 2
      ]
    ],
    [
      [
        0, 0
      ],
      [
        1, 0
      ],
      [
        2, 0
      ]
    ],
    [
      [
        0, 1
      ],
      [
        1, 1
      ],
      [
        2, 1
      ]
    ],
    [
      [
        0, 2
      ],
      [
        1, 2
      ],
      [
        2, 2
      ]
    ],
    [
      [
        0, 0
      ],
      [
        1, 1
      ],
      [
        2, 2
      ]
    ],
    [
      [
        0, 2
      ],
      [
        1, 1
      ],
      [
        2, 0
      ]
    ]
  ];
  let i = 0;
  let winner = null;
  let winnerSquares = null;

  while (i < lines.length && !winner) {

    const [
      [
        a, b
      ], [
        c, d
      ], [
        e, f
      ]
    ] = lines[i];

    if (rows[a][b] && rows[a][b] === rows[c][d] && rows[a][b] === rows[e][f]) {
      winner = rows[a][b];
      winnerSquares = lines[i];
    }
    i++;
  }

  return [winner, winnerSquares];

}

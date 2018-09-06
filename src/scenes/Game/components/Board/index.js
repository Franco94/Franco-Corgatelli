import React from 'react';

import './index.css';
import Square from './components/Square';

class Board extends React.Component {

  renderSquare(row, col, winner) {
    return (<Square value={this.props.rows[row][col]} winner={winner} onClick={() => this.props.onClick(row, col)}/>);
  }

  render() {

    const board = this.props.rows;
    let squares = [];
    let row;
    let index = 0;
    let winner = false;
    let winnerSquares = this.props.winnerSquares;

    for (let i = 0; i < board.length; i++) {
      row = [];

      for (let j = 0; j < board[i].length; j++) {

        if (winnerSquares) {

          winner = false;
          let k = 0;
          while (k < winnerSquares.length && !winner) {

            if (winnerSquares[k][0] === i && winnerSquares[k][1] === j) {
              winner = true;
            }

            k++;
          }

        }

        //push squares into row
        row.push(<div key={index}>
          {this.renderSquare(i, j, winner)}
        </div>);

        index++;

      }
      //push rows into board
      squares.push(<div key={i} className="board-row">
        {row}
      </div>);

    }

    return (<div>
      {squares}
    </div>);
  }
}

// ========================================
export default Board;

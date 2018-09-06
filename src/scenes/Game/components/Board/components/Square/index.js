import React from 'react';
import './index.css';

function Square(props) {

  let highlighted = '';
  if (props.winner) {
    highlighted = ' highlighted';
  }

  return (<button className={"square" + highlighted} onClick={props.onClick}>
    {props.value}
  </button>);
}

// ========================================
export default Square;

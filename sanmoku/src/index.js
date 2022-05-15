import React from 'react';
import ReactDOM from 'react-dom/client'; // /client付けろって言われたので
import './index.css';

// propsってプロパティのことね

// Squareコンポーネントを関数コンポーネントで書き換えます

function Square(props){
  return (
    <button
      className = "square"
      onClick = {props.onClick} // 関数を関数で置き換えているみたいね
    >
      {props.value}
    </button> // 内部に表示内容を書く
  );
}

/*
class Square extends React.Component {
    render() {
      return (
        <button
          className="square"
          onClick = {() => { this.props.onClick(); } }
        >
          {this.props.value // 情報をpropsで受け取る }
        </button>
      );
    }
  }
*/
  class Board extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        squares: Array(9).fill(null),
        xIsNext: true, // 先手がXを書き込む
      }
    }
    handleClick(i){
      // イミュータブルにすることで履歴が取得できるなど数々の恩恵を得られる
      const squares = this.state.squares.slice(); // コピーを作っている！（指定しないsliceで）
      // 決着がついてる場合、もしくはクリックしたsquareが描画済みの場合は早期にreturnする
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = (this.state.xIsNext ? 'X' : 'O');
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext
      });
    }
    renderSquare(i) {
      return (
        <Square
          value = {this.state.squares[i]}
          onClick = {() => this.handleClick(i)}
        />
      ); // value = {i}とすることでvalueが渡される
    }
    // なるほど複数渡すときは半角スペース区切りなのね
  
    render() {
      const winner = calculateWinner(this.state.squares); // 勝者を表示
      let status;
      if(winner){
        status = 'Winner ' + winner;
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
      return (
        <div>
          <div className="status">{status}</div>
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
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);

  // =================utility================
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
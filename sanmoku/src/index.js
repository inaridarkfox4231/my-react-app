import React from 'react';
import ReactDOM from 'react-dom/client'; // /client付けろって言われたので
import './index.css';

// propsってプロパティのことね

// Squareコンポーネントを関数コンポーネントで書き換えます

function Square(props){
  return (
    <button
      className = "square" // classNameを定義してcssで装飾する
      onClick = {props.onClick} // 関数を関数で置き換えているみたいね
    >
      {props.value}
    </button> // 内部に表示内容を書く
  );
}

class Board extends React.Component {
  /* constructorを削除 */
  renderSquare(i) {
    return (
      <Square
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        key = {i} // こっちに！！！！！keyを！！！！書けって！！！！最初から！！！言えよ！！！！！
        // reference:https://ja.reactjs.org/docs/lists-and-keys.html
      />
    ); // value = {i}とすることでvalueが渡される
  }
  // なるほど複数渡すときは半角スペース区切りなのね

  render() {
    /* Gameコンポーネントで表示するように仕様変更 */
    /* ループで書くのは難しい... */
    const rIndices = [0, 1, 2];
    const cIndices = [0, 1, 2];
    return (
      <div>
        {rIndices.map((rIndex) => (
          <div className="board-row" key = {rIndex}>
            {cIndices.map((cIndex) => this.renderSquare(rIndex*3 + cIndex))}
          </div>
        ))}
      </div>
    );
  }
}
// 細かいことをいうとkeyにindexを使うのは推奨されないとか
// ただ今回要素が動かないのでそれでも問題ないですね。今回はね。
// 詳しくは：https://zenn.dev/luvmini511/articles/f7b22d93e9c182 を参照してください。
// 疲れた！！

// ああそうか
// historyの各成分が情報持ってなかったわ。...
// reverseをonoffする感じ

  class Game extends React.Component {
    constructor(props){
      super(props);
      // hand: 最後に打たれた手の情報
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          hand: null,
          stepId:0
        }],
        stepNumber:0,
        xIsNext: true,
        reverse: false
      }
    }
    handleClick(i){
      // イミュータブルにすることで履歴が取得できるなど数々の恩恵を得られる
      const history = this.state.history.slice(0, this.state.stepNumber + 1); // この時点ではまだstepNumberが更新されてないので1を足す
      const current = history[history.length - 1];
      const squares = current.squares.slice(); // コピーを作っている！（指定しないsliceで）
      // 決着がついてる場合、もしくはクリックしたsquareが描画済みの場合は早期にreturnする
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = (this.state.xIsNext ? 'X' : 'O');
      const playerIsX = this.state.xIsNext; // プレイヤーはXですよの情報
      const currentHand = {row: Math.floor(i / 3), col: i % 3, isX: playerIsX}; // そのターンにおかれた手数
      this.setState({
        history: history.concat([{ // concatは元の配列をmutateしない. pushでは無くこれを使うと。
          squares: squares,
          hand: currentHand,
          stepId: history.length
        }]),
        stepNumber: history.length,
        xIsNext: !playerIsX
      });
    }
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
    inverse(flag){
      // 並び順を逆にする
      this.setState({
        reverse: !flag
      });
    }
    render() {
      let history = this.state.history.slice();
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      // 現在の手までの履歴表示
      const historyUntilCurrent = this.state.history.slice(1, this.state.stepNumber+1);
      const historyOfHands = historyUntilCurrent.map((step, eachMove) => {
        const hand = historyUntilCurrent[eachMove].hand;
        const handInfo = (hand.isX ? 'X' : 'O') + ": (" + hand.row + ", " + hand.col + ")";
        return <li key = {eachMove}>{handInfo}</li> // keyが必要だそうで...追加です。
      });

      // やったことその1: historyを逆順にする
      if(this.state.reverse){
        history.sort((h1, h2) => h1.stepId - h2.stepId);
      }
  
      const moves = history.map((step, move) => {
        // descはdescriptionの意味でよく用いられますね
        // やったことその2: moveの順番を逆にする。この2つだけ。
        if(this.state.reverse){
          move = history.length - 1 - move;
        }
        const desc = move ? 
          'Go to move #' + move:
          'Go to game start';
        // keyの設定...よくわかんないけど何だろ、修正不能な識別子のようなものらしいです。
        // タグ内での条件分岐は即時関数で表現すればいいみたい（参考：https://www.yoheim.net/blog.php?q=20180409）
        // {(() => {if(move === this.state.stepNumber){ return <div>ほげ～～</div> }})()} こんな感じ
        // もしくは関数コンポーネント...を、使う？？
        // {条件&&コンポーネント}ってやると条件がtrueのときだけ描画されるんだって
        // {move === this.state.stepNumber && <div>ほげ～～</div>}
        // でも最終的には関数コンポーネントのやり方になるかなぁ（内容が内容だけに）
        // よくわかんないけどこれでいいみたい↓

        // 練習だから関数で書いたけど短すぎるね...サクッと書いちゃえば、、でも練習だからね

        function showHistoryOfHands(stepNumber){
          if(move !== stepNumber){ return <div></div> }
          // 以下で履歴を表示してみる感じ
          // historyにはその辺の履歴が入ってないので、盤面の履歴とは別に、手の履歴が必要で、それを参照しないと表示できないわけです。
          // とはいえ別に複雑なことは必要なくってhistoryの成分にプロパティ追加するだけでいいと思う
          // rowとcolとばつまる情報の3つね
          return <ol>{historyOfHands}</ol>
        }
        function showDescription(stepNumber, desc){
          if(move !== stepNumber){ return <div>{desc}</div>; }
          return <b>{desc}</b>;
        }

        return (
          <li key = {move}>
            <button onClick = {() => this.jumpTo(move)}>
              {showDescription(this.state.stepNumber, desc)}
            </button>
            {showHistoryOfHands(this.state.stepNumber)}
          </li>
        );
      });

      let status;
      if(winner){
        status = 'Winner ' + winner;
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares = {current.squares}
              onClick = {i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick = {() => this.inverse(this.state.reverse)}>順番を反転させる</button>
            <ol>{moves}</ol>
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
  
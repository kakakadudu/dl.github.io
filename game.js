var config = {
  width: 520,
  height: 520,
  rows: 3,
  cols: 3,
  src: "./main/greenCat.png",
  dom: document.getElementById("game"),
  isOver: false,
}
config.pieceWidth = config.width / config.cols;
config.pieceHeight = config.height / config.rows;


var blocks = [];

class Block {
  constructor(left, top, isHidden) {
    // 格子的当前位置
    this.left = left;
    this.top = top;
    // 格子的正确位置
    this.correctLeft = this.left;
    this.correctTop = this.top;
    this.isHidden = isHidden;// 是否隐藏格子
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.width = config.pieceWidth + "px";
    this.dom.style.height = config.pieceHeight + "px";
    this.dom.style.background = `url(${config.src}) -${this.left}px -${this.top}px`;
    this.dom.style.boxSizing = "border-box";
    this.dom.style.cursor = "pointer";
    this.dom.style.border = "1px solid #fff";
    this.show();
    if (this.isHidden) {
      this.hide();
    }
    config.dom.appendChild(this.dom);
  }
  show() {
    this.dom.style.left = this.left + "px";
    this.dom.style.top = this.top + "px";
  }
  hide() {
    this.dom.style.display = "none";
  }
  // 判断格子的位置是否正确
  isCorrect() {
    return isEuqal(this.left, this.correctLeft) && isEuqal(this.top, this.correctTop);
  }
}

/**
 * 产生一个 {min,max} 的随机数，可以取到 max
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

/**
 * 判断两个数字是否相等
 * @param {number} num1
 * @param {number} num2
 * @returns 
 */
function isEuqal(num1, num2) {
  return parseInt(num1) === parseInt(num2);
}

init();
function init() {
  // 1.初始化拼图容器
  initWrap();
  // 2.初始化拼图格子
  // 2.1 初始化每个格子的信息
  initPieceInfo();
  // 2.2 打乱格子的顺序
  shuffle();
  // 2.3 注册点击事件
  bindEvent();

  function isWin() {
    let isWin = blocks.every(item => item.isCorrect());
    if (isWin) {
      console.log("===== 胜利了✌️ =====");
      config.isOver = true;
      blocks.forEach(b => {
        b.dom.style.display = "block";
        b.dom.style.border = "none";
      })
    }
  }

  function bindEvent() {
    const hidePiece = blocks.find(item => !!item.isHidden);
    blocks.forEach(function (b) {
      b.dom.onclick = function () {
        if (config.isOver) {
          return;
        }
        // 相邻才可交换
        if (
          isEuqal(hidePiece.top, b.top) && isEuqal(Math.abs(hidePiece.left - b.left), config.pieceWidth) ||
          isEuqal(hidePiece.left, b.left) && isEuqal(Math.abs(hidePiece.top - b.top), config.pieceHeight)
        ) {
          // 点击时与隐藏的格子交换
          exchange(b, hidePiece);
          isWin();
        }
      }
    })
  }

  function shuffle() {
    for (let i = 0; i < blocks.length - 2; i++) {
      // 随机产生一个坐标，与之交换
      const index = getRandom(0, blocks.length - 2);
      exchange(blocks[i], blocks[index]);
    }
  }

  /**
   * 将 b1 和 b2 交换
   * @param {*} b1 
   * @param {*} b2 
   */
  function exchange(b1, b2) {
    let temp = b1.top;
    b1.top = b2.top;
    b2.top = temp;
    temp = b1.left;
    b1.left = b2.left;
    b2.left = temp;
    b1.show();
    b2.show();
  }

  function initPieceInfo() {
    for (let i = 0; i < config.rows; i++) {
      for (let j = 0; j < config.cols; j++) {
        let isHidden = i === config.rows - 1 && j === config.cols - 1;
        let b = new Block(j * config.pieceWidth, i * config.pieceHeight, isHidden);
        blocks.push(b);
      }
    }
  }
  function initWrap() {
    config.dom.style.width = config.width + "px";
    config.dom.style.height = config.height + "px";
    config.dom.style.border = "2px solid #ccc";
    config.dom.style.position = "relative";
  }
}
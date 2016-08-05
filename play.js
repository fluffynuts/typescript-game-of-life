var
  ansi = require('ansi'),
  context = require('axel'),
  keypress = require('keypress'),
  _ = require('lodash'),
  cursor = ansi(process.stdout),
  rows = process.stdout.rows,
  cols = process.stdout.columns;

function createBoardFor() {
  return _.range(0, rows).reduce((acc, cur) => {
    var row = _.range(0, cols).reduce((acc, cur) => {
      acc.push(0)
      return acc
    }, [])
    acc.push(row);
    return acc;
  }, [])
}

function createRandomBoardLike(board) {
  // for now, randomize; later, GOL
  const result = []
  board.forEach(row => {
    const thisRow = []
    _.range(0, row.length).forEach(i => {
      thisRow.push(Math.random() < 0.8 ? 0 : 1);
    })
    result.push(thisRow)
  })
  return result;
}

const
  alive = '█',
  dead = '░'

const colors = [
  'brightGreen',
  'brightRed',
  'brightBlue'
];

function selectRandomColor() {
  var selected = colors[Math.round(Math.random() * (colors.length - 1))]
  cursor.fg[selected]();
}

function render(thisBoard, lastBoard) {
  cursor.bg.black();
  cursor.fg.brightGreen();
  thisBoard.forEach((row, y) => {
    cursor.goto(0, y)
    row.forEach((cell, x) => {
      cursor.write(cell ? alive: dead);
    });
  })
  restore()
}

busy = false;
function update(board, generator) {
  try {
    if (busy) {
      return board;
    }
    busy = true;
    var newBoard = generator(board);
    render(newBoard, board);
    return newBoard;
  } catch (e) {
    clear();
    console.log(e.stack);
    process.exit(1);
  } finally {
    busy = false;
  }
}

function start(board, generator) {
  return setInterval(() => {
    board = update(board, generator);
  }, 50);
}

function shouldExit(key) {
  return key && (key.name === 'escape' ||
                  (key.name === 'c' && key.ctrl))
}

function watchForExit(token) {
  process.stdin.setRawMode(true);
  keypress(process.stdin);
  process.stdin.resume();
  process.stdin.on('keypress', function(char, key) {
    if (shouldExit(key)) {
      clearInterval(token);
      clear();
      process.exit(0);
    }
  })
}

function restore() {
  cursor.reset();
  cursor.goto(0, 0);
}
function clear() {
  console.log('\033[2J');
}

function play(generator) {
  clear();

  var
    emptyBoard = createBoardFor(cursor),
    board = createRandomBoardLike(emptyBoard),
    token = start(board, generator);
  watchForExit(token);
}

if (require.main === module) {
  play(createRandomBoardLike);
}

module.exports = {
  play: play
}
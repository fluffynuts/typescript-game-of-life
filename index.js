var
  tick = require('./js/src/game_of_life').tick
  play = require('./play').play;
console.log(tick);
play(tick);

'use strict';

module.exports = new class {
  getRandom(grid) {
    let array =
      [
        {x:0, y:0},{x:0, y:1},{x:0, y:2},{x:0, y:3},{x:0, y:4},
        {x:1, y:0},{x:1, y:1},{x:1, y:2},{x:1, y:3},{x:1, y:4},
        {x:2, y:0},{x:2, y:1},{x:2, y:2},{x:2, y:3},{x:2, y:4},
        {x:3, y:0},{x:3, y:1},{x:3, y:2},{x:3, y:3},{x:3, y:4},
        {x:4, y:0},{x:4, y:1},{x:4, y:2},{x:4, y:3},{x:4, y:4},
      ];
    let count = 1;
    while (array.length !== 0) {
      let random = Math.floor(Math.random() * array.length);
      grid[array[random].x][array[random].y].val = count;
      array.splice(random, 1);
      count++;
    }
    return grid;
  }
};

'use strict';

module.exports = new class {
  pickRandom(grid) {
    console.log('inside the random pick');
    let empty = [];
    for (let i = 0; i < grid.length; i++) {
      for (let y = 0; y < grid[i].length; y++) {
        if (grid[i][y].mark === false) {
          empty.push({i,y});
        }
      }
    }
    let picked = Math.floor(Math.random() * Math.floor(empty.length));
    return empty[picked];
  }
};

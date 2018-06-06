'use strict';

module.exports = new class {
  checkWinner(grid) {
    if (grid.length !== grid[0].length) return 'need to be a square';
    let holder = [];
    for (let i = 0; i < grid.length; i++) {
      // check across
      if (grid[i][0].mark === true) {
        let test = this.checkAcross(grid[i]);
        if (test === 'winner') {
          holder.push(test);
        }
      }

      //check down
      if (grid[0][i].mark === true) {
        let test = this.checkDown(grid, i);
        if (test === 'winner') {
          holder.push(test);
        }
      }
    }

    // check diagonal
    if (grid[0][0].mark === true) {
      let test = this.checkDiagonalTD(grid);
      if (test === 'winner') {
        holder.push(test);
      }
    }
    if (grid[grid.length -1][0].mark === true) {
      let test = this.checkDiagonalBU(grid);
      if (test === 'winner') {
        holder.push(test);
      }
    }

    if (holder.length >= 5) {
      return 'winner';
    }
    // if (holder.length >= 1) {
    //   return 'winner';
    // }
  }


  checkDown(grid, start, count=grid.length) {
    if (count === 0) {
      return 'winner';
    }
    if (grid[0][start].mark === grid[count - 1][start].mark) {
      count--;
      return this.checkDown(grid, start, count);
    } else {
      return 'sorry';
    }
  }

  checkDiagonalTD(grid, count=grid.length) {
    if (count === 0) {
      return 'winner';
    }
    if (grid[0][0].mark === grid[count - 1][count - 1].mark) {
      count--;
      return this.checkDiagonalTD(grid, count);
    } else {
      return 'sorry';
    }
  }

  checkDiagonalBU(grid, count=grid.length, top=0) {
    if (count === 0) {
      return 'winner';
    }
    if (grid[grid.length - 1][0].mark === grid[top][count - 1].mark) {
      top++;
      count--;
      return this.checkDiagonalBU(grid, count, top);
    } else {
      return 'sorry';
    }
  }

  checkAcross(grid, count=grid.length) {
    if (count === 0) {
      return 'winner';
    }
    if (grid[count - 1].mark === grid[0].mark) {
      count--;
      return this.checkAcross(grid, count);
    } else {
      return 'sorry';
    }
  }
};

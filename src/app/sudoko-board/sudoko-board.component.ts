import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sudoko-board',
  templateUrl: './sudoko-board.component.html',
  styleUrls: ['./sudoko-board.component.css'],
})
export class SudokoBoardComponent implements OnInit {
  board: number[][];
  cellStatus: string[][];

  ngOnInit(): void {
    this.generateSudokoPuzzle();
    this.initializeCellStatus();
  }

  generateSudokoPuzzle(): void {
    this.board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));

    // const puzzle = [
    //   [5, 3, 0, 0, 7, 0, 0, 0, 0],
    //   [6, 0, 0, 1, 9, 5, 0, 0, 0],
    //   [0, 9, 8, 0, 0, 0, 0, 6, 0],
    //   [8, 0, 0, 0, 6, 0, 0, 0, 3],
    //   [4, 0, 0, 8, 0, 3, 0, 0, 1],
    //   [7, 0, 0, 0, 2, 0, 0, 0, 6],
    //   [0, 6, 0, 0, 0, 0, 2, 8, 0],
    //   [0, 0, 0, 4, 1, 9, 0, 0, 5],
    //   [0, 0, 0, 0, 8, 0, 0, 7, 9],
    // ];
    const puzzle = [
      [0, 0, 3, 0, 2, 0, 6, 0, 0],
      [9, 0, 0, 3, 0, 5, 0, 0, 1],
      [0, 0, 1, 8, 0, 6, 4, 0, 0],
      [0, 0, 8, 1, 0, 2, 9, 0, 0],
      [7, 0, 0, 0, 0, 0, 0, 0, 8],
      [0, 0, 6, 7, 0, 8, 2, 0, 0],
      [0, 0, 2, 6, 0, 9, 5, 0, 0],
      [8, 0, 0, 2, 0, 3, 0, 0, 9],
      [0, 0, 5, 0, 1, 0, 3, 0, 0],
    ];
    this.board = puzzle;
  }

  handleCellClick(rowIndex: number, colIndex: number): void {
    console.log(rowIndex, colIndex);
    //log row values and col values
    console.log('row', this.board[rowIndex]);
    console.log(
      'col',
      this.board.map((row) => row[colIndex])
    );
    //log 3x3 grid values
    const rowStart = Math.floor(rowIndex / 3) * 3;
    const colStart = Math.floor(colIndex / 3) * 3;
    const subGrid = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        subGrid.push(this.board[rowStart + i][colStart + j]);
      }
    }
    console.log('subgrid', subGrid);
  }

  initializeCellStatus(): void {
    this.cellStatus = Array(9)
      .fill(null)
      .map(() => Array(9).fill(''));
  }

  isCellDisabled(rowIndex: number, cellIndex: number): boolean {
    return this.board[rowIndex][cellIndex] !== 0;
  }

  validateBoard(): boolean {
    //Checking all cells are filled
    for (let row of this.board) {
      if (row.includes(0)) {
        return false;
      }
    }

    // Validating rows
    for (let row of this.board) {
      if (!this.isValidGroup(row)) {
        return false;
      }
    }

    // for (let row of this.board) {
    //   if (!this.isValidGroup(row)) {
    //     return false;
    //   }
    // }

    // // Validating columns

    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const column = this.board.map((row) => row[colIndex]);
      if (!this.isValidGroup(column)) {
        return false;
      }
    }

    // // Validating 3x3 grids
    for (let rowStart = 0; rowStart < 9; rowStart += 3) {
      for (let colIndex = 0; colIndex < 9; colIndex += 3) {
        const subGrid = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            subGrid.push(this.board[rowStart + i][colIndex + j]);
          }
        }

        if (!this.isValidGroup(subGrid)) {
          return false;
        }
      }
    }

    return true;
  }

  private isValidGroup(group: number[]): boolean {
    const seen = new Set<number>();
    for (let num of group) {
      if (num === 0) continue;
      if (seen.has(num)) {
        return false;
      }
      seen.add(num);
    }
    return true;
  }

  handleUserInput(rowIndex: number, cellIndex: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const num = parseInt(input.value, 10);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      this.board[rowIndex][cellIndex] = num;

      // if (!this.validateBoard()) {
      //   alert('Invalid Move,Check your input');
      //   this.board[rowIndex][cellIndex] = 0;
      // } else {
      //   alert('Please enter a number between 1 and 9.');
      //   this.board[rowIndex][cellIndex] = 0;
      // }
    }
    if (isNaN(num) || num < 1 || num > 9) {
      this.cellStatus[rowIndex][cellIndex] = 'invalid'; // Mark invalid
      input.value = ''; // Clear invalid input
    } else {
      this.cellStatus[rowIndex][cellIndex] = ''; // Clear invalid flag
      this.board[rowIndex][cellIndex] = num;

      
    }

    // if (!isNaN(num) && num >= 1 && num <= 9) {
    //   this.board[rowIndex][cellIndex] = num;
    //   this.cellStatus[rowIndex][cellIndex] = ''; // Clear invalid status
    //   if (this.validateBoard()) {
    //     console.log('Correct Move');
    //   }
    // } else {
    //   this.board[rowIndex][cellIndex] = 0; // Reset invalid input
    //   this.cellStatus[rowIndex][cellIndex] = 'invalid'; // Mark as invalid
    // }
  }

  trackByIndex(index: number): number {
    return index;
  }

  winCalculationHandler(): void {
    const isComplete = this.board.every((row) =>
      row.every((cell) => cell !== 0)
    );
    if (!isComplete) {
      alert('You Lose! The board is incomplete');
    } else if (this.validateBoard()) {
      alert('You Win! The board is complete');
    } else {
      alert('You Lose! The board is incorrect');
    }
  }

  resetGameHandler(): void {
    this.board = [];
    this.generateSudokoPuzzle();
  }
}

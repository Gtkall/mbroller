import { Component, OnInit, Type } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum whoWon { 'The Good Guys won!!!', 'The Bad Guys won :(', 'It\'s a tie.'}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  goodValue: number;
  goodRolls: number[];
  badValue: number;
  badRolls: number[];
  result: string;
  casualties: number;

  constructor(
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.goodValue = 0;
    this.goodRolls = [];
    this.badValue = 0;
    this.badRolls = [];
    this.result = 'No results yet';
    this.casualties = 0;
  }

  valueIncr(value: 'good' | 'bad') {
    switch (value) {
      case 'good': {
        this.goodValue++;
        break;
      }
      case 'bad': {
        this.badValue++;
        break;
      }
    }
  }

  valueDecr(value: 'good' | 'bad') {
    switch (value) {
      case 'good': {
        this.goodValue--;
        break;
      }
      case 'bad': {
        this.badValue--;
        break;
      }
    }
  }

  resolve() {
    this.result = whoWon[this.battle()];
    this.openSnackBar(this.result);
  }

  // TODO: revert to double openSnackBar methods
  showCasualties() {
    this.openSnackBar(this.casualties);
  }

  battle(): number {
    this.goodRolls = this.roll(this.goodValue);
    this.badRolls = this.roll(this.badValue);
    const goodRolls = this.sort(this.goodRolls);
    const badRolls = this.sort(this.badRolls);
    const lessRolls = this.goodRolls.length < this.badRolls.length ? this.goodRolls.length : this.badRolls.length;

    // check who won from the sorted arrays
    for (let i = 0; i < lessRolls; i++) {
      if (goodRolls[i] > badRolls[i]) {
        this.casualties = this.determineCasualties(goodRolls, badRolls[0]);
        return 0;
      } else if (badRolls[i] > goodRolls[i]) {
        this.casualties = this.determineCasualties(badRolls, goodRolls[0]);
        return 1;
      }
    }
    if (goodRolls.length === badRolls.length) {
      return 2;
    }
    if (goodRolls.length > badRolls.length) {
      this.casualties = this.determineCasualties(goodRolls, badRolls[0]);
    } else {
      this.casualties = this.determineCasualties(badRolls, goodRolls[0]);
    }
    return goodRolls.length > badRolls.length ? 0 : 1;
  }

  roll(times: number) {
    const rolls = [];
    for (let i = 0; i < times; i++) {
      rolls.push(Math.floor(Math.random() * 20) + 1);
    }
    return rolls;
  }

  sort(rolls: number[]) {
    return rolls.sort((a, b) => b - a);
  }

  clear() {
    this.ngOnInit();
  }

  determineCasualties(winners: number[], losersTopRoll: number): number {
    let casualties = 0;
    winners.forEach(element => {
      if (element < losersTopRoll / 2) {
        casualties++;
      }
    });
    return casualties;
  }

  openSnackBar(message: number | string) {
    switch (typeof message) {
      case 'string': {
        this.snackBar.open(`${message}`, 'Dismiss', {duration: 5000, verticalPosition: 'bottom'});
        break;
      }
      case 'number': {
        this.snackBar.open(`${message} Casualties`, 'Dismiss', {duration: 5000, verticalPosition: 'bottom'});
        break;
      }
    }
  }
}

import React, { Component } from 'react';
import './App.css';
import Board from './Board';


// WIP
const fakeDatebase = {
  games: {},
  players: {
    0: 'Aurélie',
    1: 'Eliott',
    2: 'Matthieu',
    3: 'Jean Guillaume',
    4: 'Jordan'
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const points = {
  0: 0.0,
  1: 0.5,
  2: 1.0,
  3: 0.5,
  4: 0.0
}

function calculateFloats(cards) {
  const numberOfFloats = cards.reduce(
    (totalFloats, card) => totalFloats + points[Math.floor((card - 1)/12)], 0)

  return Math.ceil(numberOfFloats);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null
    }
    this.createGame = this.createGame.bind(this);
  }

  createGame() {
    const cards = shuffle(Array.from({length: 60}, (v, k) => k+1));
    const waterLevels1 = shuffle(Array.from({length: 12}, (v, k) => k+1));
    const waterLevels2 = shuffle(Array.from({length: 12}, (v, k) => k+1));

    const players = [
      {id: 0, name: 'Aurélie', waterLevel: 0},
      {id: 1, name: 'Matthieu', waterLevel: 0},
      {id: 2, name: 'Jean Guillaume', waterLevel: 0},
      {id: 3, name: 'Eliott', waterLevel: 0},
      {id: 4, name: 'Loic', waterLevel: 0}
    ]

    players.forEach(((player, i) => {
      const totalFloats = calculateFloats(cards.slice(i * 12, (i + 1) * 12));
      players[i].totalFloats = totalFloats;
      players[i].remainingFloats = totalFloats;
    }));

    // TODO: EDIT FAKEDATABASE INSTEAD
    this.setState({
      game: {
        hand: cards.slice(0, 12),
        waterLevels1,
        waterLevels2,
        players,
        bets: players.map(player => ({ card: null, playerId: player.id, playerName: player.name })),
      }
    })
  }

  playCard() {
    //TODO
  }

  computeTurn() {
    //TODO
  }

  render() {
    return this.state.game ? (
        <Board game={this.state.game}></Board>
    ) : (
      <div className="app-container">
        <button className="primary" onClick={this.createGame}>Create a game</button>
      </div>
    );
  }
}

export default App;

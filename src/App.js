import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import GameService from './services/game';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      user: {id: '0', name: 'Aurélie'}
    }
    this.gameService = new GameService();
    this.createGame = this.createGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  createGame() {
    this.gameId = this.gameService.createGame(this.state.user)
    this.gameSubscription = this.gameService.getGame(this.gameId).subscribe(game => {
      this.setState({game})
      if (game && game.bets && Object.values(game.bets).filter(bet => !bet).length === 0) {
        this.computeTurn();
      }
    })
    const players = [
      { id: '1', name: 'Mathieu' },
      { id: '2', name: 'Alex' },
      { id: '3', name: 'Eliot' },
      { id: '4', name: 'Jean-Phillipe' }
    ]
    const addPlayers = () => {
      setTimeout(() => {
        this.gameService.fakeJoin(this.gameId, players.pop())
        if (players.length > 0) {
          addPlayers();
        }
      }, 1000)
    }
    addPlayers();
  }

  startGame() {
    this.gameService.startGame(this.gameId);
  }

  joinGame() {}

  selectCard(card) {
    this.gameService.selectCard(this.gameId, this.state.user.id, card);
    for (let i = 1; i < 5; i++) {
      this.gameService.selectCard(this.gameId, i, this.state.game.players[i].hand[0])
    }
  }

  computeTurn() {
    this.gameService.computeTurn(this.gameId);
  }

  render() {
    if (!this.state.game) {
      return (
        <div className="app-container">
          <button className="primary" onClick={this.createGame}>Create a game</button>
        </div>
      )
    }
    if (this.state.game.status === 'waiting') {
      return (
        <div className="app-container">
          <div>Wait start of the game</div>
          <h3>List of players</h3>
          <ul>
            {this.state.game.players.map(player => (
              <li key={player.id}>{player.name} {player.id === this.state.user.id ? '(me)' : ''}</li>
            ))}
          </ul>
          {this.state.game.adminId === this.state.user.id
            ? <button className="primary" onClick={this.startGame}>Start the game</button>
            : null
          }
        </div>
      )
    } else if (this.state.game.status === 'playing') {
      return <Board game={this.state.game} userId={this.state.user.id} selectCard={this.selectCard}></Board>
    } else {
      return <div>Invalid game</div>
    }
  }

  componentWillUnmount() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe()
    }
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import CreateGameForm from './CreateGameForm';
import JoinGameForm from './JoinGameForm';
import GameService from './services/game';
import UserService from './services/user';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null
    }
    this.gameService = new GameService();
    this.userService = new UserService();
    this.createGame = this.createGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.copyGameId = this.copyGameId.bind(this);
  }

  createGame(pseudo) {
    const user = {
      ...this.state.user,
      name: pseudo
    }
    this.gameId = this.gameService.createGame(user);
    this.setState({user})
    if (window && window.sessionStorage) {
      window.sessionStorage.setItem('currentGameId', this.gameId);
    }

    this.loadGame(this.gameId);
  }

  loadGame(gameId) {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
    this.gameSubscription = this.gameService.getGame(gameId).subscribe(game => {
      this.setState({game});

      // Move this part to a firebase function ??
      if (!game || !game.bets) return;
      if (game.adminId !== this.state.user.id) return;
      const nbPlayersWithBet = Object.values(game.bets).filter(bet => bet).length;
      const nbActivePlayers = game.players.filter(player => player.active).length;
      if (nbPlayersWithBet === nbActivePlayers) {
        this.gameService.computeTurn(gameId);
      }
    })
  }

  startGame() {
    this.gameService.startGame(this.gameId);
  }

  joinGame(gameId, pseudo) {
    const user = {
      ...this.state.user,
      name: pseudo
    }
    this.setState({user});
    this.gameService.joinGame(gameId, user);
    //TODO: check if the id exist.
    this.gameId = gameId;
    this.loadGame(gameId);
  }

  selectCard(card) {
    this.gameService.selectCard(this.gameId, this.state.user.id, card);
  }

  copyGameId() {
    const textarea = document.createElement("textarea");
    textarea.textContent = this.gameId;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  render() {
    if (!(this.state.user && this.state.user.id)) {
      return <div>Connected to the server...</div>
    }
    if (!this.state.game) {
      return (
        <div className="app-container">
          <CreateGameForm onSubmit={this.createGame}></CreateGameForm>
          <br/>
            OR
          <br/>
          <br/>
          <JoinGameForm onSubmit={this.joinGame}></JoinGameForm>
        </div>
      )
    }
    if (this.state.game.status === 'waiting') {
      return (
        <div className="app-container">
          <h3>Wait start of the game</h3>
          {this.state.game.adminId === this.state.user.id ?
            (
              <div className="game-info">
                <div>Id to communicate to other players:</div>
                <div className="game-id">{this.gameId}</div>
                <button className="primary" onClick={this.copyGameId}>Copy</button>
              </div>
            ) : null
          }
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
      this.gameSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  componentDidMount() {
    if (window && window.sessionStorage) {
      const gameId = window.sessionStorage.getItem('currentGameId');
      if (gameId) {
        this.gameId = gameId;
        this.loadGame(gameId);
      }
    }
    this.userSubscription = this.userService.user.subscribe(user => {
      this.setState({
        user: user ? { id: user.uid } : null
      })
    })
  }
}

export default App;

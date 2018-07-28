import React, { Component } from 'react';
import './BetZone.css';

class BetZone extends Component {

  constructor(props) {
    super(props);
    this.getBetValueContainerClass = this.getBetValueContainerClass.bind(this)
  }

  getBetValueContainerClass(bet, hasEverybodyPlayed, isActive) {
    let className = 'bet-value-container';
    if (!isActive) {
      return className += ' inactive';
    }
    if (bet) {
      className += ' played'
    }
    if (hasEverybodyPlayed) {
      const [max, secondMax] = Object.values(this.props.bets).sort((a, b) => a < b ? 1 : - 1);
      if (bet === max) {
        className += ' king';
      }
      else if (bet === secondMax) {
        className += ' prince'
      }
    }

    return className;
  }

  render() {
    const nbActivePlayers = this.props.players.filter(player => player.active).length;
    const nbBets = Object.values(this.props.bets).filter(bet => bet).length;
    const hasEverybodyPlayed = nbActivePlayers === nbBets;
    return (
      <div className="bet-zone">
        <div className={(hasEverybodyPlayed ? 'display-bet' : '') + ' bets'}>
          {Object.keys(this.props.bets).map(playerId => {
            const containerClass = this.getBetValueContainerClass(
              this.props.bets[playerId],
              hasEverybodyPlayed,
              this.props.players[playerId].active
            )
            return (
              <div className="bet" key={playerId}>
                <div className={containerClass}>
                  <span className="bet-value">{this.props.bets[playerId]}</span>
                </div>
                <div className="bet-player">{this.props.players[playerId].name}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default BetZone;
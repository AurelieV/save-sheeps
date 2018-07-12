import React, { Component } from 'react';
import './BetZone.css';

class BetZone extends Component {

  constructor(props) {
    super(props);
    this.getBetValueContainerClass = this.getBetValueContainerClass.bind(this)
  }

  getBetValueContainerClass(bet, hasEverybodyPlayed) {
    let className = 'bet-value-container';
    if (bet.card) {
      className += ' played'
    }
    if (hasEverybodyPlayed) {
      const [max, secondMax] = this.props.bets.map(bet => bet.card).sort((a, b) => a < b ? 1 : - 1);
      if (bet.card === max) {
        className += ' king';
      }
      else if (bet.card === secondMax) {
        className += ' prince'
      }
    }

    return className;
  }

  render() {
    const hasEverybodyPlayed = this.props.bets.filter(bet => bet.card).length > 0;
    return (
      <div className="bet-zone">
        <div className={(hasEverybodyPlayed ? 'display-bet' : '') + ' bets'}>
          {this.props.bets.map(bet => (
            <div className="bet" key={bet.playerId}>
              <div className={this.getBetValueContainerClass(bet, hasEverybodyPlayed)}>
                <span className="bet-value">{bet.card}</span>
              </div>
              <div className="bet-player">{bet.playerName}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default BetZone;
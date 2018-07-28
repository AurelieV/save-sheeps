import React, { Component } from 'react';
import BetZone from './BetZone';
import './Board.css';
import Hand from './Hand';
import waterIcon from './icons/water.svg';
import PlayerStatus from './PlayerStatus';

class Board extends Component {
  render() {
    const highestWaterLevel = Math.max(...this.props.game.players.filter(p => p.active).map(p => p.waterLevel));
    const canPlay = this.props.game.players[this.props.userId].active &&
      Object.values(this.props.game.bets).filter(bet => !bet).length > 0;

    return (
      <div className="board">
        <div className="player-statuses">
          {this.props.game.players.map(player =>
            <PlayerStatus
              player={player}
              key={player.id}
              hasHighestWaterLevel={player.waterLevel && player.waterLevel === highestWaterLevel}>
            </PlayerStatus>
          )}
        </div>
        <div className="water-levels">
          <div className="water-level">
            <span>{this.props.game.waterLevels1[0]}</span>
            <img src={waterIcon} alt="waterIcon"></img>
          </div>
          <div className="water-level">
            <span>{this.props.game.waterLevels2[0]}</span>
            <img src={waterIcon} alt="waterIcon"></img>
          </div>
        </div>
        <BetZone bets={this.props.game.bets} players={this.props.game.players}></BetZone>
        <Hand
          cards={this.props.game.players[this.props.userId].hand}
          selectedCard={this.props.game.bets[this.props.userId]}
          selectCard={this.props.selectCard}
          canPlay={canPlay}>
        </Hand>
      </div>
    )
  }
}

export default Board;
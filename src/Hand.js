
import React, { Component } from 'react';
import './Hand.css';

const colors = {
  0: 'yellow',
  1: 'chartreuse',
  2: 'dodgerblue',
  3: 'blueviolet',
  4: 'red'
}
class Hand extends Component {
  constructor(props) {
    super(props);
    this.selectCard = this.selectCard.bind(this);
  }
  selectCard(selectedCard) {
    if (this.props.canPlay) {
      this.props.selectCard(selectedCard)
    }
  }
  render() {
    return (
      <ul className={`${this.props.canPlay ? '' : 'inactive '} hand`}>
        {this.props.cards.sort((a, b) => a < b ? 1 : - 1).map((card) => (
          <li
            onClick={this.selectCard.bind(this, card)}
            key={card}
            style={{color: colors[Math.floor((card - 1)/12)]}}
            className={card === this.props.selectedCard ? 'selected' : ''}
          >{card}</li>
        ))}
      </ul>
    )
  }
}

export default Hand;
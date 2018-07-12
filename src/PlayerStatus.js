import React from 'react';
import floatIcon from './icons/float.svg';
import waterIcon from './icons/water.svg';
import './PlayerStatus.css';


function PlayerStatus(props) {
  const floats = Array(props.player.totalFloats)
    .fill(true)
    .map((float, i) => i >= (props.player.totalFloats - props.player.remainingFloats))
  return (
    <div className="player-status">
      <div className={(props.hasHighestWaterLevel ? 'emphased' : '') + ' water-level'}>
          <div className="level">{props.player.waterLevel}</div>
          <img src={waterIcon} alt="waterIcon"></img>
        </div>
        <div className="name">{props.player.name}</div>
        <div className="floats">
          {floats.map((used, i) => <div className={(used ? 'blue' : 'red') + ' float'} key={i}>
            <img src={floatIcon} alt="floatIcon"></img>
        </div>)}
      </div>
    </div>
  )
}

export default PlayerStatus
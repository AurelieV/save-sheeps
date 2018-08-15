import React, { Component } from 'react';

export default class JoinGameForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this)
    this.pseudoRef = React.createRef();
    this.gameIdRef = React.createRef();
  }

  submit(event) {
    event.preventDefault();
    //TODO: check validity
    this.props.onSubmit(this.gameIdRef.current.value, this.pseudoRef.current.value);
  }

  render() {
    return (
      <form onSubmit={this.submit} className="form-container">
        <div className="input-container">
          <label htmlFor="pseudo">Pseudo: </label>
          <input id="pseudo" type="text" maxLength="10" ref={this.pseudoRef}></input>
        </div>
        <div className="input-container">
          <label htmlFor="gameId">Game id: </label>
          <input id="gameId" type="text" ref={this.gameIdRef}></input>
        </div>
        <button type="submit" className="primary">Join a game</button>
      </form>
    )
  }
}
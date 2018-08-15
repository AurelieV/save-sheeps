import React, { Component } from 'react';

export default class CreateGameForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this)
    this.input = React.createRef();
  }

  submit(event) {
    event.preventDefault();
    //TODO: check validity
    this.props.onSubmit(this.input.current.value);
  }

  render() {
    return (
      <form onSubmit={this.submit} className="form-container">
        <div className="input-container">
          <label htmlFor="pseudo">Pseudo: </label>
          <input id="pseudo" type="text" maxLength="10" ref={this.input}></input>
        </div>
        <button type="submit" className="primary">Create a game</button>
      </form>
    )
  }
}
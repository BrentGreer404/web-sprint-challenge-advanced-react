import React, { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(){
    super()
    this.state = initialState
  }

  getXY = (ind) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    let ind = this.state.index
    
    if (direction === "up"){
      if (ind < 3) return ind
      return (ind - 3)
    }
    if (direction === "down"){
      if (ind >= 6) return ind
      return (ind + 3)
    }
    if (direction === "right"){
      if (ind && ((ind + 1)%3 === 0)) return ind
      return (ind + 1)
    }
    if (direction === "left"){
      if ((ind )%3 === 0) return ind
      return (ind - 1)
    }
  }

  move = async (evt) => {
    const ind = this.state.index
    const newIndex = this.getNextIndex(evt.target.id)
    let newState = {...this.state, index: newIndex}
    
    if (ind != newIndex) {
      newState = ({...newState, steps: this.state.steps+1})
      console.log(this.state.steps)
    }
    this.setState(newState)
  }

  onChange = (evt) => {
    this.setState({...this.state, email: evt.target.value})
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={e => this.move(e)}>LEFT</button>
          <button id="up" onClick={e => this.move(e)}>UP</button>
          <button id="right" onClick={e => this.move(e)}>RIGHT</button>
          <button id="down" onClick={e => this.move(e)}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}

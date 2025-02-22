import axios from 'axios'
import React from 'react'

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

const URL = 'http://localhost:9000/api/result'

export default class AppClass extends React.Component {
  constructor(){
    super()
    this.state = initialState
  }

  getXY = (ind) => { 
    let i = 0
    for (let y = 0; y < 3; ++y){
      for (let x = 0; x < 3; ++x){
        if (i === ind){
          return `${x+1}${y+1}`
        }
        i++
      }
    }
  }

  getXYMessage = () => {
    const cord = this.getXY(this.state.index)
    return `Coordinates (${cord[0]}, ${cord[1]})`
  }

  reset = () => {
    this.setState(initialState)
  }
  partReset = () => {
    this.setState({...this.state, message: initialMessage, email: initialEmail})
  }

  getNextIndex = (direction) => {
    let ind = this.state.index
    
    if (direction === "up"){
      return (ind < 3) ? ind : (ind - 3)
    }
    if (direction === "down"){
      return (ind >= 6) ? ind : (ind + 3)
    }
    if (direction === "right"){
      return (ind && ((ind + 1)%3 === 0)) ? ind : (ind + 1)
    }
    if (direction === "left"){
      return ((ind )%3 === 0) ? ind : ind - 1
    }
  }

  move = (evt) => {
    const ind = this.state.index
    const newIndex = this.getNextIndex(evt.target.id)
    let newState = {...this.state, index: newIndex}
    
    if (ind != newIndex) {
      newState = ({...newState, steps: this.state.steps+1})
    }
    else{
      newState = ({...newState, message: `You can't go ${evt.target.id}`})
    }
    this.setState(newState)
  }

  onChange = (evt) => {
    evt.preventDefault()
    this.setState({...this.state, email: evt.target.value})
  }

  checkEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    const postData = {
      "x": this.getXY(this.state.index)[0],
      "y": this.getXY(this.state.index)[1],
      "steps": this.state.steps,
      "email": this.state.email
    }
    if (this.checkEmail((this.state.email))){
      axios.post(URL, postData)
      .then(res=>this.setState({...this.state, message: res.data.message}))
      .catch(err => this.setState({...this.state, message: err.response.data.message}))
      .finally(this.partReset())
    }
    else{
      if (!this.state.email.length){
        this.setState({...this.state, message: 'Ouch: email is required'})
      }
      else {
        this.setState({...this.state, message: 'Ouch: email must be a valid email'})
      }
    }
    
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps != 1 ? "times": "time"}</h3>
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
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={e => this.move(e)}>LEFT</button>
          <button id="up" onClick={e => this.move(e)}>UP</button>
          <button id="right" onClick={e => this.move(e)}>RIGHT</button>
          <button id="down" onClick={e => this.move(e)}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}

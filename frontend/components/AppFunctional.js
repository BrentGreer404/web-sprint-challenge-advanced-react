import React, { useState } from 'react'
import axios from 'axios'
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const URL = 'http://localhost:9000/api/result'

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  const getXY = (ind) => { 
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

  const getXYMessage = () => {
    const cord = getXY(index)
    return `Coordinates (${cord[0]}, ${cord[1]})`
  }

  const reset = () => {
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }
  partReset = () => {
    setMessage(initialMessage)
    setEmail(initialEmail)
  }

  const getNextIndex = (direction) => {
    let ind = index
    
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

  const move = (evt) => {
    const ind = index
    const newIndex = getNextIndex(evt.target.id)
    setIndex(newIndex)
    if (ind != newIndex) {
      setSteps(steps+1)
    }
    else{
      setMessage(`You can't go ${evt.target.id}`)
    }
  }

  const onChange = (evt) => {
    evt.preventDefault()
    setEmail(evt.target.value)
  }

  const checkEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const onSubmit = (evt) => {
    evt.preventDefault()
    const postData = {
      "x": getXY(index)[0],
      "y": getXY(index)[1],
      "steps": steps,
      "email": email
    }
    if (checkEmail((email))){
      axios.post(URL, postData)
      .then(res=> setMessage(res.data.message))
      .catch(err => setMessage(err.response.data.message))
      // .catch(err => console.log(err))
      .finally(partReset())
    }
    else{
      if (!email.length){
        setMessage('Ouch: email is required')
      }
      else {
        setMessage('Ouch: email must be a valid email')
      }
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps != 1 ? "times": "time"}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={e => move(e)}>LEFT</button>
        <button id="up" onClick={e => move(e)}>UP</button>
        <button id="right" onClick={e => move(e)}>RIGHT</button>
        <button id="down" onClick={e => move(e)}>DOWN</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

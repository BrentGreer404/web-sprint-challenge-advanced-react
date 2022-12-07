import React, { useState } from 'react'

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
  }

  const onChange = (evt) => {
    evt.preventDefault()
    setEmail(evt.target.value)
  }

  const onSubmit = (evt) => {
    evt.preventDefault()
    const postData = {
      "x": getXY(index)[0],
      "y": getXY(index)[1],
      "steps": steps,
      "email": email
    }
    console.log(postData)
    axios.post(URL, postData)
    .then(res=>console.log(res))
    .catch(err => console.log(err))
    .finally(reset())
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
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
        <h3 id="message"></h3>
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

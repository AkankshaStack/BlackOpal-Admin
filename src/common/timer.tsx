import React from 'react'
import { useEffect } from 'react'

const Timer = (props: any) => {
  const { minutes = 0, seconds = 0, setMinutes, setSeconds } = props
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)

    return () => {
      clearInterval(myInterval)
    }
  })

  return (
    <div>
      {minutes === 0 && seconds === 0 ? null : (
        <p>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </p>
      )}
    </div>
  )
}

export default Timer

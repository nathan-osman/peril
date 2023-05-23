import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../reducers/globalReducer'
import Popup from './Popup'

export default function Auth({ }) {

  const [token, setToken] = useState('')
  const [error, setError] = useState(null)

  const dispatch = useDispatch()

  function handleSubmit(e) {
    fetch('/api/verify', { headers: { token } })
      .then(r => r.json())
      .then(d => {
        if ('error' in d) {
          setError(d.error)
        } else {
          dispatch(auth({ token, role: d.role }))
        }
      })
    e.preventDefault()
  }

  function handleChange(e) {
    setToken(e.target.value)
  }

  return (
    <Popup
      title="Login Code"
      desc="Please enter the login code for joining the game."
      error={error}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={token}
          onChange={handleChange}
          autoFocus
        />
        <button type="submit">Continue</button>
      </form>
    </Popup>
  )
}

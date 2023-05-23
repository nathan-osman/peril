import { useState } from 'react'
import { useCommand } from '../lib/command'
import Popup from './Popup'

export default function Loader({ }) {

  const [data, setData] = useState('')
  const [error, setError] = useState(null)

  const command = useCommand()

  function handleSubmit(e) {
    e.preventDefault()
    command.send('/api/load', data)
      .catch(e => setError(e))
  }

  function handleChange(e) {
    setData(e.target.value)
  }

  return (
    <Popup
      title="Load Game"
      desc="Please paste a game file below to load it."
      error={error}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          rows="12"
          cols="80"
          value={data}
          onChange={handleChange}
          autoFocus
        ></textarea>
        <button type="submit">Load</button>
      </form>
    </Popup>
  )
}

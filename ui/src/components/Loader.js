import { useState } from 'react'
import Popup from './Popup'

export default function Loader({ }) {

  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <Popup
      title="Load Game"
      desc="Please paste a game file below to load it."
      error={error}
    >
      <form onSubmit={handleSubmit}>
        <textarea rows="12" cols="80" autoFocus>// Paste here</textarea>
        <button type="submit">Load</button>
      </form>
    </Popup>
  )
}

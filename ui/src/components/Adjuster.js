import { useState } from 'react'
import { useCommand } from '../lib/command'

export default function Adjuster({ index }) {

  const command = useCommand()

  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    let valueInt
    try {
      valueInt = parseInt(value)
    } catch (e) {
      alert(e)
      return
    }
    command.send('/api/adjustScore', { index, value: valueInt })
      .then(() => setValue(''))
      .catch(e => alert(e))
  }

  function handleValueChange(e) {
    setValue(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={handleValueChange}
      />
      <button type="submit">Adjust</button>
    </form>
  )
}

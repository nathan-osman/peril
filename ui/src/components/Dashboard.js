import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useCommand } from '../lib/command'
import styles from './Dashboard.module.css'

export default function Dashboard({ }) {

  const command = useCommand()

  const { round, players } = useSelector(state => {
    return {
      round: state.game.round,
      players: state.game.players
    }
  })

  const [playerName, setPlayerName] = useState('')

  function handleStartClick() {
    command.send('/api/start')
      .catch(e => alert(e))
  }

  function handlePlayerNameChange(e) {
    setPlayerName(e.target.value)
  }

  function handlePlayerNameClick(e) {
    command.send('/api/addPlayer', { name: playerName })
      .then(() => setPlayerName(''))
      .catch(e => alert(e))
  }

  let startBtn = <button type="button" onClick={handleStartClick}>Start</button>

  return (
    <div className={styles.dashboard}>
      <div className={styles.title}>Dashboard</div>
      <div>Use this to control the game.</div>
      <pre><strong>Round:</strong> {round ? round : 'idle'} {startBtn}</pre>
      <div className={styles.section}>
        <div className={styles.title}>Players</div>
        <ul>
          {players.map((p, i) => (
            <li key={i}>{p.name}</li>
          ))}
        </ul>
        <input
          type="text"
          value={playerName}
          onChange={handlePlayerNameChange}
        />
        <button type="button" onClick={handlePlayerNameClick}>Add</button>
      </div>
    </div>
  )
}

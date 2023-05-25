import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useCommand } from '../lib/command'
import Adjuster from './Adjuster'
import styles from './Dashboard.module.css'

export default function Dashboard({ }) {

  const command = useCommand()

  const { game } = useSelector(s => s)

  const [playerName, setPlayerName] = useState('')

  function handleAdvanceClick(e) {
    e.preventDefault()
    command.send('/api/advanceRound')
      .catch(e => alert(e))
  }

  function handleStartClick() {
    if (!game.players.length) {
      alert("Add some players first!")
      return
    }
    command.send('/api/startRound')
      .catch(e => alert(e))
  }

  function handleAdvanceCategoryClick(e) {
    e.preventDefault()
    command.send('/api/advanceCategory')
      .catch(e => alert(e))
  }

  function handleShowBoard(e) {
    e.preventDefault()
    command.send('/api/showBoard')
      .catch(e => alert(e))
  }

  function handlePlayerNameChange(e) {
    setPlayerName(e.target.value)
  }

  function handleAddPlayerSubmit(e) {
    e.preventDefault()
    command.send('/api/addPlayer', { name: playerName })
      .then(() => setPlayerName(''))
      .catch(e => alert(e))
  }

  function handleSetGuessingPlayer(e, i) {
    e.preventDefault()
    command.send('/api/setGuessingPlayer', { index: i })
      .catch((e) => alert(e))
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.title}>Dashboard</div>
      <div>Use this to control the game.</div>
      <div className={styles.section}>
        <div className={styles.title}>Global</div>
        <div>
          <strong>Round:</strong> {game.round}{' '}
          <a href="#" onClick={handleAdvanceClick}>[advance]</a>
        </div>
        {game.round_started && !game.categories_shown &&
          <>
            <div>
              <strong>Category:</strong>{' '}
              {game.category_index + 1}{'/'}
              {game.clues[game.round - 1].length}{' '}
              {game.category_index + 1 < game.clues[game.round - 1].length ?
                <a href="#" onClick={handleAdvanceCategoryClick}>[advance]</a> :
                <a href="#" onClick={handleShowBoard}>[show board]</a>
              }
            </div>
          </>}
        <div>
          {game.round > 0 && !game.round_started &&
            <button type="button" onClick={handleStartClick}>Start</button>}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Players</div>
        {game.players.map((p, i) => (
          <div className={styles.player} key={i}>
            {p.name} &nbsp;
            <a
              href="#"
              className={styles.guess}
              onClick={(e) => handleSetGuessingPlayer(e, i)}
            >
              [guess]
            </a>
            <br />
            <Adjuster index={i} />
          </div>
        ))}
        <form onSubmit={handleAddPlayerSubmit}>
          <div>Add a new player:</div>
          <input
            type="text"
            value={playerName}
            onChange={handlePlayerNameChange}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  )
}

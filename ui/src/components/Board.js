import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useCommand } from '../lib/command'
import Scoreboard from './Scoreboard'
import Splash from './Splash'
import styles from './Board.module.css'

const DOLLAR_AMOUNTS = [
  [200, 400, 600, 800, 1000],
  [400, 800, 1200, 1600, 2000]
]

export default function Board({ }) {

  const command = useCommand()

  const { role, round, clues } = useSelector(state => {
    return {
      role: state.global.role,
      round: state.game.round,
      clues: state.game.clues
    }
  })

  if (!round) {
    return <Splash />
  }

  const categories = clues[round - 1]
  const boardValues = DOLLAR_AMOUNTS[round - 1]

  function renderClueCell(c, i, j) {

    // Determine the correct class names to use
    let classNames = (role == 'admin' && !c.used) ?
      `${styles.cell} ${styles.clue} ${styles.admin}` :
      `${styles.cell} ${styles.clue}`

    // Handle clicks
    function handleClick() {
      command.send('/api/setClue', {
        category_index: i,
        clue_index: j,
      })
        .catch(e => alert(e))
    }

    return (
      <div className={classNames} onClick={handleClick}>
        {!c.used ? `$${boardValues[j]}` : ''}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {categories.map((c, i) => (
          <Fragment key={i}>
            <div className={`${styles.cell} ${styles.category}`}>{c.name.toUpperCase()}</div>
            {c.clues.map((c, j) => (
              <Fragment key={j}>
                {renderClueCell(c, i, j)}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
      <Scoreboard />
    </div>
  )
}

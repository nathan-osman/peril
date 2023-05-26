import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useCommand } from '../lib/command'
import Clue from './Clue'
import styles from './Board.module.css'

const DOLLAR_AMOUNTS = [
  [200, 400, 600, 800, 1000],
  [400, 800, 1200, 1600, 2000],
]

export default function Board({ }) {

  const command = useCommand()

  const { global, game } = useSelector(s => s)

  // Show the clue if one is active
  if (game.category_index !== -1 && game.clue_index !== -1) {
    return <Clue />
  }

  const categories = game.clues[game.round - 1]
  const boardValues = DOLLAR_AMOUNTS[game.round - 1]

  function renderClueCell(c, i, j) {

    const isAdmin = global.role === 'admin'

    // Determine the correct class names to use
    let classNames = (isAdmin && !c.used) ?
      `${styles.cell} ${styles.clue} ${styles.admin}` :
      `${styles.cell} ${styles.clue}`

    // Handle clicks
    function handleClick() {
      let clue = game.clues[game.round - 1][i].clues[j]
      command.send('/api/selectClue', {
        category_index: i,
        clue_index: j,
        question: clue.question,
        special: clue.special,
        clue_value: boardValues[j]
      })
        .catch(e => alert(e))
    }

    return (
      <div
        className={classNames}
        onClick={isAdmin && !c.used ? handleClick : null}
      >
        {!c.used ? `$${boardValues[j]}` : ''}
      </div>
    )
  }

  return (
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
  )
}

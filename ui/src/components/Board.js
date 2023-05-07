import styles from './Board.module.css'

const NUM_ROWS = 5
const NUM_COLUMNS = 6

const boardValues = {
  1: [200, 400, 600, 800, 1000],
  2: [400, 800, 1200, 1600, 2000]
}

export default function Board({ round, categories }) {
  return (
    <div className={styles.board}>
      {categories.map(c => (
        <>
          <div className={`${styles.cell} ${styles.category}`}>{c.name.toUpperCase()}</div>
          {c.clues.map((c, i) => (
            <div className={`${styles.cell} ${styles.clue}`}>
              {c ? `$${boardValues[round][i]}` : ''}
            </div>
          ))}
        </>
      ))}
    </div>
  )
}

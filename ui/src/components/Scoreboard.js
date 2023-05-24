import { useSelector } from 'react-redux'
import styles from './Scoreboard.module.css'

export default function Scoreboard({ }) {

  const { game } = useSelector(s => s)

  function classes(i) {
    if (i == game.guessing_player_index) {
      return `${styles.player} ${styles.active}`
    }
    return styles.player
  }

  return (
    <div className={styles.scoreboard}>
      {game.players.map((p, i) => (
        <div key={i} className={classes(i)}>
          <div className={styles.name}>{p.name}</div>
          <div className={styles.score}>
            {p.score >= 0 ?
              `$${p.score}` :
              <span className={styles.negative}>-${Math.abs(p.score)}</span>
            }
          </div>
        </div>
      ))}
    </div>
  )
}

import { useSelector } from 'react-redux'
import styles from './Scoreboard.module.css'

export default function Scoreboard({ }) {

  const { game } = useSelector(s => s)

  function classes(i) {
    if (i == game.guessing_player_index && !game.clue_special) {
      return `${styles.player} ${styles.active}`
    }
    return styles.player
  }

  // borrowed from https://stackoverflow.com/a/2901298/193619
  function thousands(v) {
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className={styles.scoreboard}>
      {game.players.map((p, i) => (
        <div key={i} className={classes(i)}>
          <div className={styles.name}>{p.name}</div>
          <div className={styles.score}>
            {p.score >= 0 ?
              `$${thousands(p.score)}` :
              <span className={styles.negative}>-${thousands(Math.abs(p.score))}</span>
            }
            {i === game.active_player_index && <div className={styles.indicator} />}
          </div>
        </div>
      ))}
    </div>
  )
}

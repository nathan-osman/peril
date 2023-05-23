import { useSelector } from 'react-redux'
import styles from './Scoreboard.module.css'

export default function Scoreboard({ }) {

  const players = useSelector(state => state.game.players)

  return (
    <div className={styles.scoreboard}>
      {players.map((p, i) => (
        <div key={i} className={styles.player}>
          <div className={styles.name}>{p.name}</div>
          <div className={styles.score}>${p.score}</div>
        </div>
      ))}
    </div>
  )
}

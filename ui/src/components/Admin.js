import { useSelector } from "react-redux"
import BoardAndScore from './BoardAndScore'
import Dashboard from './Dashboard'
import Loader from './Loader'
import styles from './Admin.module.css'

export default function Admin({ }) {

  const clues = useSelector(state => state.game.clues)

  // If clues aren't available, then show the popup for loading them
  if (typeof clues === 'undefined' || clues.length == 0) {
    return <Loader />
  }

  return (
    <div className={styles.admin}>
      <BoardAndScore />
      <Dashboard />
    </div>
  )
}

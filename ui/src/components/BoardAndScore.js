import { useSelector } from 'react-redux'
import Board from './Board'
import Category from './Category'
import Scoreboard from './Scoreboard'
import Splash from './Splash'
import styles from './BoardAndScore.module.css'

export default function BoardAndScore({ }) {

  const { game } = useSelector(s => s)

  // The game has not started yet
  if (!game.round) {
    return (
      <Splash
        title={game.game_name}
        desc="Waiting for the game to begin"
      />
    )
  }

  // The round has not started yet
  if (!game.round_started) {
    let round_name = ["First", "Second", "Third"][game.round - 1]
    if (game.round_names &&
      game.round <= game.round_names.length) {
      round_name = game.round_names[game.round - 1]
    }
    return (
      <Splash
        title={`${round_name} Round`}
        desc="Waiting for the round to begin"
      />
    )
  }

  // Showing categories?
  if (!game.categories_shown) {
    return (
      <Category />
    )
  }

  if (!('round' in game)) {
    return (
      <Splash
        title="Please wait"
        desc="Loading the game..."
      />
    )
  }

  return (
    <div className={styles.boardAndScore}>
      <Board />
      <Scoreboard />
    </div>
  )
}

import { useSelector } from "react-redux"
import Loader from './Loader'

export default function Admin({ }) {

  const clues = useSelector(state => state.game.clues)

  // If clues aren't available, then show the popup for loading them
  if (clues !== null || clues.length == 0) {
    return <Loader />
  }

  return (
    <h1>Admin</h1>
  )
}

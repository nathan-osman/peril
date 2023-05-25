import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useCommand } from '../lib/command'
import Splash from './Splash'
import styles from './Special.module.css'

export default function Special({ }) {

  const { global, game } = useSelector(s => s)
  const command = useCommand()

  const [amount, setAmount] = useState('')

  const canShowWager = global.role === 'admin' || global.role === 'host'
  const user = game.players[game.active_player_index]
  const maxAmount = Math.max(user.score, 1000)

  function handleChangeAmount(e) {
    setAmount(e.target.value)
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    let value
    try {
      value = parseInt(amount)
    } catch (e) {
      alert(e)
      return
    }
    command.send('/api/setWager', { value })
      .catch(e => alert(e))
  }

  return (
    <Splash
      title={game.special_name}
      desc="Place your wager"
    >
      {canShowWager && (
        <div className={styles.wager}>
          <div className={styles.desc}>
            Enter amount <strong>up to ${maxAmount}</strong>:
          </div>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={amount}
              onChange={handleChangeAmount}
              autoFocus
            />{' '}
            <button type="submit">Set</button>
          </form>
        </div>
      )}
    </Splash>
  )
}

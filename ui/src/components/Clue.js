import { useSelector } from 'react-redux'
import { useCommand } from '../lib/command'
import styles from './Clue.module.css'

export default function Clue({ }) {

  const command = useCommand()

  const { role, clue, activePlayer } = useSelector(state => {
    let i = state.game.active_player_index
    return {
      role: state.global.role,
      clue: state.game.clue,
      activePlayer: i === -1 ? null : state.game.players[i]
    }
  })

  function handleMarkClick(scoreDelta) {
    command.send('/api/mark', { score_delta: scoreDelta })
      .catch(e => alert(e))
  }

  const canShowAnswer = role === 'admin' || role === 'host'

  return (
    <div className={styles.clue}>
      {clue === null ?
        "[something went wrong]"
        : (
          <>
            <div className={styles.question}>{clue.question}</div>
            {canShowAnswer && (
              <div className={styles.answer}>
                <div className={styles.title}>Answer(s):</div>
                <div className={styles.text}>{clue.answer}</div>
              </div>
            )}
            {canShowAnswer && activePlayer !== null && (
              <>
                <div className={styles.answerer}>
                  <div className={styles.player}>{activePlayer.name}</div>
                  <div className={styles.buttons}>
                    <button
                      type="button"
                      onClick={() => handleMarkClick(clue.value)}
                      className={`${styles.button} ${styles.correct}`}
                    >
                      Correct
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkClick(-clue.value)}
                      className={`${styles.button} ${styles.incorrect}`}
                    >
                      Incorrect
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )
      }
    </div>
  )
}

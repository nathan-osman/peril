import { useSelector } from 'react-redux'
import { useCommand } from '../lib/command'
import styles from './Clue.module.css'

export default function Clue({ }) {

  const command = useCommand()

  const { global, game } = useSelector(s => s)

  function handleJudgeClick(correct) {
    command.send('/api/judgeAnswer', { correct })
      .catch(e => alert(e))
  }

  const canShowAnswer = global.role === 'admin' || global.role === 'host'
  const clue = game.clues[game.round - 1][game.category_index].clues[game.clue_index]

  let activePlayer = game.guessing_player_index !== -1 ?
    game.players[game.guessing_player_index] : null

  return (
    <div className={styles.clue}>
      <div className={styles.question}>{game.clue_question}</div>
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
                onClick={() => handleJudgeClick(true)}
                className={`${styles.button} ${styles.correct}`}
              >
                Correct
              </button>
              <button
                type="button"
                onClick={() => handleJudgeClick(false)}
                className={`${styles.button} ${styles.incorrect}`}
              >
                Incorrect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

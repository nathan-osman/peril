import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAudio } from '../lib/audio'
import { useCommand } from '../lib/command'
import Special from './Special'
import styles from './Clue.module.css'

export default function Clue({ }) {

  const audio = useAudio()
  const command = useCommand()

  const { global, game } = useSelector(s => s)

  function handleTimeUpClick() {
    command.send('/api/timeUp')
      .catch(e => alert(e))
  }

  function handleDiscardClick() {
    command.send('/api/discardClue')
      .catch(e => alert(e))
  }

  function handleJudgeClick(correct) {
    command.send('/api/judgeAnswer', { correct })
      .catch(e => alert(e))
  }

  useEffect(() => {
    if (!game.clue_special && game.guessing_player_index === -1 && !game.guessing_allowed) {
      audio.play('buzzer.mp3')
    }
  }, [
    game.clue_special,
    game.guessing_player_index,
    game.guessing_allowed
  ])

  useEffect(() => {
    if (game.round === 3 && game.sound_triggered) {
      audio.play('final_clue.mp3')
    }
  }, [game.round, game.sound_triggered])

  if (game.clue_special && !game.special_shown) {
    return <Special />
  }

  const canShowAnswer = global.role === 'admin' || global.role === 'host'
  const clue = game.clues[game.round - 1][game.category_index].clues[game.clue_index]

  let guessingPlayer = game.guessing_player_index !== -1 ?
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
      {canShowAnswer && guessingPlayer === null && (
        <div className={styles.buttons}>
          {game.guessing_allowed ?
            <button
              type="button"
              onClick={handleTimeUpClick}
              className={`${styles.button} ${styles.discard}`}
            >
              Buzzer
            </button> :
            <button
              type="button"
              onClick={handleDiscardClick}
              className={`${styles.button} ${styles.discard}`}
            >
              Discard
            </button>
          }
        </div>
      )
      }
      {
        canShowAnswer && guessingPlayer !== null && (
          <>
            <div className={styles.answerer}>
              <div className={styles.player}>{guessingPlayer.name}</div>
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
        )
      }
    </div >
  )
}

import { useSelector } from 'react-redux'
import { useAudio } from '../lib/audio'
import styles from './Category.module.css'
import { useEffect } from 'react'

export default function Category({ }) {

  const audio = useAudio()

  const { game } = useSelector(s => s)

  let category = game.clues[game.round - 1][game.category_index]

  useEffect(() => {
    if (game.round === 3) {
      audio.play('final_category.mp3')
    }
  }, [game.round])

  return (
    <div className={styles.category}>
      <div>{category.name}</div>
      {category.desc &&
        <div className={styles.desc}>{category.desc}</div>}
    </div>
  )
}

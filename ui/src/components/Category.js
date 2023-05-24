import { useSelector } from 'react-redux'
import styles from './Category.module.css'

export default function Category({ }) {

  const { game } = useSelector(s => s)

  let category = game.clues[game.round - 1][game.category_index]

  return (
    <div className={styles.category}>
      <div>{category.name}</div>
      {category.desc &&
        <div className={styles.desc}>{category.desc}</div>}
    </div>
  )
}

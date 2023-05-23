import styles from './Splash.module.css'

export default function Splash({ }) {
  return (
    <div className={styles.splash}>
      <div className={styles.title}>
        Peril
      </div>
      <div className={styles.subtitle}>
        Waiting for the game to begin...
      </div>
    </div>
  )
}

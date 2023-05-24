import styles from './Splash.module.css'

export default function Splash({ title, desc }) {
  return (
    <div className={styles.splash}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{desc}</div>
    </div>
  )
}

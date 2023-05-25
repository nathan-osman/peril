import styles from './Splash.module.css'

export default function Splash({ title, desc, children }) {
  return (
    <div className={styles.splash}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{desc}</div>
      {children}
    </div>
  )
}

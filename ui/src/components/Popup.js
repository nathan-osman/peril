import styles from './Popup.module.css'

export default function Popup({ title, desc, error, children }) {
  return (
    <div className={styles.popupOuter}>
      <div className={styles.popupInner}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{desc}</div>
        {error !== null &&
          <div className={styles.error}>Error: {error}</div>}
        {children}
      </div>
    </div >
  )
}

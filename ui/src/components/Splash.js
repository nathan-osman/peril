import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAudio } from '../lib/audio'
import styles from './Splash.module.css'

export default function Splash({ title, desc, sound, children }) {

  const { game } = useSelector(s => s)
  const audio = useAudio()

  useEffect(() => {
    if (sound && game.sound_triggered) {
      audio.play(sound)
    }
  }, [game.sound_triggered])

  return (
    <div className={styles.splash}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{desc}</div>
      {children}
    </div>
  )
}

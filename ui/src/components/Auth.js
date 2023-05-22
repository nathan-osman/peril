import { useState } from 'react'
import styles from './Auth.module.css'

export default function Auth({ }) {

  const [token, setToken] = useState('')

  function handleSubmit(e) {
    // TODO: check token
    e.preventDefault()
  }

  function handleChange(e) {
    setToken(e.target.value)
  }

  return (
    <div className={styles.authOuter}>
      <div className={styles.authInner}>
        <div className={styles.title}>Login Code</div>
        <div>Please enter the login code for joining the game.</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            value={token}
            onChange={handleChange}
            autoFocus
          />
          <button type="submit" className={styles.button}>Continue</button>
        </form>
      </div>
    </div>
  )
}

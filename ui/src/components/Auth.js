import { useState } from 'react'
import { auth } from '../slices/globalSlice'
import styles from './Auth.module.css'
import { useDispatch } from 'react-redux'

export default function Auth({ }) {

  const [token, setToken] = useState('')
  const [error, setError] = useState(null)

  const dispatch = useDispatch()

  function handleSubmit(e) {
    fetch('/api/verify', { headers: { token } })
      .then(r => r.json())
      .then(d => {
        if ('error' in d) {
          setError(d.error)
        } else {
          dispatch(auth({ token, role: d.role }))
        }
      })
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
        {error !== null &&
          <div className={styles.error}>Error: {error}</div>}
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

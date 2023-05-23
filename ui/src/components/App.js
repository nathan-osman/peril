import { useSelector } from 'react-redux'
import Auth from './Auth'

export default function App({ }) {

  // A token is required to connect to SSE and issue requests
  const token = useSelector(state => state.global.token)

  return (
    <>
      {token === null ? <Auth /> : <h1>{token}</h1>}
    </>
  )
}

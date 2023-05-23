import { useSelector } from 'react-redux'
import Auth from './Auth'
import { EventsProvider } from '../lib/events'

export default function App({ }) {

  // A token is required to connect to SSE and issue requests
  const global = useSelector(state => state.global)

  return (
    <>
      {global.token === null ?
        <Auth /> :
        <EventsProvider token={global.token}>
          <h1>{global.role}</h1>
        </EventsProvider>}
    </>
  )
}

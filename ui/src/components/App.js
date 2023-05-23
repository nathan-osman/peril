import { useSelector } from 'react-redux'
import { CommandProvider } from '../lib/command'
import { EventsProvider } from '../lib/events'
import Admin from './Admin'
import Auth from './Auth'

export default function App({ }) {

  // A token is required to connect to SSE and issue requests
  const global = useSelector(state => state.global)
  if (global.token === null) {
    return <Auth />
  }

  return (
    <EventsProvider token={global.token}>
      <CommandProvider>
        {
          {
            admin: <Admin />,
            host: <h1>Host</h1>,
            board: <h1>Board</h1>,
          }[global.role]
        }
      </CommandProvider>
    </EventsProvider>
  )
}

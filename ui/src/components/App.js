import { useSelector } from 'react-redux'
import { CommandProvider } from '../lib/command'
import { EventsProvider } from '../lib/events'
import Admin from './Admin'
import Auth from './Auth'
import BoardAndScore from './BoardAndScore'

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
          function () {
            switch (global.role) {
              case 'admin':
                return <Admin />
              case 'host':
              case 'board':
                return <BoardAndScore />
            }
          }()
        }
      </CommandProvider>
    </EventsProvider>
  )
}

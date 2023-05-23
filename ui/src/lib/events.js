import { createContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { sync, delta } from '../reducers/gameReducer'

const EventsContext = createContext(null)

function EventsProvider({ token, children }) {

  const dispatch = useDispatch()

  useEffect(() => {

    let eventSource = new EventSource(`/sse/${token}`)

    // Sync message
    eventSource.addEventListener('sync', e => {
      dispatch(sync(JSON.parse(e.data)))
    })

    // Delta message
    eventSource.addEventListener('delta', e => {
      dispatch(delta(JSON.parse(e.data)))
    })

  }, [])

  return (
    <EventsContext.Provider value={null}>
      {children}
    </EventsContext.Provider>
  )
}

export { EventsProvider }

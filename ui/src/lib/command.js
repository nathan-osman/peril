import { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'

const CommandContext = createContext(null)

function CommandProvider({ children }) {

  const token = useSelector(state => state.global.token)

  const command = {
    send: async function (url, data = {}) {
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          token,
          'Content-Type': 'application/json'
        },
        body: typeof data == 'string' ?
          data
          : JSON.stringify(data)
      })
      let d = await r.json()
      if ('error' in d) {
        throw d.error
      }
      return d
    }
  }

  return (
    <CommandContext.Provider value={command}>
      {children}
    </CommandContext.Provider>
  )
}

function useCommand() {
  return useContext(CommandContext)
}

export { CommandProvider, useCommand }

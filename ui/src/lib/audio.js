import { createContext, useContext, useRef } from 'react'
import { useSelector } from 'react-redux'

const AudioContext = createContext(null)

function AudioProvider({ children }) {

  let { global, game } = useSelector(s => s)

  let ref = useRef(null)

  const audio = {
    play: function (filename) {
      if (game.theme.length && global.role === 'board') {
        ref.current.src = `/themes/${game.theme}/${filename}`
        ref.current.play()
      }
    }
  }

  return (
    <AudioContext.Provider value={audio}>
      <audio ref={ref} style={{ display: 'none' }} />
      {children}
    </AudioContext.Provider>
  )
}
function useAudio() {
  return useContext(AudioContext)
}

export { AudioProvider, useAudio }

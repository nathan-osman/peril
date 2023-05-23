import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './reducers/gameReducer'
import globalReducer from './reducers/globalReducer'

export default configureStore({
  reducer: {
    game: gameReducer,
    global: globalReducer
  },
})

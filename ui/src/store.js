import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './slices/globalSlice'

export default configureStore({
  reducer: {
    global: globalReducer
  },
})

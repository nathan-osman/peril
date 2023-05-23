import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

export const gameSlice = createSlice({
  name: 'game',
  initialState: {},
  reducers: {
    sync: (_state, action) => {
      return action.payload
    },
    delta: (state, action) => {
      _.merge(state, action.payload)
    }
  }
})

export const { sync, delta } = gameSlice.actions

export default gameSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  role: null,
  init: false,
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    auth: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    }
  },
})

export const { auth } = globalSlice.actions

export default globalSlice.reducer

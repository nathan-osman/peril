import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  role: null
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    auth: (state, action) => {
      state.token = action.payload.token
      state.role = action.payload.role
    }
  }
})

export const { auth } = globalSlice.actions

export default globalSlice.reducer

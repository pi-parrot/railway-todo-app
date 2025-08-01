import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './store/auth/index.js'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
})

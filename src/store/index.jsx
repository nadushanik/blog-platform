import { configureStore } from '@reduxjs/toolkit'

import artSlice from './articlesSlice'
import authReducer from './userSlice'
const store = configureStore({
  reducer: {
    artic: artSlice,
    auth: authReducer,
  },
})

export default store

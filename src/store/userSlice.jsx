import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUserAuth = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: userData,
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)
export const fetchUserLogin = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: userData,
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.errors)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)
export const fetchUserUpdate = createAsyncThunk(
  'auth/update',
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        'https://blog-platform.kata.academy/api/user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: userData,
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.errors)
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    setUserFromToken: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserAuth.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.user.token
        localStorage.setItem('token', action.payload.user.token)
      })
      .addCase(fetchUserAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.errors || action.payload
      })

    builder
      .addCase(fetchUserLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserLogin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.user.token
        localStorage.setItem('token', action.payload.user.token)
      })
      .addCase(fetchUserLogin.rejected, (state, action) => {
        state.loading = false
        if (action.payload && action.payload.errors) {
          const errors = action.payload.errors
          if (errors['email or password']) {
            state.error = errors['email or password']
          } else {
            state.error = errors
          }
        } else {
          state.error = 'incorrect username or password'
        }
      })
    builder
      .addCase(fetchUserUpdate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserUpdate.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.user.token
        localStorage.setItem('token', action.payload.user.token)
      })
      .addCase(fetchUserUpdate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, setUserFromToken } = authSlice.actions

export default authSlice.reducer

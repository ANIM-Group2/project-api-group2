import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  userId: number
  firstName: string
  lastName: string
  email: string
  role: string
  siteId?: number
}

interface AuthState {
  user: AuthUser | null
  token: string | null
}

function loadInitialState(): AuthState {
  try {
    const token = localStorage.getItem('aeronexis_token')
    const raw   = localStorage.getItem('aeronexis_user')
    const user  = raw ? JSON.parse(raw) : null
    // Also try decoding from JWT if user not in storage
    if (token && !user) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        token,
        user: {
          userId:    payload.userId,
          firstName: payload.firstName,
          lastName:  payload.lastName,
          email:     payload.email,
          role:      payload.role,
        }
      }
    }
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token
      state.user  = action.payload.user
      localStorage.setItem('aeronexis_token', action.payload.token)
      localStorage.setItem('aeronexis_user',  JSON.stringify(action.payload.user))
    },
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('aeronexis_user', JSON.stringify(state.user))
      }
    },
    logout(state) {
      state.token = null
      state.user  = null
      localStorage.removeItem('aeronexis_token')
      localStorage.removeItem('aeronexis_role')
      localStorage.removeItem('aeronexis_user')
      window.location.href = 'http://localhost:3000'
    },
  },
})

export const { setCredentials, updateUser, logout } = authSlice.actions
export default authSlice.reducer